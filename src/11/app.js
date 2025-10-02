// 여러 템플릿 엔진(EJS, Pug, Handlebars)을 한 앱에서 비교
const path = require('path');
const express = require('express');
const app = express();

// 1) EJS 등록(기본 view engine은 ejs로 설정)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // 기본: .ejs

// 2) Pug 등록
const pug = require('pug');
app.engine('pug', pug.__express); // .pug 파일 렌더 허용

// 3) Handlebars 등록
const { engine } = require('express-handlebars');
app.engine('hbs', engine({
    extname: '.hbs',
    // 간단 eq 헬퍼 등록 (if문에서 문자열 비교용)
    helpers: {
        eq: (a, b) => String(a) === String(b)
    },
    // partialsDir은 views/hbs/partials로 자동 탐색되도록 기본값 사용
    partialsDir: path.join(__dirname, 'views', 'hbs', 'partials'),
    defaultLayout: false
}));
/*
 * 주의: app.set('view engine', ...)은 기본 엔진을 지정.
 * 우리는 기본을 ejs로 두고, pug/hbs는 확장자를 통해 명시적으로 렌더링.
 */

const sampleData = {
    title: '템플릿 엔진 비교',
    user: { name: 'Ada', role: 'admin' },
    todos: ['공부하기', '운동하기', '코드 작성하기'],
    htmlSnippet: '<strong>중요</strong>'
};

app.get('/', (req, res) => {
    res.send('템플릿 엔진 비교: /ejs, /pug, /hbs 로 이동하세요.');
});

app.get('/ejs', (req, res) => {
    // 확장자 없이 'ejs/index'라고 주면 기본 엔진(ejs)로 렌더링
    res.render('ejs/index', sampleData);
});

app.get('/pug', (req, res) => {
    // pug를 사용하려면 확장자를 명시 (index.pug)
    res.render('pug/index.pug', sampleData);
});

app.get('/hbs', (req, res) => {
    // hbs를 사용하려면 확장자를 명시 (index.hbs)
    res.render('hbs/index.hbs', sampleData);
});

app.listen(3000, () => {
    console.log('Server on http://localhost:3000 (EJS/Pug/HBS 비교)');
});
