import { test, expect } from '@playwright/test';

test.describe('Burger constructor', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/**'
    });

    await page.goto('/');
  });

  test('ingredients are loaded from HAR', async ({ page }) => {
    await expect(page.getByText('Тестовая булка')).toBeVisible();
    await expect(page.getByText('Тестовая начинка')).toBeVisible();
  });

  test('bun and main ingredient can be added to constructor', async ({
    page
  }) => {
    const bunCard = page.locator('li').filter({
      hasText: 'Тестовая булка'
    });

    const mainCard = page.locator('li').filter({
      hasText: 'Тестовая начинка'
    });

    const constructor = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' })
    });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText('Тестовая булка (верх)')
    ).toBeVisible();

    await expect(
      constructor.getByText('Тестовая булка (низ)')
    ).toBeVisible();

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText('Тестовая начинка')
    ).toBeVisible();

    await expect(
      bunCard.getByText('2', { exact: true })
    ).toBeVisible();

    await expect(
      mainCard.getByText('1', { exact: true })
    ).toBeVisible();
  });

  test('ingredient details modal opens and closes by button', async ({
    page
  }) => {
    const mainCard = page.locator('li').filter({
      hasText: 'Тестовая начинка'
    });

    await mainCard.getByRole('link').click();

    const modal = page.locator(
      '#modals > div[class*="modal__modal"]'
    );

    await expect(modal).toBeVisible();

    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await expect(
      modal.getByRole('heading', { name: 'Тестовая начинка' })
    ).toBeVisible();

    await expect(
      modal.getByText('150', { exact: true })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modal).not.toBeVisible();
  });

  test('ingredient details modal closes by overlay click', async ({
    page
  }) => {
    const bunCard = page.locator('li').filter({
      hasText: 'Тестовая булка'
    });

    await bunCard.getByRole('link').click();

    const modal = page.locator(
      '#modals > div[class*="modal__modal"]'
    );

    await expect(modal).toBeVisible();

    await expect(
      modal.getByRole('heading', { name: 'Тестовая булка' })
    ).toBeVisible();

    await expect(
      modal.getByText('100', { exact: true })
    ).toBeVisible();

    await page.locator('#modals [class*="overlay"]').click({
      position: { x: 5, y: 5 }
    });

    await expect(modal).not.toBeVisible();
  });

  test('user can create an order', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.reload();

    const bunCard = page.locator('li').filter({
      hasText: 'Тестовая булка'
    });

    const mainCard = page.locator('li').filter({
      hasText: 'Тестовая начинка'
    });

    const constructor = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' })
    });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    // Проверяем, что ингредиенты действительно добавлены в конструктор
    await expect(
      constructor.getByText('Тестовая булка (верх)')
    ).toBeVisible();

    await expect(
      constructor.getByText('Тестовая булка (низ)')
    ).toBeVisible();

    await expect(
      constructor.getByText('Тестовая начинка')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('12345', { exact: true })).toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByText('12345', { exact: true })).not.toBeVisible();
  });
});
