import { test, expect } from '@playwright/test';

test('Dodawanie nowej rezerwacji', async ({ page }) => {
    await page.goto('http://localhost:8081');


    await page.waitForLoadState('networkidle');


    await page.locator('text=+ Dodaj').click();


    await page.getByPlaceholder('Jan Kowalski').fill('Testowy Uzytkownik');


    const dateInput = await page.locator('input[type="datetime-local"]');
    await dateInput.fill('2025-07-01T12:00');

 
    const picker = page.locator('select');
    await picker.selectOption({ index: 1 }); 


    await page.locator('text=ZAREZERWUJ').click();

    await expect(page.locator('text=Testowy Uzytkownik')).toBeVisible();
});
