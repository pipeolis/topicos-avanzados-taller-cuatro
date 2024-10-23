import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly getTestAccount: Locator;
    readonly login: Locator;

    constructor(page: Page) {
        this.page = page;
        // Localiza el botón de login en la página
        this.login = page.locator('#login-btn');
        // Localiza el enlace para obtener una cuenta de prueba
        this.getTestAccount = page.getByText('Get a test account');
    }

    /**
     * Realiza el proceso de login utilizando una cuenta de prueba.
     */
    async loginWithTestAccount() {
        // Espera a que el botón para obtener una cuenta de prueba sea visible
        await this.getTestAccount.waitFor({ state: 'visible' });
        // Hace clic en el botón para obtener una cuenta de prueba
        await this.getTestAccount.click();
        // Verifica que el mensaje de éxito 'Generate success.' sea visible
        await expect(this.page.getByText('Generate success.')).toBeVisible();
        // Hace clic en el botón de login para acceder al sistema
        await this.login.click();
    }
}
