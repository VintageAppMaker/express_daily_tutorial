// Express 불러오기
const express = require('express');
const app = express();
const PORT = 3000;

// 로깅 미들웨어 (모든 요청에 적용)
app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} ${req.url}`);
    next();
});

// 라우팅
app.get('/', (req, res) => {
    res.send('홈 페이지');
});

app.get('/about', (req, res) => {
    res.send('소개 페이지');
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    res.status(500).send('에러가 발생했습니다.');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});