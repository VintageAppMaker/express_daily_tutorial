const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3000;

// 글로벌 미들웨어: 모든 요청에 로그 출력
app.use(morgan('dev'));

// 요청 시간 기록 미들웨어
app.use((req, res, next) => {
    req.requestTime = new Date();
    console.log(`요청 시간: ${req.requestTime}`);
    next();
});

// 인증 미들웨어 정의
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (token === 'secrettoken') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}

// 루트 페이지
app.get('/', (req, res) => {
    res.send(`홈페이지 - 요청 시간: ${req.requestTime}`);
});

// 인증 필요 라우트
app.get('/secure', authMiddleware, (req, res) => {
    res.send('보호된 페이지입니다.');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});