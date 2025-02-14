// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// ตั้งค่าการเชื่อมต่อ MariaDB
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'delivery',
  query: 'SELECT fname FROM users;',
};

// ฟังก์ชันสำหรับดึงข้อมูลจาก MariaDB
const getDataFromDB = (callback) => {
  const command = `mysql -h ${dbConfig.host} -u ${dbConfig.user} -p${dbConfig.password} -D ${dbConfig.database} -e "${dbConfig.query}"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      callback([]);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      callback([]);
      return;
    }
    // แปลงผลลัพธ์เป็น Array
    const data = stdout.split('\n').slice(1).filter(line => line.trim() !== '');
    callback(data);
  });
};

// สร้างเซิร์ฟเวอร์ HTTP
const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    // ให้แสดงหน้า index.html
    const filePath = path.join(__dirname, 'views', 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/data' && req.method === 'GET') {
    // ดึงข้อมูลจาก MariaDB และส่งกลับในรูปแบบ JSON
    getDataFromDB((data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// กำหนดพอร์ตและเริ่มเซิร์ฟเวอร์
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
