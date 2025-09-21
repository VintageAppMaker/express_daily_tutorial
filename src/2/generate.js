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