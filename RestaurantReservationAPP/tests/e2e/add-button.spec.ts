import { test, expect } from '@playwright/test';

test('Przycisk "+ Dodaj" przekierowuje do formularza', async ({ page }) => {
    await page.goto('http://localhost:8081');

    const addButton = page.getByText('+ Dodaj');
    await expect(addButton).toBeVisible();
    await addButton.click();

    const formInput = page.getByRole('textbox').first();
    await expect(formInput).toBeVisible();
});
