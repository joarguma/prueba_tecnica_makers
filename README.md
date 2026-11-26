# Prueba Técnica Makers — Automatización de pruebas con Playwright

Suite de pruebas automatizadas end-to-end sobre [SauceDemo](https://www.saucedemo.com/), enfocada en validar el flujo de login (credenciales válidas, inválidas y campos obligatorios).

## 1. Tecnología utilizada

- **[Playwright](https://playwright.dev/)** (`@playwright/test` ^1.65.1) — framework de automatización y test runner end-to-end.
- **TypeScript** — tipado estático para los tests y Page Objects.
- **Node.js** — entorno de ejecución.
- **@types/node** — tipado de las APIs de Node (`process`, etc.) para TypeScript.

Navegadores cubiertos (configurados en `playwright.config.ts`): **Chromium, Firefox y WebKit**.

## 2. Patrón de diseño utilizado

Se utiliza el patrón **Page Object Model (POM)**:

- Cada página de la aplicación se encapsula en una clase dentro de `pages/` (`LoginPage.ts`, `InventoryPage.ts`), que expone los **locators** y las **acciones** posibles sobre esa página (`fillUsername`, `clickLogin`, `isProductsTextVisible`, etc.).
- Los archivos de test (`src/tests/*.spec.ts`) solo orquestan esas acciones y hacen las aserciones, sin conocer detalles de selectores.
- La URL base de la aplicación se centraliza en `baseURL` dentro de `playwright.config.ts`; las páginas navegan con rutas relativas (`page.goto('/')`), evitando strings "hardcodeados" repetidos en el código.

Este patrón facilita el mantenimiento: si cambia un selector en la UI, solo se actualiza el Page Object correspondiente, sin tocar los tests.

## 3. Cómo descargar e instalar el proyecto

### Requisitos

- **Node.js** 18 o superior (verificado con Node 26) y **npm**.
- **Git**.
- Conexión a internet (los tests se ejecutan contra https://www.saucedemo.com/ y `npx playwright install` descarga los navegadores).
- Espacio en disco para los navegadores de Playwright (Chromium, Firefox y WebKit).

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/joarguma/prueba_tecnica_makers.git
cd prueba_tecnica_makers

# Instalar dependencias (usa el package-lock.json para versiones exactas)
npm ci

# Instalar los navegadores de Playwright
npx playwright install
```

### Estructura del proyecto

```
.
├── pages/                  # Page Objects (LoginPage, InventoryPage)
├── src/tests/              # Specs de Playwright (login.spec.ts)
├── playwright.config.ts    # Configuración (baseURL, timeouts, reporter, navegadores)
├── tsconfig.json
└── package.json
```

## 4. Qué está cubriendo el proyecto

El archivo `src/tests/login.spec.ts` cubre el flujo de **Login** con los siguientes escenarios:

| Test | Descripción |
|---|---|
| Login exitoso con credenciales válidas | Ingresa `standard_user` / `secret_sauce` y valida que se muestre la página de productos (Inventory). |
| Login fallido con contraseña incorrecta | Ingresa usuario válido con contraseña incorrecta y valida el mensaje de error de SauceDemo. |
| Validación de campos Username y Password en blanco | Intenta login sin completar ningún campo y valida el mensaje de error de usuario requerido. |
| Validación de campo Password en blanco | Completa solo el usuario y valida el mensaje de error de contraseña requerida. |
| Validación de campo Username en blanco | Completa solo la contraseña y valida el mensaje de error de usuario requerido. |

Todas las pruebas validan además que el sitio cargue correctamente (título `Swag Labs`) antes de cada caso (`test.beforeEach`).

Alcance: 5 escenarios × 3 navegadores (Chromium, Firefox, WebKit) = **15 ejecuciones**. Fuera de alcance: carrito, checkout, logout y otros usuarios de SauceDemo (`locked_out_user`, `problem_user`, etc.).

## 5. Cómo ejecutar el proyecto

> Nota: `playwright.config.ts` tiene `headless: true`, por lo que los navegadores corren sin ventana por defecto. Usa `--headed` para verlos puntualmente.

```bash
# Atajos definidos en package.json
npm test              # todos los tests, 3 navegadores
npm run test:headed   # mostrando el navegador
npm run test:ui       # modo UI interactivo
npm run report        # abrir el reporte HTML

# Ejecutar en un solo navegador (chromium, firefox o webkit)
npx playwright test --project=chromium
npm test -- --project=firefox   # equivalente usando el script de npm

# Ejecutar un archivo de test puntual
npx playwright test src/tests/login.spec.ts

# Modo debug paso a paso
npx playwright test --debug
```

## 6. Dónde ver los resultados del proyecto

- **Reporte HTML**: al finalizar la ejecución, Playwright genera un reporte en `playwright-report/`. Para abrirlo:
  ```bash
  npx playwright show-report
  ```
- **Resultados crudos**: la carpeta `test-results/` contiene trazas, capturas y videos (cuando aplica) de la última corrida, incluyendo `test-results/.last-run.json` con el resumen del último run.
- **Trazas (trace viewer)**: como `trace: 'retain-on-failure'` está habilitado en `playwright.config.ts`, cada test fallido genera una traza navegable:
  ```bash
  npx playwright show-trace test-results/<carpeta-del-test>/trace.zip
  ```
- **Capturas de pantalla**: con `screenshot: 'only-on-failure'`, cada test fallido guarda una captura en `test-results/<carpeta-del-test>/`.

## 7. Cómo hacer troubleshooting en caso de errores

**"Cannot find name 'process'"**
- Falta el tipado de Node. Instala `@types/node` (`npm i --save-dev @types/node`) y asegúrate de que `tsconfig.json` incluya `"types": ["node"]`.

**"Cannot find module '../../pages/LoginPage'" (o similar)**
- Revisa la ruta relativa del `import` según la ubicación real del archivo. Desde `src/tests/login.spec.ts` hacia `pages/` en la raíz, la ruta correcta es `../../pages/LoginPage`.

**"Cannot find name 'InventoryPage'" (u otra clase)**
- Verifica que la clase esté importada al inicio del archivo de test. Cada Page Object usado debe tener su propio `import`.

**Timeout esperando un elemento (`Test timeout of Xms exceeded`)**
- Suele indicar que el locator no coincide con el elemento real en pantalla, o que el elemento no llegó a renderizarse (por ejemplo, el mensaje de error esperado no es exactamente el que devuelve la app).
- Pasos sugeridos:
  1. Ejecutar con `--debug` o `--ui` para inspeccionar el estado real de la página.
  2. Revisar el locator en el Page Object correspondiente (`getByRole`, `getByText`, etc.).
  3. Confirmar el texto exacto esperado comparándolo con lo que muestra la UI de SauceDemo.
  4. Revisar la traza (`show-trace`) o el reporte HTML del test fallido para ver capturas del momento del fallo.

**Playwright no encuentra ningún test ("No tests found")**
- Verifica que `testDir` en `playwright.config.ts` apunte a `./src/tests` (la ubicación real de los specs). Si mueves los tests de carpeta, este valor debe actualizarse junto con las rutas de `import` dentro de cada spec.

**Los tests no abren ningún navegador / fallan todos por igual**
- Correr `npx playwright install` para asegurar que los binarios de los navegadores estén descargados.

**Fallos por timeout en varios tests**
- `playwright.config.ts` define un `timeout` de 30s por test (navegación, acciones y validaciones en conjunto) y un `expect.timeout` de 10s por aserción. Si el entorno es lento, considera subir estos valores temporalmente para diagnosticar si es timing o un locator roto.

**Error "test.only" / `forbidOnly`**
- `forbidOnly: true` hace fallar la ejecución si queda algún `test.only` en el código. Elimina el `.only` antes de ejecutar o entregar.
