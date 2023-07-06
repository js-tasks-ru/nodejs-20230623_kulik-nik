const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  let stream = null;

  switch (req.method) {
    case 'GET':
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('Ошибка: неверный путь до файла')
      } else {
        stream = fs.createReadStream(filepath);
        stream.on('error', (err)=> {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end('Ошибка:  файла на диске нет');
        });
        stream.on('open', ()=> {
          res.statusCode = 200;
          stream.pipe(res);
        });
      }

      break;

    default:
      res.statusCode = 501;
       res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('Not implemented');
  }


  req.on('aborted', ()=> {
    if(stream) {
      stream.destroy();
    }
  })
});

module.exports = server;
