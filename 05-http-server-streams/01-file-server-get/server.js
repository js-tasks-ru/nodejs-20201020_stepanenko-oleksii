const url = require('url');
const http = require('http');
const path = require('path');
const fs   = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end();
        break;
      }

      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end();
        break;
      }

      res.statusCode = 200;
      const readStream = fs.createReadStream(filepath);

      readStream.on('error', () => {
        res.statusCode = 500;
        res.end();
      });

      res.on('close', () => {readStream.destroy();})

      readStream.pipe(res);


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
