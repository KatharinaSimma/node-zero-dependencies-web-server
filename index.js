// import fs from 'node:fs';
import fs from 'node:fs';
import http from 'node:http';
// import path from 'node:path';
import url from 'node:url';

const port = 3000;
const server = http.createServer();

// Listen to the request event
server.on('request', (req, res) => {
  const file = 'public' + url.parse(req.url, true).pathname;
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end('404 Not Found');
    } else {
      res.setHeader('Content-type', 'text/html');
      res.end(data);
      return res.end();
    }
  });
});

server.listen(parseInt(port));
