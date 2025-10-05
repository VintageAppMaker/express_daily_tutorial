
# Express를 빠르게 배우는 1일 학습

> Node.js의 backend의 기본인 Express를 체화하기 위한 1일 학습과정. 하루 1개씩 학습 및 정리(빌드)하며 체화하는 과정.

# 먼저 할 일

### 1. node.js 설치하기(개발환경 설치)

- Node.js 설치: [공식 사이트](https://nodejs.org/ko/)
- 패키지 관리자(NPM): Node.js 설치 시 기본 포함되며, 외부 라이브러리 설치/실행 스크립트 관리에 사용하는 매우 중요한 툴.
- 에디터/IDE: [Visual Studio Code](https://code.visualstudio.com/) 강추
- 실행 확인: node -v, npm -v 명령으로 정상 설치 여부를 확인.
- 추가 툴: nodemon(자동 재시작), eslint(코드 검사) 등을 설치해 개발 효율을 높일 수 있다.

### 2. 간단한 예제 실행하기

아래 소스를 작성
-  check.js

```javascript
console.log("Node.js version:", process.version);
console.log("Platform:", process.platform);
console.log("Arch:", process.arch);
console.log("Current directory:", process.cwd());
console.log("Memory usage:", process.memoryUsage());

```

콘솔에서 실행 

```bash
node check.js

```

![](images/0_1.jpg)


# Day 1 — 1.1 Node.js란?

## 1) 기본설명

Node.js는 크롬 V8 엔진 위에서 동작하는 서버 사이드 JavaScript 런타임으로, 비동기 이벤트 기반/논블로킹 I/O 모델 덕분에 동시 요청 처리에 강점있다. `브라우저 밖에서 JS를 실행`할 수 있게 하며, API 서버·실시간 서비스 등에서 널리 사용된다. 

주요 특징은 다음과 같다. 
- 빠른 처리 속도(V8) 
- 방대한 NPM 생태계 
- 크로스플랫폼 지원

## 2) 코드 중심의 활용예제


아래는 Node.js 표준 `http` 모듈로 만든 최소 웹서버 예제이다(Express 없이 동작).

```js
// app.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;           // 200 OK
  res.end('Hello, Node.js!');     // 간단 응답
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

-   실행:
    ```bash
    node -v   # Node.js 버전 확인
    npm -v    # npm 버전 확인
    node app.js
    ```
-   접속: [http://localhost:3000/](http://localhost:3000/) (브라우저에서 “Hello, Node.js!” 확인) 

## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 전체구조

```
src/1/
├─ package.json
└─ app.js            # Node 기본 HTTP 서버
```

### (b) 각 소스별 주석설명

- `app.js`
  - `http.createServer(...)`: 요청(req)과 응답(res)을 받아 200 응답과 문자열 본문을 전송한다.
  - `server.listen(3000, ...)`: 3000 포트로 수신 대기 후 콘솔 로그 출력.
- `package.json` (예시)

```json
{
  "name": "node-basics",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  }
}
```

### (c) 빌드방법


1.  Node.js LTS 설치 및 버전 확인: `node -v`, `npm -v` 
2.  프로젝트 초기화(옵션): `npm init -y`
3.  실행: `npm start` 또는 `node app.js`
4.  브라우저에서 `http://localhost:3000/` 접속해 동작 확인.


## 4) 문제(3항)

```
1.  빈칸 채우기:  
    “Node.js는 ____ 기반의 ____ I/O 모델을 사용해 다수의 동시 요청을 효율적으로 처리한다.” 
2.  O/X: “Node.js는 브라우저 내부에서만 JavaScript를 실행할 수 있게 해준다.”
3.  단답: `http.createServer` 콜백의 두 인자는 각각 무엇을 의미하나?

```



# Day 2 — 1.2 Node.js의 특징 (이벤트 루프 & 논블로킹 I/O)


## 1) 기본설명


- **단일 스레드 JS + 이벤트 루프**: 애플리케이션의 JS 코드는 기본적으로 단일 스레드에서 돌지만, **이벤트 루프**가 작업 대기열을 효율적으로 처리
- **논블로킹 I/O**: 파일/네트워크 I/O는 OS 통지와 내부 스레드풀을 활용해 **대기 없이** 진행되어, 다수의 동시 요청에 강하다
- **비동기 프로그래밍 모델**: 콜백, Promise, `async/await` 등으로 고성능 비동기를 간결히 표현한다
- **빠른 실행(V8) + 거대한 생태계(NPM)**: JIT 최적화와 방대한 패키지로 개발/배포가 빠르다
- **스트리밍/버퍼 친화적**: 대용량 데이터 처리에 유리하다


## 2) 코드 중심의 활용예제


동일한 3개의 파일을 **동시에(비동기)** 읽을 때와 **순차적으로(동기)** 읽을 때의 시간을 비교한다.

```js
// main.js (발췌) — 실행: node main.js async  또는 node main.js sync
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

const files = ['data/file1.bin', 'data/file2.bin', 'data/file3.bin'];

async function asyncRead() {
  const t0 = performance.now();
  const bufs = await Promise.all(files.map(f => readFile(f)));
  const total = bufs.reduce((n, b) => n + b.length, 0);
  const t1 = performance.now();
  console.log(`[ASYNC] bytes=${total} time=${(t1 - t0).toFixed(1)}ms`);
}

function syncRead() {
  const t0 = performance.now();
  let total = 0;
  for (const f of files) total += readFileSync(f).length; // 순차적 I/O
  const t1 = performance.now();
  console.log(`[SYNC]  bytes=${total} time=${(t1 - t0).toFixed(1)}ms`);
}

const mode = process.argv[2] || 'async';
mode === 'sync' ? syncRead() : asyncRead();
```

핵심 포인트

- `Promise.all`로 **동시에 읽기** → 이벤트 루프가 대기 시간 동안 다른 작업을 처리.
- `readFileSync`는 **대기하며 블로킹** → 다음 파일로 못 넘어감.

## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 전체구조

```
src/2/
├─ package.json
├─ generate.js         # 더미 파일 생성 (각 2MB)
├─ main.js             # async vs sync 파일 읽기 비교
└─ data/               # 생성된 파일 저장 경로
```

### (b) 각 소스별 주석설명

**package.json**

```json
{
  "name": "node-features",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "gen": "node generate.js",
    "async": "node main.js async",
    "sync": "node main.js sync",
    "bench": "npm run async && npm run sync"
  }
}
```

- `"type": "module"`: ESM 사용.
- `gen/async/sync/bench` 스크립트 제공.

**generate.js**

```js
// 더미 파일 3개를 data/ 아래에 생성 (각 2MB)
import { mkdir, writeFile } from 'node:fs/promises';

const sizesMB = [2, 2, 2];
await mkdir('data', { recursive: true });

for (let i = 0; i < sizesMB.length; i++) {
  const size = sizesMB[i] * 1024 * 1024;
  const buf = Buffer.alloc(size, i); // 내용은 0x00,0x01,0x02...
  const path = `data/file${i + 1}.bin`;
  await writeFile(path, buf);
  console.log(`Created ${path} (${sizesMB[i]}MB)`);
}
console.log('Done.');
```

- `Buffer.alloc`으로 원하는 크기의 파일 생성.
- 테스트 데이터를 로컬에서 즉시 준비.

**main.js**

```js
// async(기본) 또는 sync 모드로 3개 파일 읽기 성능 비교
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

const files = ['data/file1.bin', 'data/file2.bin', 'data/file3.bin'];

async function asyncRead() {
  const t0 = performance.now();
  const bufs = await Promise.all(files.map(f => readFile(f)));
  const total = bufs.reduce((n, b) => n + b.length, 0);
  console.log(`[ASYNC] bytes=${total} time=${(performance.now() - t0).toFixed(1)}ms`);
}

function syncRead() {
  const t0 = performance.now();
  let total = 0;
  for (const f of files) total += readFileSync(f).length;
  console.log(`[SYNC]  bytes=${total} time=${(performance.now() - t0).toFixed(1)}ms`);
}

const mode = process.argv[2] || 'async';
if (mode === 'sync') syncRead();
else asyncRead();
```

-  **비동기 버전**은 `Promise.all`로 **동시에** 읽어서 장치 대기 시간이 병목된다.
-  **동기 버전**은 파일당 대기 시간이 **누적**된다.

### (c) 빌드방법

> 별도 빌드 없음(런타임 실행). Node.js만 설치되어 있으면 OK

```bash
# 1) 프로젝트 생성 & 의존성(없음)

# 2) 소스 파일 저장 (generate.js / main.js 내용 붙여넣기)

# 3) 테스트 파일 생성
npm run gen

# 4) 벤치마크 실행
npm run bench
# [ASYNC] ... ms
# [SYNC]  ... ms  
# 결과는 비동기가 언제나 빠른 것은 아니다.  
# 과부하가 없다면 동기가 빠를 수 있다. 
```


## 4) 문제(3항)
```
1. 빈칸 채우기:  
    Node.js는 ______ 기반의 ______ I/O 모델을 사용하여 대기 시간을 최소화한다.
2.  O/X:  
    “동기식 파일 읽기(`readFileSync`)는 이벤트 루프를 블로킹한다.”
3.  단답:  
    Promise.all([...])을 사용해 여러 파일을 읽을 때 성능이 향상되는 이유를 
    한 문장으로 설명하시오.
```

# Day 3 — 2.1 Express.js 소개

## 1) 기본설명

Express.js는 Node.js 환경에서 가장 널리 사용되는 웹 애플리케이션 프레임워크.

-   **경량 & 유연성**: 최소한의 핵심만 제공하고, 필요한 기능은 미들웨어를 통해 확장.
-   **라우팅 시스템**: URL과 HTTP 메서드에 따라 요청을 처리할 수 있다.
-   **미들웨어 기반 아키텍처**: 요청 → 미들웨어 체인 → 응답 구조로 동작하여, 로깅, 인증, 에러 처리 등을 손쉽게 삽입할 수 있다.
-   **대규모 생태계**: 수많은 Express 호환 라이브러리와 튜토리얼, 커뮤니티가 존재한다.


## 2) 코드 중심의 활용예제

Express로 간단한 “Hello, Express” 서버 만들기:

```js
// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// 루트 경로 GET 요청 처리
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// /about 경로 추가
app.get('/about', (req, res) => {
  res.send('This is the About page.');
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

실행 후:

*   [http://localhost:3000/](http://localhost:3000/) → “Hello, Express!”
*   [http://localhost:3000/about](http://localhost:3000/about) → “This is the About page.”

* * *

## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 전체구조

```
src/3/
├─ package.json
└─ server.js
```

### (b) 각 소스별 주석설명

**package.json**

```json
{
  "name": "express-intro",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

*   `"dependencies"`에 Express 프레임워크 추가.

**server.js**

```js
// Express 불러오기
const express = require('express');
const app = express();
const PORT = 3000;

// 라우팅 예제
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.get('/about', (req, res) => {
  res.send('This is the About page.');
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

### (c) 빌드방법

```bash
# 1. 프로젝트 생성

# 2. Express 설치
npm install express

# 3. 서버 실행
npm start

# 4. 브라우저에서 접속
http://localhost:3000
```


### 4) 문제(3항)

```
1.  빈칸 채우기: Express.js는 ______ 기반 아키텍처를 통해 요청과 응답을 처리한다.
2.  O/X: Express.js는 Node.js에 내장된 표준 라이브러리이다.
3.  단답: Express 앱에서 HTTP GET 요청에 응답하려면 어떤 메서드를 사용해야 하는가?
```

# Day 4 — 2.2 Express.js 라우팅 기본

## 1) 기본설명

Express.js의 가장 핵심 기능 중 하나는 **라우팅(Routing)** 이다.  
라우팅은 클라이언트의 **HTTP 메서드(GET, POST, PUT, DELETE 등)** 와 **URL 경로**에 따라 실행할 동작(핸들러 함수)을 정의하는 과정이다.

-   **라우트 구성 요소**
    -   HTTP 메서드 (예: `app.get`, `app.post`)
    -   경로 (예: `'/'`, `'/users'`)
    -   핸들러 함수 `(req, res) => {...}`
-   **특징**
    -   직관적이며 코드 가독성이 높음
    -   정규식 기반 경로 지정 가능
    -   파라미터와 쿼리스트링을 쉽게 처리 가능


## 2) 코드 중심의 활용예제

기본 라우팅 예제:

```js
// routes.js
const express = require('express');
const app = express();
const PORT = 3000;

// GET /
app.get('/', (req, res) => {
  res.send('홈 페이지');
});

// GET /user/:id
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;  // URL 파라미터
  res.send(`사용자 ID: ${userId}`);
});

