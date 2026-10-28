import { expect, test } from '@playwright/test'
import { typeKeys } from './helpers'

const homeText = 'фыва олдж фыва олдж ааа ооо вао дол лава жало вода фола'

test('статистика, слабые клавиши и резервная копия', async ({ page }) => {
  await page.goto('/#/practice')
  await page.getByLabel('Раскладка').selectOption('ru')
  await page.getByLabel('Текст').selectOption('ru-home')

  // Перед каждой «ж» несколько промахов — она станет слабой клавишей
  await typeKeys(page, [...homeText].map((c) => (c === 'ж' ? 'ыыыыж' : c)).join(''))
  await expect(page.getByRole('heading', { name: 'Готово!' })).toBeVisible()

  await page.getByRole('link', { name: 'Статистика' }).click()
  await expect(page.getByText('Занятий', { exact: true }).locator('..')).toContainText('1')
  await expect(page.getByRole('img', { name: 'Скорость, зн/мин' })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'ж', exact: true })).toBeVisible()
  await page.screenshot({ path: 'test-results/stats.png', fullPage: true })

  await page.getByRole('link', { name: 'Тренировать' }).click()
  await expect(page.getByText('Тренируем клавиши: ж')).toBeVisible()
  await expect(page.getByTestId('typing-area')).toContainText('ж')

  // Копия → сброс → восстановление
  await page.getByRole('link', { name: 'Настройки' }).click()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Сохранить копию' }).click()
  const file = await (await download).path()

  page.on('dialog', (d) => d.accept())
  await page.getByRole('button', { name: 'Сбросить прогресс' }).click()
  await expect(page.getByText('Прогресс сброшен')).toBeVisible()
  await page.getByRole('link', { name: 'Статистика' }).click()
  await expect(page.getByText('Занятий', { exact: true }).locator('..')).toContainText('0')

  await page.getByRole('link', { name: 'Настройки' }).click()
  await page.locator('input[type=file]').setInputFiles(file)
  await expect(page.getByText('Прогресс загружен')).toBeVisible()
  await page.getByRole('link', { name: 'Статистика' }).click()
  await expect(page.getByText('Занятий', { exact: true }).locator('..')).toContainText('1')
})

test('закрытый урок не открывается по прямой ссылке', async ({ page }) => {
  await page.goto('/#/course/ru-vl')
  await expect(page.getByText('Этот урок пока закрыт')).toBeVisible()
  await page.getByRole('link', { name: 'А и О' }).click()
  await expect(page.getByText('Этот урок пока закрыт')).toBeVisible()
  await page.goto('/#/course/ru-basics')
  await expect(page.getByRole('heading', { name: 'Посадка' })).toBeVisible()
})
