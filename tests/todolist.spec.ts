import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TaskPage } from '../pages/TaskPage';
import { IntroPage } from '../pages/IntroPage';

test.describe("Suite de pruebas", () => {
    let loginPage: LoginPage;
    let taskPage: TaskPage;
    let introPage: IntroPage;

    // Hook que se ejecuta antes de cada test
    test.beforeEach(async ({page}) => {
        // Marca el test como lento para dar más tiempo si es necesario
        test.slow();
        // Inicializa las páginas necesarias
        loginPage = new LoginPage(page);
        taskPage = new TaskPage(page);
        introPage = new IntroPage(page);
        // Navega a la página de login e inicia sesión con la cuenta de prueba
        await introPage.goToLogin();
        await loginPage.loginWithTestAccount();
    });

    // Test para añadir una nueva tarea
    test('Add task', async ({ page }) => {
        // Añade una tarea llamada 'Tarea nueva 1'
        await taskPage.addTask('Tarea nueva 1');
        // Verifica que la tarea 'Tarea nueva 1' es visible en la lista
        await taskPage.verifyTaskVisible('Tarea nueva 1');
    });

    // Test para completar una tarea existente
    test('Complete task', async ({ page }) => {
        // Añade una tarea llamada 'Tarea nueva 2'
        await taskPage.addTask('Tarea nueva 2');
        // Marca la tarea 'Tarea nueva 2' como completada
        await taskPage.completeTask('Tarea nueva 2');
        // Verifica que la tarea se haya marcado como completada (casilla marcada)
        await expect(page.locator('span:has-text("check_box Tarea nueva 2")')).toBeVisible();
    });

    // Test para limpiar las tareas completadas
    test('Clear task', async ({ page }) => {
        // Añade una tarea llamada 'Tarea nueva 3'
        await taskPage.addTask('Tarea nueva 3');
        // Marca la tarea 'Tarea nueva 3' como completada
        await taskPage.completeTask('Tarea nueva 3');
        // Limpia las tareas completadas de la lista
        await taskPage.clearTasks();
        // Verifica que la tarea 'Tarea nueva 3' ya no es visible en la lista
        await expect(page.locator('text=Tarea nueva 3')).not.toBeVisible();
    });
});