// POST /login
app.post('/login', (req, res) => {
  res.send('로그인 요청 처리');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 전체구조

```
src/4/
├─ package.json
├─ routes.js
└─ testclient.txt 
```

### (b) 각 소스별 주석설명

**package.json**

```json
{
  "name": "express-routing",
  "version": "1.0.0",
  "main": "routes.js",
  "scripts": {
    "start": "node routes.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

*   `express`를 의존성에 추가.
*   `npm start` 실행 시 `routes.js` 실행.

**routes.js**

```js
// Express 불러오기
const express = require('express');
const app = express();
const PORT = 3000;

// 루트 경로
app.get('/', (req, res) => {
  res.send('홈 페이지');
});

// URL 파라미터 예제 (/user/123 → "사용자 ID: 123")
app.get('/user/:id', (req, res) => {
  res.send(`사용자 ID: ${req.params.id}`);
});

// POST 요청 처리 (/login)
app.post('/login', (req, res) => {
  res.send('로그인 요청 처리');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

### (c) 빌드방법

```bash
# 1. 프로젝트 생성

# 2. Express 설치
npm install express

# 3. 서버 실행
npm start

# 4. 테스트(testclient.txt)
curl http://localhost:3000/
curl http://localhost:3000/user/101
curl -X POST http://localhost:3000/login
```


4) 문제(3항)

```
1.  빈칸 채우기: Express 라우팅은 HTTP ______와 URL ______를 조합하여 요청을 처리한다.
2.  O/X: `app.get('/user/:id', ...)`에서 `:id`는 URL 파라미터를 의미한다.
3.  단답: POST 요청을 처리하기 위해 사용하는 Express 메서드는 무엇인가?
```


# Day 5 — 2.3 Express.js 미들웨어 기본

## 1) 기본설명

Express.js의 \*\*미들웨어(Middleware)\*\*는 요청(Request)과 응답(Response) 사이에서 실행되는 함수.

-   **동작 원리**: `req`와 `res` 객체를 조작하거나, 로깅·인증·에러처리 같은 공통 기능을 수행한 뒤 `next()`를 호출하여 다음 미들웨어/라우터로 제어를 넘긴다.
-   **형식**: `(req, res, next) => { ... }`
-   **종류**
    *   애플리케이션 레벨 미들웨어: `app.use(...)`로 등록
    *   라우터 레벨 미들웨어: 특정 라우터에만 적용
    *   에러 처리 미들웨어: `(err, req, res, next)` 형태
-   **활용 예시**: 요청 로깅, Body 파싱, 인증/인가, 정적 파일 제공



## 2) 코드 중심의 활용예제

간단한 로깅 미들웨어와 라우팅 적용:

```js
// middleware-example.js
const express = require('express');
const app = express();
const PORT = 3000;

// 애플리케이션 레벨 미들웨어
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // 다음 핸들러로 이동
});

// 라우트
app.get('/', (req, res) => {
  res.send('홈 페이지');
});

app.get('/about', (req, res) => {
  res.send('소개 페이지');
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('서버 에러 발생');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```


## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 전체구조

```
src/5/
├─ package.json
└─ middleware.js
```

### (b) 각 소스별 주석설명

**package.json**

```json
{
  "name": "express-middleware",
  "version": "1.0.0",
  "main": "middleware.js",
  "scripts": {
    "start": "node middleware.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**middleware.js**

```js
// Express 불러오기
const express = require('express');
const app = express();
const PORT = 3000;

// 로깅 미들웨어 (모든 요청에 적용)
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url}`);
  next();
});

// 라우팅
app.get('/', (req, res) => {
  res.send('홈 페이지');
});

app.get('/about', (req, res) => {
  res.send('소개 페이지');
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(500).send('에러가 발생했습니다.');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

### (c) 빌드방법

```bash
# 1. 프로젝트 생성

# 2. Express 설치
npm install express

# 3. 서버 실행
npm start

# 4. 브라우저/터미널에서 확인(testclinet.txt)
curl http://localhost:3000/
curl http://localhost:3000/about
```

실행 시 콘솔에 `[LOG] GET /` 같은 로그가 출력됨.

* * *

4) 문제(3항)
---------

1.  빈칸 채우기: Express 미들웨어는 `(req, res, ______)` 형식의 함수를 기본으로 한다.
2.  O/X: 미들웨어에서 `next()`를 호출하지 않으면 요청 처리가 다음 단계로 넘어가지 않는다.
3.  단답: 에러 처리 미들웨어 함수의 매개변수는 몇 개인가?



# Day 6 — 2.4 Express.js 정적 파일 제공

## 1) 기본설명

Express.js는 \*\*정적 파일(static files)\*\*을 쉽게 서비스할 수 있는 기능을 제공한다. 

-   **정적 파일**: HTML, CSS, JS, 이미지, 폰트 등 서버에서 가공 없이 그대로 클라이언트로 전달되는 리소스.
-   **`express.static` 미들웨어**: 특정 디렉토리를 정적 파일 제공 경로로 지정할 수 있음.
-   **활용 예시**:
    -   웹사이트의 CSS·이미지 배포
    -   프론트엔드 SPA(React, Vue) 빌드 파일 제공
    -   단순 정적 리소스 공유


## 2) 코드 중심의 활용예제

```js
// static-example.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// "public" 디렉토리를 정적 파일 제공 경로로 지정
app.use(express.static(path.join(__dirname, 'public')));

// 라우트 (테스트용)
app.get('/', (req, res) => {
  res.send('정적 파일 예제 서버');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

-   `http://localhost:3000/style.css` 요청 시 `public/style.css` 파일 자동 제공
-   `http://localhost:3000/images/logo.png` 요청 시 `public/images/logo.png` 제공


## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 전체구조

```
src/6/
├─ package.json
├─ static.js
└─ public/
   ├─ index.html
   ├─ style.css
   └─ images/
      └─ logo.png
```

### (b) 각 소스별 주석설명

**package.json**

```json
{
  "name": "express-static",
  "version": "1.0.0",
  "main": "static.js",
  "scripts": {
    "start": "node static.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**static.js**

```js
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
```

**public/index.html**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>정적 파일 예제</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Express 정적 파일 제공</h1>
  <img src="/images/logo.png" alt="로고">
</body>
</html>
```

**public/style.css**

```css
body {
  font-family: sans-serif;
  background-color: #f4f4f4;
  text-align: center;
}
h1 {
  color: #2c3e50;
}
```

### (c) 빌드방법

```bash
# 1. 프로젝트 생성

# 2. Express 설치
npm install express

# 3. public 디렉토리 및 예제 파일 생성
# (index.html, css, logo.png)

# 4. 서버 실행
npm start

# 5. 브라우저에서 확인
http://localhost:3000/index.html
```


### 4) 문제(3항)

```
1.  빈칸 채우기: Express에서 정적 파일을 제공할 때 사용하는 내장 미들웨어는 `express.______` 이다.
2.  O/X: `express.static`을 사용하면 지정한 디렉토리 내 파일들이 URL을 통해 바로 접근 가능하다.
3.  단답: `public` 폴더 안에 있는 `style.css`를 브라우저에서 불러오려면 어떤 URL로 접근해야 하는가?
```

# Day 7 — 2.5 Express.js 요청과 응답 객체

## 1) 기본설명

Express.js에서 모든 라우트 핸들러는 두 가지 핵심 객체를 인자로 받는다.

*   **요청 객체 (`req`)**: 클라이언트가 보낸 HTTP 요청의 정보(헤더, 파라미터, 쿼리스트링, 바디 등)를 포함.
*   **응답 객체 (`res`)**: 서버에서 클라이언트로 보낼 응답을 제어. 텍스트/JSON 응답, 상태 코드 지정, 리다이렉트 등 다양한 메서드 제공.

**주요 `req` 속성**

*   `req.params`: URL 파라미터
*   `req.query`: 쿼리스트링 파라미터
*   `req.body`: POST/PUT 요청 본문(BodyParser나 express.json() 필요)
*   `req.headers`: 요청 헤더

**주요 `res` 메서드**

*   `res.send()`: 문자열, 버퍼, 객체 등을 응답
*   `res.json()`: JSON 응답
*   `res.status()`: HTTP 상태 코드 설정
*   `res.redirect()`: 다른 URL로 리다이렉트


## 2) 코드 중심의 활용예제

```js
// req-res.js
const express = require('express');
const app = express();
const PORT = 3000;

// JSON body 파싱 미들웨어
app.use(express.json());

// GET /user/:id 요청 → params, query 확인
app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  const sort = req.query.sort;
  res.send(`User ID: ${id}, sort: ${sort || 'none'}`);
});

// POST /login 요청 → body 확인
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    res.json({ success: true, message: '로그인 성공' });
  } else {
    res.status(401).json({ success: false, message: '로그인 실패' });
  }
});

// 리다이렉트 예제
app.get('/old-route', (req, res) => {
  res.redirect('/new-route');
});
app.get('/new-route', (req, res) => {
  res.send('이곳은 새로운 경로입니다.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```


## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 전체구조

```
src/7
├─ package.json
├─ req-res.js
└─ README.md
```

### (b) 각 소스별 주석설명

**package.json**

```json
{
  "name": "express-req-res",
  "version": "1.0.0",
  "main": "req-res.js",
  "scripts": {
    "start": "node req-res.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**req-res.js**

```js
const express = require('express');
const app = express();
const PORT = 3000;

// JSON 형식 body 파싱을 위한 미들웨어
app.use(express.json());

// URL 파라미터와 쿼리 사용
app.get('/user/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}, sort: ${req.query.sort || 'none'}`);
});

// POST body 확인
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    res.json({ success: true, message: '로그인 성공' });
  } else {
    res.status(401).json({ success: false, message: '로그인 실패' });
  }
});

