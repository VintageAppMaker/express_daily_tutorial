const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// 1️⃣ CORS: 특정 도메인만 허용
app.use(cors({
    origin: 'http://localhost:4000', // 허용할 프론트엔드 주소
    methods: ['GET', 'POST']
}));

// 2️⃣ Helmet: 다양한 보안 헤더 적용
app.use(helmet());

// 3️⃣ Rate Limiter: 요청 제한
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1분
    max: 10, // 최대 요청 10회
    message: '요청이 너무 많습니다. 나중에 다시 시도하세요.'
});
app.use(limiter);

// 테스트 라우트
app.get('/', (req, res) => {
    res.send('CORS, Helmet, Rate Limit 적용 서버입니다.');
});

app.listen(3000, () => console.log('http://localhost:3000 서버 실행 중'));