const axios = require('axios')
const esprima = require('esprima')
const { JSDOM } = require('jsdom')

const { logger } = require('../logger/logger')

class Parser {
  constructor ({ models }) {
    this.models = models
  }

  /**
   * Create not existed parsings
   * @param {Object} parsings
   * @param {Number} defaultInterval
   */
  async actualizeParsings ({ parsings, defaultInterval }) {
    const parsingPromises = parsings.map(async ({ title, url }) => {
      const parsingFromDb = await this.models.ParsingModel
        .findOne({ url })
      if (parsingFromDb !== null) return

      const parsing = new this.models.ParsingModel({
        title,
        url,
        interval: defaultInterval
      })
      return parsing.save()
    })
    return Promise.all(parsingPromises)
  }

  /**
   * Iterative parse list pages from DB "parsings"
   */
  async start () {
    const parsings = await this.models.ParsingModel.find({})
    parsings
      .forEach(async parsing => {
        const parse = async () => {
          const parseStart = Date.now()
          const products = await this.parseListPage({
            url: parsing.url,
            parsing
          })
          const duration = Date.now() - parseStart
          parsing.results.push({
            parsedAt: Date.now(),
            duration,
            products
          })
          await parsing.save()
          const parsingLabel = `Parsing finished:"${parsing.title}"`
          const delimeter = ''.padStart(parsingLabel.length, '=')
          logger.info(delimeter)
          logger.info(`Parsing finished:"${parsing.title}"`)
          logger.info(`Products parsed: ${products.length}`)
          logger.info(`Elapsed time: ${duration} ms `)
          logger.info(`${delimeter}\n`)
        }
        await parse()
        setInterval(parse, parsing.interval || process.env.defaultInterval)
      }, [])
  }

  /**
   * Get products and pagination info from certain page
   * @param {String} url
   * @param {Number} pageNum
   */
  async getListPageData ({ url, pageNum }) {
    const urlWithPage = new URL(url)
    urlWithPage.searchParams.set('page', pageNum)
    const { data } = await axios.post(urlWithPage.href, {}, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    return data
  }

  /**
   * Get extend data from product page
   * @param {String} url - product url
   */
  async parseProductPage ({ url }) {
    const { data } = await axios.get(url)
    const dom = new JSDOM(data)
    const images = []
      .slice.call(dom.window.document.querySelectorAll('#scrollImage .carousel li a'))
      .map(imageLink => imageLink.href)
    const scriptText = []
      .slice.call(dom.window.document.querySelectorAll('script'))
      .find(script => {
        return script.text.includes('wb.product.DomReady.init')
      })
      .text
    const parsedAST = esprima.parseScript(scriptText)
    const productData = parsedAST.body[6].expression.arguments[0].body.body[1].expression.arguments[0].properties[6].value.properties
    return {
      brandName: productData[3].value.value,
      brandId: productData[4].value.value,
      salesCount: productData[5].value.properties[0].value.properties[1].value.value,
      available: !productData[9].value.value,
      images
    }
  }

  /**
   * Parse list page
   * @param {String} url - url to parse
   */
  async parseListPage ({ url, parsing }) {
    try {
      const allProducts = []

      let pageNum = 1
      let totalPages = 1
      do {
        try {
          const { pagerData, products } = await this.getListPageData({
            url,
            pageNum
          })
          allProducts.push(...products)
          totalPages = pagerData.totalPages
          pageNum++
        } catch (error) {
          logger.error(error)
          pageNum = totalPages + 1
        }
      } while (pageNum <= totalPages)
      const results = []
      for (let i = 0; i < allProducts.length; i++) {
        const product = allProducts[i]
        try {
          const url = `https://www.wildberries.ru/catalog/${product.cod1S}/detail.aspx`
          const {
            brandName,
            brandId,
            salesCount,
            available,
            images
          } = await this.parseProductPage({ url })

          // get or create brand
          // TODO refactor this in one function
          let brand = await this.models.ProductBrandModel
            .findOne({ brandId })
          if (brand === null) {
            brand = new this.models.ProductBrandModel({
              brandId,
              title: brandName
            })
            await brand.save()
          }

          const productInstance = new this.models.ProductModel({
            sku: product.cod1S,
            title: product.name,
            available,
            brand,
            images,
            url,
            priceGross: product.price,
            price: product.minPrice,
            discount: product.sale,
            salesCount,
            commentsCount: product.commentsCount,
            parsedAt: Date.now(),
            parsing
          })
          results.push(await productInstance.save())
        } catch (error) {
          logger.error(error)
        }
      }
      return results
    } catch (error) {
      logger.error(error)
    }
  }
}

module.exports = {
  Parser
}