// 리다이렉트
app.get('/old-route', (req, res) => {
  res.redirect('/new-route');
});
app.get('/new-route', (req, res) => {
  res.send('이곳은 새로운 경로입니다.');
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

### (c) 빌드방법

```bash
# 1. 프로젝트 생성

# 2. Express 설치
npm install express

# 3. 서버 실행
npm start

# 4. 테스트
curl http://localhost:3000/user/101?sort=desc
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"admin","password":"1234"}'
curl -v http://localhost:3000/old-route
```


## 4) 문제(3항)

```
1.  빈칸 채우기: `req.params`, `req.query`, `req.body`는 각각 ______, ______, ______ 데이터를 담는다.
2.  O/X: `res.status(404).send('Not Found')`는 상태 코드와 메시지를 동시에 전송할 수 있다.
3.  단답: 클라이언트를 다른 URL로 이동시키는 데 사용하는 `res` 메서드는 무엇인가?
```

# Day 8 — 2.6 Express.js 라우터 모듈화

## 1) 기본설명

애플리케이션이 커질수록 모든 라우트를 한 파일(`app.js`)에 작성하는 것은 관리가 어렵다.  
Express.js는 **Router 객체**를 제공하여 라우팅 로직을 모듈화할 수 있다.

-   **`express.Router()`**
    -   미니 Express 애플리케이션과 같은 객체
    -   라우팅 관련 메서드(`get`, `post`, `put`, `delete`)를 지원
    -   독립적으로 미들웨어를 설정 가능
-   **장점**
    -   코드 가독성 향상
    -   역할별 라우트 분리(예: `/users`, `/products`)
    -   유지보수성 증가


## 2) 코드 중심의 활용예제

```js
// app.js
const express = require('express');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');

const app = express();
const PORT = 3000;

// 미들웨어
app.use(express.json());

// 라우터 등록
app.use('/users', userRouter);
app.use('/products', productRouter);

app.get('/', (req, res) => {
  res.send('메인 페이지');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

// routes/user.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('사용자 목록');
});

router.get('/:id', (req, res) => {
  res.send(`사용자 ID: ${req.params.id}`);
});

module.exports = router;

// routes/product.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('상품 목록');
});

router.post('/', (req, res) => {
  res.send('상품 등록 완료');
});

module.exports = router;
```


## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 전체구조

```
src/8/
├─ package.json
├─ app.js
└─  routes/
   ├─ user.js
   └─ product.js
```

### (b) 각 소스별 주석설명

**package.json**

```json
{
  "name": "express-router",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**app.js**

```js
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
```

**routes/user.js**

```js
const express = require('express');
const router = express.Router();

// 사용자 목록
router.get('/', (req, res) => {
  res.send('사용자 목록');
});

// 특정 사용자 조회
router.get('/:id', (req, res) => {
  res.send(`사용자 ID: ${req.params.id}`);
});

module.exports = router;
```

**routes/product.js**

```js
const express = require('express');
const router = express.Router();

// 상품 목록
router.get('/', (req, res) => {
  res.send('상품 목록');
});

// 상품 등록
router.post('/', (req, res) => {
  res.send('상품 등록 완료');
});

module.exports = router;
```

### (c) 빌드방법

```bash
# 1. 프로젝트 생성

# 2. Express 설치
npm install express

# 3. routes 디렉토리 생성 후 user.js, product.js 작성

# 4. 서버 실행
npm start

# 5. 테스트
curl http://localhost:3000/
curl http://localhost:3000/users
curl http://localhost:3000/users/10
curl http://localhost:3000/products
curl -X POST http://localhost:3000/products
```

## 4) 문제(3항)

```
1.  빈칸 채우기: Express의 라우터 객체는 `express.______()`로 생성한다.
2.  O/X: 라우터 모듈은 `module.exports = router`를 통해 내보내야 한다.
3.  단답: `/users/:id` 경로를 처리하는 라우트를 만들기 위해 사용하는 Express 객체는 무엇인가?
```

# Day 9 — 2.7 Express.js 에러 처리

## 1) 기본설명

Express.js는 요청 처리 중 발생하는 오류를 효과적으로 다루기 위해 **에러 처리 미들웨어**를 제공한다.

-   **형식**: `(err, req, res, next)` → 네 개의 매개변수 필수
-   **동작 원리**: 라우터나 일반 미들웨어에서 `next(err)`를 호출하면 에러 처리 미들웨어로 흐름이 이동
-   **활용 예시**
    -   사용자 입력 오류 처리
    -   인증/인가 실패 응답
    -   서버 내부 오류 로그 기록
    -   공통 에러 응답 포맷 제공


## 2) 코드 중심의 활용예제

```js
// error.js
const express = require('express');
const app = express();
const PORT = 3000;

// JSON 파서 미들웨어
app.use(express.json());

// 고의 에러 발생 라우트
app.get('/error', (req, res, next) => {
  const err = new Error('의도적으로 발생시킨 에러');
  next(err); // 에러 처리 미들웨어로 전달
});

// 정상 라우트
app.get('/', (req, res) => {
  res.send('홈 페이지');
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error('[에러 발생]', err.message);
  res.status(500).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 전체구조

```
src/9/
├─ package.json
└─ error.js
```

### (b) 각 소스별 주석설명

**package.json**

```json
{
  "name": "express-error",
  "version": "1.0.0",
  "main": "error.js",
  "scripts": {
    "start": "node error.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

**error.js**

```js
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
```

### (c) 빌드방법

```bash
# 1. 프로젝트 생성

# 2. Express 설치
npm install express

# 3. 서버 실행
npm start

# 4. 테스트
curl http://localhost:3000/
curl http://localhost:3000/error
```

## 4) 문제(3항)

```
1.  빈칸 채우기: Express 에러 처리 미들웨어는 반드시 매개변수 ____개를 가져야 한다.
2.  O/X: 일반 미들웨어에서 `next(err)`를 호출하면 에러 처리 미들웨어로 제어가 넘어간다.
3.  단답: 클라이언트에게 HTTP 상태 코드 500과 JSON 응답을 동시에 보내려면 어떤 `res` 메서드 체인을 사용하는가?
```
# Day 10 — 2.8 Express.js 미들웨어 고급

## 1) 기본설명

미들웨어(Middleware)는 Express.js에서 요청(request)과 응답(response) 사이에서 실행되는 함수다.
기본 미들웨어 개념은 이미 다뤘지만, 심화에서는 다음과 같은 주제를 이해하는 것이 중요.

-   **미들웨어 실행 순서**: `app.use()` 또는 `app.METHOD()`에 등록된 순서대로 실행됨
-   **다중 미들웨어 체이닝**: 하나의 라우트에 여러 개의 미들웨어를 등록 가능
-   **조건부 미들웨어**: 특정 조건(로그인 여부, 특정 URL)에 따라 미들웨어 실행
-   **써드파티 미들웨어**: morgan(로그), cors(CORS 처리), helmet(보안 헤더) 등
-   **글로벌 vs 라우터 전용**:
    -   글로벌: `app.use()`로 등록 → 모든 요청에 적용
    -   라우터 전용: 특정 라우터에서만 적용


## 2) 코드 중심의 활용예제

```js
// middleware-advanced.js
const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3000;

// 1. 글로벌 미들웨어 (요청 로깅)
app.use(morgan('dev'));

// 2. 커스텀 미들웨어 - 요청 시간 기록
app.use((req, res, next) => {
  req.requestTime = new Date();
  console.log(`[${req.method}] ${req.url} - ${req.requestTime}`);
  next();
});

// 3. 조건부 미들웨어 - 인증 체크
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (token === 'secrettoken') {
    next(); // 인증 성공 → 다음 미들웨어/라우트로 이동
  } else {
    res.status(401).json({ success: false, message: '인증 실패' });
  }
}

// 기본 라우트
app.get('/', (req, res) => {
  res.send(`홈페이지 - 요청 시간: ${req.requestTime}`);
});

// 인증이 필요한 라우트
app.get('/secure', authMiddleware, (req, res) => {
  res.send('보호된 페이지 접근 성공');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 전체구조

```
src/10/
├─ package.json
└─ middleware-advanced.js
```

### (b) 각 소스별 주석설명

**package.json**

```json
{
  "name": "express-middleware-advanced",
  "version": "1.0.0",
  "main": "middleware-advanced.js",
  "scripts": {
    "start": "node middleware-advanced.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "morgan": "^1.10.0"
  }
}
```

**middleware-advanced.js**

```js
const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3000;

// 글로벌 미들웨어: 모든 요청에 로그 출력
app.use(morgan('dev'));

// 요청 시간 기록 미들웨어
app.use((req, res, next) => {
  req.requestTime = new Date();
  console.log(`요청 시간: ${req.requestTime}`);
  next();
});

// 인증 미들웨어 정의
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (token === 'secrettoken') {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}

// 루트 페이지
app.get('/', (req, res) => {
  res.send(`홈페이지 - 요청 시간: ${req.requestTime}`);
});

// 인증 필요 라우트
app.get('/secure', authMiddleware, (req, res) => {
  res.send('보호된 페이지입니다.');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

### (c) 빌드방법

```bash
# 1. 프로젝트 생성

# 2. 의존성 설치
npm install express morgan

# 3. 서버 실행
npm start

# 4. 테스트
curl http://localhost:3000/
curl http://localhost:3000/secure        # → 인증 실패
curl -H "Authorization: secrettoken" http://localhost:3000/secure  # → 인증 성공
```


## 4) 문제(3항)

```
1.  빈칸 채우기: Express에서 미들웨어가 실행되는 순서는 등록된 ______ 순서대로이다.
2.  O/X: 특정 라우트에만 미들웨어를 적용할 수 있다.
3.  단답: 인증 로직을 공통적으로 처리할 때 사용하는 Express 기능은 무엇인가?
```

# Day 11 — 템플릿 엔진 문법 (EJS · Pug · Handlebars)

## 1) 기본설명

Express.js는 서버 측에서 HTML을 동적으로 생성하기 위해 **템플릿 엔진**을 사용한다. 주로 **EJS**, **Pug**, **Handlebars**를 사용한다.

-   **EJS**: HTML 친화적. JS 문법을 그대로 사용하며 `<% %>` 계열 태그로 제어/출력을 수행.
-   **Pug**: 들여쓰기 기반의 간결한 문법. 태그 생략, 속성은 괄호 표기, `#{}`(escape), `!{}`(unescape) 보간.
-   **Handlebars**: Mustache 계열. `{{ }}` 보간, `{{#if}}`, `{{#each}}` 블록 도우미, 부분 템플릿(Partials)과 레이아웃 패턴이 강점.


## 2) 코드 중심의 활용예제 (문법 비교)

### 2-1. 공통 데이터(예시)

```js
// 서버에서 템플릿으로 전달할 데이터 예시
const data = {
  title: '템플릿 엔진 비교',
  user: { name: 'Ada', role: 'admin' },
  todos: ['공부하기', '운동하기', '코드 작성하기'],
  htmlSnippet: '<strong>중요</strong>'
};
```

### 2-2. EJS 문법 요약

*   출력(escape): `<%= value %>`
*   원문 출력(unescape): `<%- html %>`
*   제어(로직): `<% if(...) { %> ... <% } %>`
*   partial(include): `<%- include('partials/item', {x:1}) %>`

```ejs
<!-- views/ejs/index.ejs -->
<!DOCTYPE html>
<html>
<head><title><%= title %></title></head>
<body>
  <h1>EJS: <%= title %></h1>

  <!-- 변수 출력 -->
  <p>사용자: <%= user.name %> (role: <%= user.role %>)</p>

  <!-- 조건문 -->
  <% if (user.role === 'admin') { %>
    <p>관리자 전용 메뉴 표시</p>
  <% } else { %>
    <p>일반 사용자</p>
  <% } %>

  <!-- 반복문 -->
  <h3>오늘의 할 일</h3>
  <ul>
    <% todos.forEach(function(t){ %>
      <li><%= t %></li>
    <% }) %>
  </ul>

  <!-- escape vs unescape -->
  <p>escape: <%= htmlSnippet %></p>
  <p>unescape: <%- htmlSnippet %></p>

  <!-- partial include -->
  <%- include('partials/footer', { year: 2025 }) %>
</body>
</html>
```

```ejs
<!-- views/ejs/partials/footer.ejs -->
<hr/>
<small>© <%= year %> EJS Footer</small>
```

### 2-3. Pug 문법 요약

-   들여쓰기로 계층 구조 표현, 태그명만 써도 요소 생성
-   속성: `tag(attr="val", another=expr)`
-   보간: `#{expr}`(escape), `!{expr}`(unescape)
-   반복: `each item in list`
-   조건: `if/else if/else`
-   mixin/extend 등 고급 문법 존재(여기선 핵심만)

```pug
//- views/pug/index.pug
doctype html
html
  head
    title= title
  body
    h1 Pug: #{title}

    p 사용자: #{user.name} (role: #{user.role})

    if user.role === 'admin'
      p 관리자 전용 메뉴 표시
    else
      p 일반 사용자

    h3 오늘의 할 일
    ul
      each t in todos
        li= t

    //- escape vs unescape
    p escape: #{htmlSnippet}
    p unescape: !{htmlSnippet}

    include ./partials/footer
```

```pug
//- views/pug/partials/footer.pug
hr
small © 2025 Pug Footer
```

### 2-4. Handlebars 문법 요약

*   출력(escape): `{{value}}`
*   원문 출력(unescape): `{{{html}}}`
*   조건: `{{#if cond}} ... {{else}} ... {{/if}}`
*   반복: `{{#each list}} ... {{/each}}`
*   부분 템플릿(Partial): `{{> partialName context}}`
*   레이아웃(보통 `express-handlebars`)에서 `{{{body}}}`로 콘텐츠 삽입

```hbs
{{!-- views/hbs/index.hbs --}}
<!DOCTYPE html>
<html>
  <head><title>{{title}}</title></head>
  <body>
    <h1>Handlebars: {{title}}</h1>

    <p>사용자: {{user.name}} (role: {{user.role}})</p>

    {{#if (eq user.role "admin")}}
      <p>관리자 전용 메뉴 표시</p>
    {{else}}
      <p>일반 사용자</p>
    {{/if}}

    <h3>오늘의 할 일</h3>
    <ul>
      {{#each todos}}
        <li>{{this}}</li>
      {{/each}}
    </ul>

    <p>escape: {{htmlSnippet}}</p>
    <p>unescape: {{{htmlSnippet}}}</p>

    {{> footer year=2025}}
  </body>
</html>
```

```hbs
{{!-- views/hbs/partials/footer.hbs --}}
<hr/>
<small>© {{year}} HBS Footer</small>
```

> 참고: `eq`와 같은 헬퍼가 필요합니다(아래 프로젝트 예제에서 등록).


## 3) 데스크탑에서 빌드할 수 있는 예제

한 프로젝트에서 **세 엔진을 모두 등록**하고, 각각 `/ejs`, `/pug`, `/hbs`로 렌더링하는 예제.

### (a) 프로젝트 전체구조

```
src/11/
├─ package.json
├─ app.js
└─ views/
   ├─ ejs/
   │  ├─ index.ejs
   │  └─ partials/
   │     └─ footer.ejs
   ├─ pug/
   │  ├─ index.pug
   │  └─ partials/
   │     └─ footer.pug
   └─ hbs/
      ├─ index.hbs
      └─ partials/
         └─ footer.hbs
```

### (b) 각 소스별 주석설명

**package.json**

```json
{
  "name": "day12-templates",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "ejs": "^3.1.10",
    "express": "^4.19.2",
    "express-handlebars": "^7.1.3",
    "pug": "^3.0.2"
  }
}
```

**app.js**

```js
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

```

**views/ejs/index.ejs** – 위 2-2 코드 사용  
**views/ejs/partials/footer.ejs** – 위 2-2 코드 사용

**views/pug/index.pug** – 위 2-3 코드 사용  
**views/pug/partials/footer.pug** – 위 2-3 코드 사용

**views/hbs/index.hbs** – 위 2-4 코드 사용  
**views/hbs/partials/footer.hbs** – 위 2-4 코드 사용

#### (c) 빌드방법

```bash
# 1) 프로젝트 생성
mkdir day12-templates && cd day12-templates
npm init -y

# 2) 의존성 설치
npm i express ejs pug express-handlebars

# 3) 디렉토리/파일 생성
# (위 구조대로 views/ejs|pug|hbs와 파일들을 작성)

# 4) 실행
npm start
# 또는
node app.js

# 5) 확인
# 브라우저에서 각각 비교
http://localhost:3000/ejs
http://localhost:3000/pug
http://localhost:3000/hbs
```

* * *

### 4) 문제(3항)

1.  **빈칸 채우기**
    *   EJS에서 escape 출력은 `<%= %>`, 원문(unescape) 출력은 `<%- %>` 이다.
    *   Pug에서 escape 보간은 `#{}`, 원문(unescape) 보간은 `!{}` 이다.
    *   Handlebars에서 escape 출력은 `{{ }}`, 원문(unescape) 출력은 `{{{ }}}` 이다.  
        위 문장에서 빈칸에 들어갈 **보간/출력 표기**를 각각 쓰시오.
2.  **O/X**
    *   ( ) Express에서 한 애플리케이션에 여러 템플릿 엔진을 동시에 등록할 수 없다.
    *   ( ) Handlebars에서 `{{#each items}}`는 반복을 의미하며, `{{this}}`는 현재 아이템을 뜻한다.
3.  **단답**
    *   Handlebars에서 `user.role`이 `"admin"`인 조건을 템플릿에서 판별하려면 어떤 **헬퍼**를 등록해 사용할 수 있는가? (예: 문자열 동등성 비교) 간단한 함수 형태로 작성하시오.

> 온라인 실습(선택):  
> • EJS Playground: https://ejs.co/#try  
> • Pug REPL: https://pugjs.org/language/attributes.html (Docs 내 Try 영역)  
> • Handlebars Try: https://tryhandlebarsjs.com/


# Day 13 — RESTful API 설계와 Express 라우팅 패턴


## 1) 기본설명

-   **RESTful API**란?
    -   **REST(Representational State Transfer)** 원칙을 기반으로 설계된 API.
    -   자원(Resource)을 URI로 표현하고, HTTP 메서드(GET, POST, PUT, DELETE 등)로 동작을 구분.
-   **주요 특징**
    -   클라이언트-서버 구조
    -   무상태(Stateless)
    -   일관된 URI 설계
    -   표준 HTTP 메서드 활용
-   **Express 라우팅 패턴**
    -   REST API에서 라우팅은 핵심.
    -   표준 HTTP 메서드 활용
-   **Express 라우팅 패턴**
    -   `/users`, `/users/:id` 같은 **자원 중심 URI**를 사용.
    -   메서드별 의미:
        -   `GET /users` → 전체 사용자 목록
        -   `POST /users` → 새 사용자 생성
        -   `GET /users/:id` → 특정 사용자 조회
        -   `PUT /users/:id` → 사용자 전체 수정
        -   `DELETE /users/:id` → 사용자 삭제


## 2) 코드 중심의 활용예제

```js
const express = require('express');
const app = express();
app.use(express.json());

// 임시 데이터 저장 (DB 대체)
let users = [
  { id: 1, name: 'Alice', age: 23 },
  { id: 2, name: 'Bob', age: 30 }
];

// 1. 전체 사용자 목록 조회
app.get('/users', (req, res) => {
  res.json(users);
});

// 2. 특정 사용자 조회
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// 3. 사용자 생성
app.post('/users', (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 4. 사용자 수정 (전체 교체)
app.put('/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users[idx] = { id: Number(req.params.id), ...req.body };
  res.json(users[idx]);
});

// 5. 사용자 삭제
app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id !== Number(req.params.id));
  res.status(204).send(); // 내용 없는 성공 응답
});

app.listen(3000, () => console.log('RESTful API server on http://localhost:3000'));
```

## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 구조

```
src/12/
├─ package.json
├─ app.js
```

### (b) 각 소스별 주석 설명

**package.json**

```json
{
  "name": "day13-rest-api",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

**app.js**

-   `app.use(express.json())`: JSON 요청 body를 파싱.
-   `app.get('/users')`: 사용자 목록 조회.
-   `app.post('/users')`: 새 사용자 생성.
-   `app.put('/users/:id')`: 기존 사용자 전체 수정.
-   `app.delete('/users/:id')`: 사용자 삭제.

### (c) 빌드 방법

```bash
# 1) 폴더 생성

# 2) Express 설치
npm install express

# 3) 실행
npm start

# 4) 테스트
curl http://localhost:3000/users
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"Charlie","age":28}'
```

## 4) 문제(3항)

1.  **빈칸 채우기**  
    RESTful API에서 `GET /users/:id`는 특정 \_\_\_\_를 조회한다.  
    `POST /users`는 새로운 \_\_\_\_를 생성한다.
2.  **O/X**
    *   ( ) RESTful API는 무상태(Stateless)성을 유지해야 한다.
    *   ( ) Express에서 `app.put('/users/:id')`는 부분 수정에 적합하다.
3.  **단답형**
    *   부분 수정에 적합한 HTTP 메서드는 무엇인가?



# Day 13 — Express와 데이터베이스 연동 (SQLite/MySQL/MongoDB)


## 1) 기본설명

Express 애플리케이션은 보통 \*\*데이터베이스(DB)\*\*와 연동하여 동적인 데이터를 처리.  
대표적인 DB는 다음과 같다

-   **SQLite**: 파일 기반 경량 DB. 설치가 간단하고 학습용·소규모 서비스에 적합.
-   **MySQL**: 대중적으로 가장 많이 쓰이는 관계형 DBMS. 스키마 기반, 복잡한 쿼리와 대규모 서비스에 적합.
-   **MongoDB**: 문서(Document) 기반 NoSQL DB. JSON과 유사한 BSON 형태로 데이터를 저장하며, 유연한 스키마 설계가 가능.

**Express + DB 연동 흐름**

1.  드라이버 또는 ORM 설치 (예: `sqlite3`, `mysql2`, `mongoose`).
2.  DB 연결 생성 및 초기화.
3.  라우트에서 DB 쿼리 실행 → 결과를 JSON으로 응답.
4.  에러 처리 및 연결 관리.


## 2) 코드 중심의 활용예제

### 2-1. SQLite 연동

```js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

// DB 연결
const db = new sqlite3.Database(':memory:');

// 테이블 초기화
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)");
  db.run("INSERT INTO users (name, age) VALUES ('Alice', 25), ('Bob', 30)");
});

// 전체 사용자 조회
app.get('/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 사용자 추가
app.post('/users', (req, res) => {
  const { name, age } = req.body;
  db.run("INSERT INTO users (name, age) VALUES (?, ?)", [name, age], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, age });
  });
});

