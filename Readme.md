# MiMi Parser

Parser uses MongoDB. Application has separate process for database viewer: MongoDB Express.
It\`s listen `https://0.0.0.0:8081`.

## Configuration

### URLs to parse

There is the `data/parsings.json` file.

You can change this file "on the fly" to restart parsing.

### Logs

In `logs` directory.

## How to start / stop

Run (docker) command:

 * `docker-compose up`

 * `docker-compose down`

 ### Note

 Needs to add MongoDB certificates to `certs` folder
