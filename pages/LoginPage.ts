import type { Page, Locator } from '@playwright/test';

/**
 * Page Object de la página de login de SauceDemo.
 * Encapsula los locators y las acciones del formulario de inicio de sesión.
 */
export class LoginPage {
  /** Instancia de la página de Playwright. */
  readonly page: Page;
  /** Campo de texto "Username". */
  readonly USERNAME_TXTBOX: Locator;
  /** Campo de texto "Password". */
  readonly PASSWORD_TXTBOX: Locator;
  /** Botón "Login". */
  readonly LOGIN_BTN: Locator;
  /** Mensaje de error mostrado cuando el login falla o faltan campos. */
  readonly ERROR_MSG: Locator;

  /**
   * @param page Página de Playwright sobre la que se ejecutan las acciones.
   */
  constructor(page: Page) {
    this.page = page;
    this.USERNAME_TXTBOX = page.getByRole('textbox', { name: 'Username' });
    this.PASSWORD_TXTBOX = page.getByRole('textbox', { name: 'Password' });
    this.LOGIN_BTN = page.getByRole('button', { name: 'Login' });
    this.ERROR_MSG = page.getByRole('alert');
  }

  /**
   * Abre la página de login usando el `baseURL` definido en `playwright.config.ts`.
   */
  async open() {
    await this.page.goto('/');
  }

  /**
   * Escribe el nombre de usuario en el campo "Username".
   * @param username Nombre de usuario a ingresar.
   */
  async fillUsername(username: string) {
    await this.USERNAME_TXTBOX.fill(username);
  }

  /**
   * Escribe la contraseña en el campo "Password".
   * @param password Contraseña a ingresar.
   */
  async fillPassword(password: string) {
    await this.PASSWORD_TXTBOX.fill(password);
  }

  /**
   * Hace clic en el botón "Login" para enviar el formulario.
   */
  async clickLogin() {
    await this.LOGIN_BTN.click();
  }
}