app.listen(3000, () => console.log("SQLite example on http://localhost:3000"));
```


## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 구조

```
src/13/
├─ package.json
├─ app.js
```

### (b) 각 소스별 주석 설명

**package.json**

```json
{
  "name": "day14-db-express",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "sqlite3": "^5.1.6"
  }
}
```

**app.js**

-   `sqlite3.Database(':memory:')`: 메모리 기반 SQLite DB 사용. 파일 기반이라면 `mydb.sqlite` 파일명 지정.
-   `db.run`: SQL 실행 (INSERT, CREATE 등).
-   `db.all`: SELECT 후 모든 결과 가져오기.
-   RESTful API 라우팅으로 사용자 CRUD 구현.

### (c) 빌드 방법

```bash
# 1) 프로젝트 생성
# 2) 의존성 설치
npm install express sqlite3

# 3) app.js 작성 (위 코드 붙여넣기)

# 4) 실행
node app.js

# 5) 테스트
curl http://localhost:3000/users
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"Charlie","age":28}'
```


## 4) 문제(3항)

1.  **빈칸 채우기**  
    Express에서 SQLite를 사용할 때 `db.____("SELECT * FROM users")` 메서드는 SELECT 결과를 모두 가져온다.
2.  **O/X**
    *   ( ) MongoDB는 관계형 DB로, 테이블과 스키마를 엄격히 정의해야 한다.
    *   ( ) `db.run`은 INSERT/UPDATE 같은 변경 쿼리를 실행할 때 사용한다.
3.  **단답형**
    *   MySQL에서 Express와 연결하기 위해 자주 사용하는 Node.js용 패키지 이름은 무엇인가?

# Day 14 — Express에서 비동기 처리와 async/await


## 1) 기본설명

Express 애플리케이션은 **비동기(Asynchronous)** 방식으로 요청을 처리한다.  
Node.js의 이벤트 루프(Event Loop)는 I/O 작업(파일 읽기, DB 쿼리, 외부 API 호출 등)을 기다리는 동안 다른 요청을 처리하여 **논블로킹(Non-blocking)** 성능을 제공한다.

### node.js 비동기 처리 방식의 발전 단계

1.  **콜백(callback)** — 가장 기본적인 비동기 처리 방식  
    → 중첩이 깊어지면 “콜백 지옥(callback hell)” 발생
2.  **Promise** — 비동기 결과를 체이닝(`then`, `catch`)으로 처리 가능
3.  **async/await** — Promise를 동기식 코드처럼 다룰 수 있는 문법  
    → 가독성 향상, 에러 처리가 간단해짐

### Express에서의 비동기 처리 예

라우터 핸들러에서 DB 쿼리, 파일 읽기, 외부 API 호출 등은 대부분 비동기이므로 `async/await`을 자주 사용한다.


## 2) 코드 중심의 활용예제

```js
const express = require('express');
const fs = require('fs').promises;
const app = express();

