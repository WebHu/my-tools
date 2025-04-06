import { createI18n } from 'vue-i18n'
import en from './locales/en.js'
import zh from './locales/zh.js'
// 国际化
const i18n = createI18n({
  legacy: false,
  locale: 'en', // 默认
  fallbackLocale: 'en',
  messages: { en, zh }
})

export default i18n