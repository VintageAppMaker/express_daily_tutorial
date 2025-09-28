// Express 앱 생성
const express = require('express');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');

const app = express();
const PORT = 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// 라우터 연결
app.use('/users', userRouter);
app.use('/products', productRouter);

// 기본 라우트
app.get('/', (req, res) => {
    res.send('메인 페이지');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});