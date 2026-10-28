import { expect, test } from '@playwright/test'
import { typeShownText } from './helpers'

test('курс: азы → первый урок → звёзды сохраняются после перезагрузки', async ({ page }) => {
  await page.goto('/#/course')
  await page.getByLabel('Раскладка').selectOption('ru')

  // Пока азы не пройдены, урок 1 закрыт
  await expect(page.getByRole('link', { name: /А и О/ })).toHaveCount(0)

  await page.getByRole('link', { name: /Азы/ }).click()
  await expect(page.getByRole('heading', { name: 'Посадка' })).toBeVisible()
  await page.screenshot({ path: 'test-results/theory-posture.png', fullPage: true })
  await page.getByRole('button', { name: 'Далее' }).click()
  await expect(page.getByRole('heading', { name: 'Основная позиция' })).toBeVisible()
  await page.screenshot({ path: 'test-results/theory-home.png', fullPage: true })
  await page.getByRole('button', { name: 'Далее' }).click()
  await page.getByRole('button', { name: 'Далее' }).click()
  await page.getByRole('button', { name: 'Готово' }).click()
  await expect(page.getByRole('status').getByText('Первые шаги', { exact: true })).toBeVisible()

  // Сразу открывается следующий урок
  await expect(page.getByRole('heading', { name: 'А и О' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Новые клавиши' })).toBeVisible()
  await page.screenshot({ path: 'test-results/theory-new-keys.png', fullPage: true })
  await page.getByRole('button', { name: 'К упражнениям' }).click()

  for (const n of [1, 2, 3]) {
    await expect(page.getByText(`Упражнение ${n} из 3`)).toBeVisible()
    if (n === 2) await page.screenshot({ path: 'test-results/lesson-exercise.png', fullPage: true })
    await typeShownText(page)
  }
  await expect(page.getByRole('heading', { name: 'Урок пройден!' })).toBeVisible()
  await expect(page.getByLabel('3/3')).toBeVisible()
  await expect(page.getByText(/^\+\d+ XP$/)).toBeVisible()
  // Достижений за урок много — они сведены в одно уведомление
  await expect(page.getByRole('status').getByText(/новых достижени/)).toContainText('6')
  await expect(page.getByRole('status')).toContainText('Три звезды')
  await page.waitForTimeout(800)
  await page.screenshot({ path: 'test-results/lesson-result.png' })

  await page.reload()
  await page.getByRole('link', { name: 'К курсу' }).first().click()
  await expect(page.getByRole('link', { name: /А и О/ }).getByLabel('3/3')).toBeVisible()
  await expect(page.getByRole('link', { name: /В и Л/ })).toBeVisible()
  await page.screenshot({ path: 'test-results/course-map.png', fullPage: true })

  // Серия в шапке и открытые достижения
  await expect(page.getByRole('banner').getByText('1', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Достижения' }).click()
  // 4 за уроки + 3 за скорость: тест печатает мгновенно
  await expect(page.getByText('7 из 17')).toBeVisible()
  await page.screenshot({ path: 'test-results/achievements.png', fullPage: true })

  await page
    .getByRole('link', { name: 'Главная' })
    .or(page.getByRole('link', { name: /Клавиатурный/ }))
    .first()
    .click()
  await expect(page.getByRole('link', { name: 'Продолжить: В и Л' })).toBeVisible()
  await page.screenshot({ path: 'test-results/home.png', fullPage: true })
})
