import type { LayoutId } from '../core/layouts'

export interface PracticeText {
  id: string
  title: string
  text: string
}

export const practiceTexts: Record<LayoutId, PracticeText[]> = {
  ru: [
    {
      id: 'ru-home',
      title: 'Домашний ряд',
      text: 'фыва олдж фыва олдж ааа ооо вао дол лава жало вода фола',
    },
    {
      id: 'ru-pangram',
      title: 'Все буквы',
      text: 'Съешь же ещё этих мягких французских булок, да выпей чаю.',
    },
    {
      id: 'ru-morning',
      title: 'Утро',
      text: 'Утром над рекой стоял туман. Рыбаки тихо спускали лодки на воду и ждали, когда солнце поднимется над лесом.',
    },
    {
      id: 'ru-practice',
      title: 'О практике',
      text: 'Не смотрите на клавиатуру. Сначала печатайте медленно и точно, скорость придёт сама. Десять минут каждый день полезнее, чем час раз в неделю.',
    },
  ],
  en: [
    {
      id: 'en-home',
      title: 'Home row',
      text: 'asdf jkl; asdf jkl; ask dad sad lad fall flask salad',
    },
    {
      id: 'en-pangram',
      title: 'All letters',
      text: 'The quick brown fox jumps over the lazy dog.',
    },
    {
      id: 'en-morning',
      title: 'Morning',
      text: 'A thin fog covered the river in the morning. The fishermen quietly pushed their boats into the water and waited for the sun to rise.',
    },
    {
      id: 'en-practice',
      title: 'On practice',
      text: 'Do not look at the keyboard. Type slowly and accurately at first, and speed will come. Ten minutes every day beats an hour once a week.',
    },
  ],
}