app.get('/read-file', async (req, res) => {
  try {
    const data = await fs.readFile('data.txt', 'utf-8');
    res.send(`파일 내용: ${data}`);
  } catch (error) {
    res.status(500).send('파일을 읽는 중 오류가 발생했습니다.');
  }
});

app.get('/wait', async (req, res) => {
  const result = await new Promise(resolve => {
    setTimeout(() => resolve('3초 후 응답 완료'), 3000);
  });
  res.send(result);
});

app.listen(3000, () => console.log('Async server on http://localhost:3000'));
```

### 설명

*   `fs.promises.readFile` : Promise 기반 파일 읽기 함수.
*   `async` 함수 내부에서 `await`는 Promise가 완료될 때까지 기다림.
*   `try...catch` 블록으로 비동기 예외 처리.


## 3) 데스크탑에서 빌드할 수 있는 예제

### (a) 프로젝트 구조

```
src/14/
├─ package.json
├─ app.js
├─ data.txt
```

### (b) 각 소스별 주석 설명

**package.json**

```json
{
  "name": "day14-async-await",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

**data.txt**

```
안녕하세요! 이것은 비동기 파일 읽기 테스트입니다.
```

**app.js**

```js
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
```

### (c) 빌드 방법

```bash
# 1) 프로젝트 생성


# 2) Express 설치
npm install express

# 3) 파일 작성 (app.js, data.txt)

# 4) 실행
node app.js

# 5) 테스트
curl http://localhost:3000/read-file
curl http://localhost:3000/delay
```


## 4) 문제(3항)

1.  **빈칸 채우기**  
    `async` 함수 내부에서 비동기 작업을 기다릴 때 사용하는 키워드는 \_\_\_\_ 이다.
2.  **O/X**
    *   ( ) `await` 키워드는 `async` 함수 밖에서도 사용할 수 있다.
    *   ( ) `try...catch` 문은 비동기 함수 내의 에러를 처리할 때 유용하다.
3.  **단답형**  
    Promise 대신 `async/await` 문법을 사용하는 주요 이유는 코드의 \_\_\_\_를 높이기 위해서이다.









