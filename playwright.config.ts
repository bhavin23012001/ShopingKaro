import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    forbidOnly: !!process.env.CI,
    reporter: 'list',
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
    testIgnore: ['**/node_modules/**'],
});