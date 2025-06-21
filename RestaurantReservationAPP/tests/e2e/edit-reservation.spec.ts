import { test, expect } from '@playwright/test';

test('Edycja istniejącej rezerwacji', async ({ page }) => {
    await page.goto('http://localhost:8081');


    await expect(page.getByText('📋 Lista rezerwacji')).toBeVisible();

 
    const editButtons = page.locator('text=Edytuj');
    const count = await editButtons.count();

    expect(count).toBeGreaterThan(0);


    await editButtons.first().click();


    const input = page.getByRole('textbox').first();
    await expect(input).toBeVisible();


    await input.fill('Nowa nazwa klienta');


    const saveButton = page.getByText('ZAREZERWUJ');
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    await expect(page.getByText('Nowa nazwa klienta')).toBeVisible();
});
