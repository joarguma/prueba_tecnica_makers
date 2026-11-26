import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

let loginPage: LoginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.open();
  await expect(page).toHaveTitle('Swag Labs');
});

test('Login exitoso con credenciales válidas', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);

  await loginPage.fillUsername('standard_user');
  await loginPage.fillPassword('secret_sauce');
  await loginPage.clickLogin();
  await expect(inventoryPage.isProductsTextVisible()).resolves.toBe(true);
});

test('Login fallido con contraseña incorrecta', async () => {
  await loginPage.fillUsername('standard_user');
  await loginPage.fillPassword('wrong_password');
  await loginPage.clickLogin();
  await expect(loginPage.ERROR_MSG).toHaveText('Epic sadface: Username and password do not match any user in this service');
});

test('Validación de campos Username y Password en blanco', async () => {
  await loginPage.clickLogin();
  await expect(loginPage.ERROR_MSG).toHaveText('Epic sadface: Username is required');
});

test('Validación de campo Password en blanco', async () => {
  await loginPage.fillUsername('standard_user');
  await loginPage.clickLogin();
  await expect(loginPage.ERROR_MSG).toHaveText('Epic sadface: Password is required');
});

test('Validación de campo Username en blanco', async () => {
  await loginPage.fillPassword('secret_sauce');
  await loginPage.clickLogin();
  await expect(loginPage.ERROR_MSG).toHaveText('Epic sadface: Username is required');
});