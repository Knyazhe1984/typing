import type { LayoutId } from '../core/layouts'

export interface PracticeText {
  id: string
  title: string
  text: string
}

// Тексты оригинальные; в них только символы, которые есть на клавиатуре
// (дефис вместо тире, прямые кавычки вместо «ёлочек»).
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
      id: 'ru-evening',
      title: 'Город вечером',
      text: 'Вечером город меняется. Зажигаются фонари, в окнах появляется тёплый свет, а на улицах становится тише. Кто-то спешит домой, кто-то только выходит на прогулку. Хорошо пройтись по набережной и посмотреть, как огни отражаются в воде.',
    },
    {
      id: 'ru-coffee',
      title: 'Кофе',
      text: 'Родиной кофе считают Эфиопию. По легенде, пастух заметил, что его козы становятся бодрыми, если поедят ягод с одного куста. Сегодня кофе пьют по всему миру: для многих день начинается с чашки ароматного напитка.',
    },
    {
      id: 'ru-letter',
      title: 'Письмо другу',
      text: 'Привет! Как твои дела? У нас всё хорошо: на прошлой неделе мы ездили за город, пекли картошку на костре и до ночи смотрели на звёзды. Приезжай летом, места хватит всем. Пиши, не пропадай!',
    },
    {
      id: 'ru-numbers',
      title: 'Числа',
      text: 'В году 12 месяцев, 52 недели и 365 дней, а в високосном - 366. В сутках 24 часа, в часе 60 минут. Получается, что обычный год длится 8760 часов (или 525600 минут)!',
    },
    {
      id: 'ru-travel',
      title: 'Путешествие',
      text: 'Собираясь в дорогу, составьте список: документы, деньги, телефон, зарядка, аптечка. Проверьте прогноз погоды и возьмите удобную обувь. Самое ценное в поездке - не фотографии, а впечатления: новые места, люди, вкусы и запахи.',
    },
    {
      id: 'ru-practice',
      title: 'О практике',
      text: 'Не смотрите на клавиатуру. Сначала печатайте медленно и точно, скорость придёт сама. Десять минут каждый день полезнее, чем час раз в неделю.',
    },
    {
      id: 'ru-final',
      title: 'Напутствие',
      text: 'Слепая печать - полезный навык, который пригодится каждому. Когда пальцы сами находят нужные клавиши, внимание остаётся на мыслях, а не на клавиатуре. Вы пишете быстрее, меньше устаёте и реже ошибаетесь. Главное - регулярность: 15 минут в день за месяц дают заметный результат. Продолжайте тренироваться (и не забывайте делать перерывы)!',
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
      id: 'en-evening',
      title: 'Evening city',
      text: 'The city changes in the evening. Street lights come on, warm light appears in the windows, and the streets grow quieter. Some people hurry home, others are just heading out for a walk. It is nice to stroll along the river and watch the lights on the water.',
    },
    {
      id: 'en-coffee',
      title: 'Coffee',
      text: "Ethiopia is often called the birthplace of coffee. According to legend, a goat herder noticed that his goats grew lively after eating berries from a certain bush. Today coffee is enjoyed all over the world, and for many people the day doesn't start without a cup.",
    },
    {
      id: 'en-letter',
      title: 'A letter',
      text: 'Hi! How are you? We are doing well: last week we went out of town, baked potatoes over a fire and watched the stars until midnight. Come and visit in the summer; there is room for everyone. Write soon!',
    },
    {
      id: 'en-numbers',
      title: 'Numbers',
      text: 'A year has 12 months, 52 weeks and 365 days (366 in a leap year). A day has 24 hours, and an hour has 60 minutes. So a common year lasts 8760 hours - or 525600 minutes!',
    },
    {
      id: 'en-travel',
      title: 'Travel',
      text: 'Before a trip, make a list: passport, money, phone, charger and a first-aid kit. Check the weather forecast and pack comfortable shoes. The most valuable part of any journey is not the photos but the memories: new places, people, tastes and smells.',
    },
    {
      id: 'en-practice',
      title: 'On practice',
      text: 'Do not look at the keyboard. Type slowly and accurately at first, and speed will come. Ten minutes every day beats an hour once a week.',
    },
    {
      id: 'en-final',
      title: 'Parting words',
      text: "Touch typing is a useful skill for everyone. When your fingers find the keys on their own, your attention stays on your thoughts rather than on the keyboard. You type faster, get tired less and make fewer mistakes. The secret is consistency: 15 minutes a day for a month brings a visible result. Keep practicing (and don't forget to take breaks)!",
    },
  ],
}

export function practiceText(layout: LayoutId, id: string): string {
  const found = practiceTexts[layout].find((x) => x.id === id)
  if (!found) throw new Error(`No practice text ${id}`)
  return found.text
}
