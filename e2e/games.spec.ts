import { expect, test } from '@playwright/test'
import { typeKeys } from './helpers'

test('падающие слова: сбить слово, потерять жизни, увидеть итог', async ({ page }) => {
  test.setTimeout(60_000)
  await page.goto('/#/games/falling')
  await page.getByLabel('Раскладка').selectOption('ru')
  await page.getByRole('button', { name: 'Начать' }).click()

  const word = page.getByTestId('falling-arena').locator('> span').first()
  await expect(word).toBeVisible()
  await typeKeys(page, (await word.textContent()) ?? '')
  await expect(page.getByTestId('falling-score')).not.toHaveText('0')
  await page.screenshot({ path: 'test-results/falling.png' })

  // Дальше не печатаем: три слова падают на землю
  await expect(page.getByRole('heading', { name: 'Игра окончена' })).toBeVisible({
    timeout: 40_000,
  })
  await expect(page.getByText(/^\+\d+ XP$/)).toBeVisible()
  await page.screenshot({ path: 'test-results/falling-over.png' })
})

test('гонка с призраком: сначала тренер, потом свой призрак', async ({ page }) => {
  await page.goto('/#/games/ghost')
  await page.getByLabel('Раскладка').selectOption('ru')
  await page.getByLabel('Текст').selectOption('ru-home')
  await expect(page.getByText('соревнуйтесь с тренером')).toBeVisible()

  const text = 'фыва олдж фыва олдж ааа ооо вао дол лава жало вода фола'
  await typeKeys(page, text)
  await expect(page.getByText('Вы обогнали тренера')).toBeVisible()
  await expect(page.getByText('стал вашим новым призраком')).toBeVisible()
  // Сохранённый призрак не подменяет соперника, с которым только что ехали
  await expect(page.getByText('соревнуйтесь с тренером')).toBeVisible()
  await page.screenshot({ path: 'test-results/ghost-result.png', fullPage: true })

  await page.getByRole('button', { name: 'Сыграть ещё' }).click()
  await expect(page.getByText('Призрак повторяет ваш лучший заезд')).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Призрак' })).toBeVisible()
})
