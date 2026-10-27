import { expect, test } from '@playwright/test'
import { typeKeys } from './helpers'

test('свободная тренировка: набрать текст до конца и увидеть результат', async ({ page }) => {
  await page.goto('/#/practice')
  await page.getByLabel('Раскладка').selectOption('ru')

  const text = 'фыва олдж фыва олдж ааа ооо вао дол лава жало вода фола'
  await expect(page.getByText('Положите пальцы')).toBeVisible()

  // Одна ошибка в начале: в режиме «стоп на ошибке» курсор остаётся на месте
  await typeKeys(page, 'ы')
  await expect(page.getByText('Ошибки').locator('..')).toContainText('1')
  await page.screenshot({ path: 'test-results/practice-error.png', fullPage: true })

  await typeKeys(page, text)
  await expect(page.getByRole('heading', { name: 'Готово!' })).toBeVisible()
  await page.screenshot({ path: 'test-results/practice-done.png', fullPage: true })

  await page.getByRole('button', { name: 'Ещё раз' }).click()
  await expect(page.getByText('Положите пальцы')).toBeVisible()
})

test('предупреждает о наборе в другой раскладке', async ({ page }) => {
  await page.goto('/#/practice')
  await page.getByLabel('Раскладка').selectOption('ru')
  await page.keyboard.type('f')
  await expect(page.getByText('включена другая раскладка')).toBeVisible()
})
