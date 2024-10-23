import { test, expect, type Page } from '@playwright/test';

// Antes de cada prueba, navega a la URL de la aplicación de tareas
test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

// Definición de las tareas que se agregarán
const TODO_ITEMS = [
  'Tarea 1',
  'Tarea 2',
  'Tarea 3'
] as const;

// Grupo de pruebas para agregar nuevas tareas
test.describe('Nueva Tarea', () => {

  // Prueba para agregar varias tareas
  test('Agregar tareas', async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Agregar la primera tarea y verificar que se ha agregado correctamente
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0]]);

    // Agregar la segunda tarea y verificar que ambas tareas están presentes
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');
    await expect(page.getByTestId('todo-title')).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);

    // Verificar que el número de tareas en el almacenamiento local sea el correcto
    await checkNumberOfTodosInLocalStorage(page, 2);
  });

  // Prueba para verificar que el input se limpia después de agregar una tarea
  test('Limpia el input', async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Verificar que el input esté vacío
    await expect(newTodo).toBeEmpty();
    await checkNumberOfTodosInLocalStorage(page, 1); // Verificar el número de tareas en almacenamiento
  });

  // Prueba para agregar tareas en la lista y verificar su estado
  test('Agregar tareas en la lista', async ({ page }) => {
    await createDefaultTodos(page); // Crear tareas predeterminadas
    const todoCount = page.getByTestId('todo-count');

    // Verificar el estado de la lista de tareas de diferentes formas
    await expect(page.getByText('3 items left')).toBeVisible();
    await expect(todoCount).toHaveText('3 items left');
    await expect(todoCount).toContainText('3');
    await expect(todoCount).toHaveText(/3/);
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, 3); // Verificar el número total de tareas
  });
});

// Grupo de pruebas para marcar todas las tareas como completadas
test.describe('Marcar todas como completadas', () => {

  // Crear tareas predeterminadas antes de cada prueba
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    await checkNumberOfTodosInLocalStorage(page, 3); // Verificar que se hayan creado las tareas
  });

  // Comprobar que el número de tareas se mantenga igual después de cada prueba
  test.afterEach(async ({ page }) => {
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  // Prueba para marcar todas las tareas como completadas
  test('Marcación de tareas como completadas', async ({ page }) => {
    await page.getByLabel('Mark all as complete').check(); // Marcar todas como completadas
    await expect(page.getByTestId('todo-item')).toHaveClass(['completed', 'completed', 'completed']);
    await checkNumberOfCompletedTodosInLocalStorage(page, 3); // Verificar que todas estén completadas
  });

  // Prueba para desmarcar todas las tareas completadas
  test('Desmarcar las tareas completadas', async ({ page }) => {
    const toggleAll = page.getByLabel('Mark all as complete');
    await toggleAll.check(); // Marcar todas como completadas
    await toggleAll.uncheck(); // Desmarcarlas
    await expect(page.getByTestId('todo-item')).toHaveClass(['', '', '']); // Verificar que no tengan clase de completadas
  });

  // Prueba para verificar que el checkbox se actualiza correctamente
  test('Actualización correcta del checkbox', async ({ page }) => {
    const toggleAll = page.getByLabel('Mark all as complete');
    await toggleAll.check(); // Marcar todas como completadas
    await expect(toggleAll).toBeChecked(); // Verificar que el toggle esté marcado
    await checkNumberOfCompletedTodosInLocalStorage(page, 3); // Verificar que todas estén completadas

    const firstTodo = page.getByTestId('todo-item').nth(0);
    await firstTodo.getByRole('checkbox').uncheck(); // Desmarcar la primera tarea
    await expect(toggleAll).not.toBeChecked(); // Verificar que el toggle ya no esté marcado
    await firstTodo.getByRole('checkbox').check(); // Marcar la primera tarea nuevamente
    await checkNumberOfCompletedTodosInLocalStorage(page, 3); // Verificar que el número de completadas no haya cambiado
    await expect(toggleAll).toBeChecked(); // Verificar que el toggle esté nuevamente marcado
  });
});

// Función para crear tareas predeterminadas
async function createDefaultTodos(page: Page) {
  const newTodo = page.getByPlaceholder('What needs to be done?');
  for (const item of TODO_ITEMS) {
    await newTodo.fill(item); // Llenar el input con cada tarea
    await newTodo.press('Enter'); // Presionar Enter para agregar la tarea
  }
}

// Función para verificar el número de tareas en el almacenamiento local
async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  const actual = await page.evaluate(() => {
    return JSON.parse(localStorage['react-todos']).length; // Obtener el número total de tareas
  });
  expect(actual).toBe(expected); // Verificar que coincida con el valor esperado
}

// Función para verificar el número de tareas completadas en el almacenamiento local
async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
  const actual = await page.evaluate(() => {
    return JSON.parse(localStorage['react-todos']).filter((todo: any) => todo.completed).length; // Contar tareas completadas
  });
  expect(actual).toBe(expected); // Verificar que coincida con el valor esperado
}
