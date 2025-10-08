const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const SECRET_KEY = 'mySecretKey'; // 실제 환경에서는 .env 파일로 분리

// 로그인 엔드포인트 - JWT 발급
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 예시용 계정
    if (username === 'admin' && password === '1234') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: '로그인 성공', token });
    } else {
        res.status(401).json({ message: '로그인 실패' });
    }
});

// JWT 인증 미들웨어
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer 토큰 추출

    if (!token) return res.status(403).json({ message: '토큰이 없습니다.' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
        req.user = user;
        next();
    });
}

// 보호된 라우트
app.get('/secure', verifyToken, (req, res) => {
    res.json({ message: `인증된 사용자: ${req.user.username}` });
});

app.listen(3000, () => console.log('JWT 서버 실행 중: http://localhost:3000'));