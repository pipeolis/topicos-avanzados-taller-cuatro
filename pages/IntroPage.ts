import { Page, Locator } from '@playwright/test';

export class IntroPage {
    readonly page: Page;
    readonly loginPage: Locator;

    constructor(page: Page) {
        this.page = page;
        // Localiza el enlace de navegación para la página de login
        this.loginPage = page.getByRole('navigation').getByRole('link', { name: 'Login' });
    }

    /**
     * Navega a la página de inicio y luego accede a la página de login.
     */
    async goToLogin() {
        // Abre la URL principal de la aplicación
        await this.page.goto('http://127.0.0.1:5000/');
        // Espera a que el enlace de la página de login sea visible
        await this.loginPage.waitFor({ state: 'visible' });
        // Hace clic en el enlace de login para navegar a la página de login
        await this.loginPage.click();
    }
}
