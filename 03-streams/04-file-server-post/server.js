const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('node:fs');

const LimitSizeStream = require('./LimitSizeStream.js');

const ONE_MEGABYTE = 1048576;

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const unlinkFileWhenAborted = (stream, pathFile)=> {+
    stream.destroy();
    fs.unlink(pathFile, (err)=> {
      if (err) throw err;
    })
  };

  let limitedStream = null;

  switch (req.method) {
    case 'POST':
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('Ошибка: неверный путь до файла')
      } else {
        limitedStream = new LimitSizeStream({
          limit: ONE_MEGABYTE,
        });
         fs.stat(filepath, function(err, stat) {
          if (!err) {
            res.statusCode = 409;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end('Файл уже создан на диске');
          } else {
            const writeFileStream = fs.createWriteStream(filepath);

            writeFileStream.on('pipe', ()=> {
              req.on('aborted', unlinkFileWhenAborted.bind(null, writeFileStream, filepath));
            });
    
            writeFileStream.on('finish', ()=> {
              req.off('aborted', unlinkFileWhenAborted);
              res.statusCode = 201;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end('Файл успешно записан на диск');
            });
    
            limitedStream.on('error', (err)=> {
              unlinkFileWhenAborted(writeFileStream, filepath);
              res.statusCode = 413;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(err.message);
            });
            req.pipe(limitedStream).pipe(writeFileStream);
          }
        });

      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }


});

module.exports = server;
