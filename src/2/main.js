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