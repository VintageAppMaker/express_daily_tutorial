
# Express를 빠르게 배우는 1일 학습

> Node.js의 backend의 기본인 Express를 체화하기 위한 1일 학습과정

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
  - `http.createServer(...)`: 요청(req)과 응답(res)을 받아 200 응답과 문자열 본문을 전송합니다.
  - `server.listen(3000, ...)`: 3000 포트로 수신 대기 후 콘솔 로그 출력. express.js(서버)
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

3) 데스크탑에서 빌드할 수 있는 예제

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

