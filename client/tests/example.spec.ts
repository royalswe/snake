import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://localhost:5173/game?room=sara&board=20:20');
  await page.getByRole('button', { name: 'Take seat' }).first().click();
  await page.getByRole('button', { name: 'Click when ready!' }).first().click();

  await page.locator('body').press('ArrowDown');
  await page.locator('body').press('ArrowRight');
  await page.waitForTimeout(3000);


  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects the URL to contain intro.
//   await expect(page).toHaveURL(/.*intro/);
// });
