import { test, expect } from '@playwright/test';

test('Walidacja pustego formularza rezerwacji', async ({ page }) => {
    await page.goto('http://localhost:8081');

    const addButton = page.getByText('+ Dodaj');
    await expect(addButton).toBeVisible();
    await addButton.click();

    const saveButton = page.getByText('ZAREZERWUJ');
    await expect(saveButton).toBeVisible();

    await saveButton.click();

    await expect(saveButton).toBeVisible();

});
