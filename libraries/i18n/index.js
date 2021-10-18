import { createI18n } from 'vue-i18n'

const lang = import.meta.globEager('./lang/*.js')
const messages = {}
Object.keys(lang).forEach(key => {
  const name = key.replace(/(.*\/)*([^.]+).*/ig, '$2')
  messages[name] = lang[key].default
})

const i18n = createI18n({
  locale: 'zh-cn', //默认显示的语言
  fallbackLocale: 'en',
  messages
})

// https://vue-i18n.intlify.dev/guide/advanced/lazy.html#lazy-loading
export const changeLanguage = (locale) => {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }
}

//setTimeout(() => {
//  changeLanguage('en')
//}, 3000)

export default i18n