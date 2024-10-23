import { Page } from '@playwright/test';

export class TaskPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Agrega una tarea en la lista de tareas.
     * @param taskName - El nombre de la tarea que se va a agregar.
     */
    async addTask(taskName: string) {
        // Hace clic en el campo de entrada para añadir la tarea
        await this.page.waitForTimeout(3000);
        await this.page.getByPlaceholder("What needs to be done?").click();
        // Llena el campo de entrada con el nombre de la tarea
        await this.page.getByPlaceholder('What needs to be done?').fill(taskName);
        // Presiona 'Enter' para añadir la tarea
        await this.page.getByPlaceholder('What needs to be done?').press('Enter');
    }

    /**
     * Marca una tarea como completada.
     * @param taskName - El nombre de la tarea que se va a marcar como completada.
     */
    async completeTask(taskName: string) {
        // Localiza la tarea por su nombre y el icono de casilla vacía (check_box_outline_blank)
        await this.page
            .locator('span')
            .filter({ hasText: `check_box_outline_blank ${taskName}` })
            .locator('i')
            .click(); // Hace clic en el ícono para completar la tarea
    }

    /**
     * Limpia todas las tareas de la lista.
     */
    async clearTasks() {
        // Hace clic en el botón 'Clear' para eliminar todas las tareas
        await this.page
            .getByText('clear_allClear')
            .click();
    }

    /**
     * Verifica que una tarea específica esté visible en la lista.
     * @param taskName - El nombre de la tarea que se va a verificar.
     */
    async verifyTaskVisible(taskName: string) {
        // Espera a que el nombre de la tarea esté visible en la página
        await this.page
            .waitForSelector(`text=${taskName}`);
    }
}
