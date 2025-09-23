// Express 불러오기
const express = require('express');
const app = express();
const PORT = 3000;

// 라우팅 예제
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.get('/about', (req, res) => {
  res.send('This is the About page.');
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running at http: //localhost:${PORT}/`);
});