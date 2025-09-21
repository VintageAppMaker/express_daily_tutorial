// app.js
const http = require('http');

const server = http.createServer((req, res) => {
    res.statusCode = 200;           // 200 OK
    res.end('Hello, Node.js!');     // 간단 응답
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});