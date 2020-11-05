const url = require('url');
const http = require('http');
const path = require('path');
const fs   = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  let errorHandler = function (error) {
    switch (error.code) {
      case "EEXIST":
        res.statusCode = 409;
        res.end('409');
        break;

      case "LIMIT_EXCEEDED":
        fs.unlinkSync(filepath);
        res.statusCode = 413;
        res.end('413');
        break;

      case 'ERR_STREAM_PREMATURE_CLOSE':
        fs.unlinkSync(filepath);
        res.statusCode = 500;
        res.end('500');
        break;

      default:
        fs.unlinkSync(filepath);
        res.statusCode = 500;
        res.end('500');

    }
  }

  switch (req.method) {
    case 'POST':
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end('400');
        break;
      }


      req.on('error', errorHandler)
          .on('aborted', () => {fs.unlinkSync(filepath)})
          .pipe(new LimitSizeStream({limit: 1024*1024}))
          .on('error', errorHandler)
          .pipe(new fs.WriteStream(filepath, {flags: 'wx'}))
          .on('error', errorHandler)
          .on('close', () => {
            res.statusCode = 201;
            res.end('201');
          });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
