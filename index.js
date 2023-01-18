import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';

const port = 3000;
const server = http.createServer();

// create more files
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.htm': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.doc': 'application/msword',
  '.eot': 'application/vnd.ms-fontobject',
  '.ttf': 'application/x-font-ttf',
};

server.on('request', (req, res) => {
  // First create a proper path name:
  // 1) Sanitize!
  const parsedUrl = url.parse(req.url);
  const sanitizePath = path
    .normalize(parsedUrl.pathname)
    .replace(/^(\.\.[/\\])+/, '');

  let pathname = 'public' + sanitizePath;
  // 2) Does the path extist? takes no slash
  fs.access(pathname, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end('404 Not Found');
    }
    // 3) Is the path a directory? takes a slash
    if (fs.existsSync(pathname) && fs.statSync(pathname).isDirectory()) {
      if (fs.existsSync(pathname + 'index.html')) {
        pathname += 'index.html';
      }
      if (fs.existsSync(pathname + 'index.htm')) {
        pathname += 'index.htm';
      }
    }
    // Second return a file
    fs.readFile(pathname, (error, data) => {
      if (error) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        return res.end('Something went wrong with your request. Sorry.');
      } else {
        // map extension to MIME-type
        const extension = path.parse(pathname).ext;
        res.setHeader('Content-type', mimeType[extension] || 'text/html');
        res.end(data);
      }
    });
  });
});

server.listen(parseInt(port));
