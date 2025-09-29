const express = require('express');
const app = express();
const PORT = 3000;

// 요청 body JSON 파싱
app.use(express.json());

// 고의적으로 에러 발생시켜 테스트
app.get('/error', (req, res, next) => {
    next(new Error('테스트용 에러'));
});

// 정상 라우트
app.get('/', (req, res) => {
    res.send('홈 페이지');
});

// 에러 처리 미들웨어 (반드시 4개 인자 필요)
app.use((err, req, res, next) => {
    console.error('에러 로그:', err.message);
    res.status(500).json({
        success: false,
        error: err.message
    });
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});