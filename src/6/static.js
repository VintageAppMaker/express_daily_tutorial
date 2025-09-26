// Express 및 path 모듈 불러오기
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// public 디렉토리 내 파일을 정적 리소스로 제공
app.use(express.static(path.join(__dirname, 'public')));

// 기본 라우트
app.get('/', (req, res) => {
    res.send('정적 파일 서버 실행 중');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});