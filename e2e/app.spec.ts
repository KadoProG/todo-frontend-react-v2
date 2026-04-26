import { expect, test } from '@playwright/test';

test.describe('ホーム', () => {
  test('トップページが表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Home Page' })).toBeVisible();
  });
});
