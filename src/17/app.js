const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// uploads 폴더 없으면 생성
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// 저장 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// 업로드 폼 라우트
app.get('/', (req, res) => {
    res.send(`
    <h3>파일 업로드 테스트</h3>
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="file" name="myFile" />
      <button type="submit">전송</button>
    </form>
  `);
});

// 업로드 처리
app.post('/upload', upload.single('myFile'), (req, res) => {
    console.log('업로드된 파일 정보:', req.file);
    res.send(`업로드 성공! 파일명: ${req.file.filename}`);
});

app.listen(3000, () => console.log('http://localhost:3000 에서 서버 실행 중'));