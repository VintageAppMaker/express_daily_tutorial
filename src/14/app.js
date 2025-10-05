const express = require('express');
const fs = require('fs').promises;
const app = express();

// async/await 사용 예제
app.get('/read-file', async (req, res) => {
    try {
        const content = await fs.readFile('data.txt', 'utf-8');
        res.send(`파일 내용: ${content}`);
    } catch (err) {
        res.status(500).send('파일을 읽는 중 오류가 발생했습니다.');
    }
});

// 비동기 지연 테스트
app.get('/delay', async (req, res) => {
    const msg = await new Promise(resolve => setTimeout(() => resolve('3초 후 응답 완료'), 3000));
    res.send(msg);
});

app.listen(3000, () => console.log('서버 실행 중: http://localhost:3000'));