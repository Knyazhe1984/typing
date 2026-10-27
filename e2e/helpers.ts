import type { Page } from '@playwright/test'

/**
 * Playwright вводит символы не из US-раскладки как вставку текста, без keydown.
 * Настоящий браузер с русской раскладкой шлёт keydown с key='ы', поэтому эмулируем его.
 */
export async function typeKeys(page: Page, text: string) {
  await page.evaluate((chars) => {
    for (const key of chars) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    }
  }, text)
}

/** Набирает текст, который сейчас показан в поле набора. */
export async function typeShownText(page: Page) {
  const text = await page.getByTestId('typing-area').textContent()
  await typeKeys(page, text ?? '')
}
