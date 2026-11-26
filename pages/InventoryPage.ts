import type { Page, Locator } from '@playwright/test';

/**
 * Page Object de la página de inventario (listado de productos) de SauceDemo.
 * Se muestra después de un login exitoso.
 */
export class InventoryPage {
  /** Instancia de la página de Playwright. */
  readonly page: Page;
  /** Título "Products" que identifica la página de inventario. */
  readonly PRODUCTS_TEXT: Locator;

  /**
   * @param page Página de Playwright sobre la que se ejecutan las acciones.
   */
  constructor(page: Page) {
    this.page = page;
    this.PRODUCTS_TEXT = page.getByText('Products', { exact: true });
  }

  /**
   * Indica si el título "Products" está visible.
   * @returns `true` si el título es visible; `false` en caso contrario.
   */
  async isProductsTextVisible() {
    return await this.PRODUCTS_TEXT.isVisible();
  }
}
