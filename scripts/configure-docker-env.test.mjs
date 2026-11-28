import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

for (const url of [
  'http://localhost:8001/api/v1',
  'http://127.0.0.1:8001/api/v1',
  'http://[::1]:8001/api/v1',
  'https://api.example.com/api/v1/',
]) {
  test(`Docker accepts ${url}`, () => {
    const result = configure(url);
    assert.equal(result.error, undefined);
    assert.ok(result.content.includes(JSON.stringify(url.replace(/\/+$/u, ''))));
  });
}

for (const url of [
  'http://api.example.com/api/v1',
  'https://user:pass@api.example.com/api/v1',
  'https://api.example.com/api',
  'https://api.example.com/api/v1?key=test',
]) {
  test(`Docker rejects ${url}`, () => assert.ok(configure(url).error));
}

function configure(url) {
  const root = mkdtempSync(join(tmpdir(), 'portfolio-docker-env-'));
  try {
    mkdirSync(join(root, 'scripts'));
    mkdirSync(join(root, 'src/environments'), { recursive: true });
    copyFileSync(
      new URL('./configure-docker-env.mjs', import.meta.url),
      join(root, 'scripts/configure-docker-env.mjs'),
    );
    try {
      execFileSync(process.execPath, [join(root, 'scripts/configure-docker-env.mjs')], {
        env: { ...process.env, DJANGO_API_BASE_URL: url },
        stdio: 'pipe',
      });
      return {
        content: readFileSync(join(root, 'src/environments/environment.production.ts'), 'utf8'),
      };
    } catch (error) {
      return { error };
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
