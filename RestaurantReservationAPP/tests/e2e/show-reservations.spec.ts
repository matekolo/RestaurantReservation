import { test, expect } from '@playwright/test';

test('Wyświetlanie listy rezerwacji', async ({ page }) => {
    await page.goto('http://localhost:8081');


    await expect(page.getByRole('heading', { name: 'Lista rezerwacji' })).toBeVisible();


    const reservations = page.getByText(/Stolik: #/i);
    await expect(reservations.first()).toBeVisible();
});
