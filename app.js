const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let orders = [
  { id: 1, customer: 'John Doe', address: '123 Main St', status: 'Pending' },
  { id: 2, customer: 'Jane Smith', address: '456 Oak Ave', status: 'In Progress' }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // เสิร์ฟไฟล์ HTML, CSS, JS จากโฟลเดอร์ public
  if (pathname === '/') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }
  // ให้บริการไฟล์สไตล์ CSS และสคริปต์ JS
  else if (pathname.startsWith('/public/')) {
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath);
    let contentType = 'text/plain';

    if (ext === '.html') contentType = 'text/html';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.js') contentType = 'application/javascript';
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  }
  // API สำหรับดูคำสั่งซื้อทั้งหมด
  else if (pathname === '/orders' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(orders));
  }
  // API สำหรับเพิ่มคำสั่งซื้อใหม่
  else if (pathname === '/orders' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const newOrder = JSON.parse(body);
      newOrder.id = orders.length + 1;
      newOrder.status = 'Pending';
      orders.push(newOrder);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newOrder));
    });
  }
  // API สำหรับดูคำสั่งซื้อที่ระบุ ID
  else if (pathname.startsWith('/orders/') && req.method === 'GET') {
    const orderId = parseInt(pathname.split('/')[2]);
    const order = orders.find(o => o.id === orderId);

    if (order) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(order));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Order not found' }));
    }
  }
  // ถ้าหน้าไม่พบ
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Page Not Found' }));
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
