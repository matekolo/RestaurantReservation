import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    use: {
        baseURL: 'http://localhost:8081',
        headless: false,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    workers: 1,
});
