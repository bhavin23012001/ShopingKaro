const { test, expect } = require('@playwright/test');

test('homepage has title', async ({ page }) => {
    await page.goto('http://localhost:4000'); // Replace with your app's URL
    await expect(page).toHaveTitle(/Shopping/i); // Adjust this regex
});
