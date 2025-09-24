// Express 불러오기
const express = require('express');
const app = express();
const PORT = 3000;

// 루트 경로
app.get('/', (req, res) => {
    res.send('홈 페이지');
});

// URL 파라미터 예제 (/user/123 → "사용자 ID: 123")
app.get('/user/:id', (req, res) => {
    res.send(`사용자 ID: ${req.params.id}`);
});

// POST 요청 처리 (/login)
app.post('/login', (req, res) => {
    res.send('로그인 요청 처리');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});