const url = require('url');
const http = require('http');
const path = require('path');
const fs   = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  let errorHandler = function (error) {
    switch (error.code) {
      case "ENOENT":
        res.statusCode = 404;
        res.end(`No such file on disk: ${pathname}`);
        break;

      default:
        res.statusCode = 500;
        res.end('500');
    }
  }

  switch (req.method) {
    case 'GET':
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end();
        return;
      }

      const readStream = fs.createReadStream(filepath);

      readStream
          .on ('error', errorHandler)
          .pipe(res)
          .on('close', () => {readStream.destroy();})
          .on ('error', errorHandler);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
