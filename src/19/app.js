// app.js
const express = require('express');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// 라우트 등록
app.use('/users', userRouter);
app.use('/posts', postRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));