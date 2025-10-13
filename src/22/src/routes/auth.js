const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run } = require('../db');

const SECRET = 'jwt-secret-key'; // 실제 프로젝트에서는 .env로 관리

// 회원가입
router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) throw new Error('필수 입력 누락');

        const exists = await get('SELECT * FROM users WHERE username = ?', [username]);
        if (exists) throw new Error('이미 존재하는 사용자입니다.');

        const hash = await bcrypt.hash(password, 10);
        await run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
        res.status(201).json({ message: '회원가입 완료' });
    } catch (err) {
        next(err);
    }
});

// 로그인
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) throw new Error('존재하지 않는 사용자입니다.');

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw new Error('비밀번호가 일치하지 않습니다.');

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
        res.json({ message: '로그인 성공', token });
    } catch (err) {
        next(err);
    }
});

// JWT 검증 미들웨어
function authRequired(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: '토큰 없음' });
    const token = header.split(' ')[1];
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(401).json({ error: '토큰 검증 실패' });
    }
}

// 보호된 라우트
router.get('/me', authRequired, (req, res) => {
    res.json({ message: '인증 성공', user: req.user });
});

module.exports = router;