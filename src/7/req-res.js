const express = require('express');
const app = express();
const PORT = 3000;

// JSON 형식 body 파싱을 위한 미들웨어
app.use(express.json());

// URL 파라미터와 쿼리 사용
app.get('/user/:id', (req, res) => {
    res.send(`User ID: ${req.params.id}, sort: ${req.query.sort || 'none'}`);
});

// POST body 확인
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        res.json({ success: true, message: '로그인 성공' });
    } else {
        res.status(401).json({ success: false, message: '로그인 실패' });
    }
});

// 리다이렉트
app.get('/old-route', (req, res) => {
    res.redirect('/new-route');
});
app.get('/new-route', (req, res) => {
    res.send('이곳은 새로운 경로입니다.');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});