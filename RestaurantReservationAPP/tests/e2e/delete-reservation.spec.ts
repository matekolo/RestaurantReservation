import { test, expect } from '@playwright/test';

test('Usuwanie istniejącej rezerwacji', async ({ page }) => {
    await page.goto('http://localhost:8081');

  
    await expect(page.getByText('📋 Lista rezerwacji')).toBeVisible();

   
    await page.getByText('Usuń').first().click();


    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();


    const confirmButton = dialog.getByText('Usuń', { exact: true });

    await expect(confirmButton).toBeVisible({ timeout: 5000 });
    await confirmButton.click();


});
