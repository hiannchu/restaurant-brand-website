import { ref } from 'vue'
import { translations, type Lang } from '../i18n'

// Module-level singleton — all components share the same reactive state
const lang = ref<Lang>((localStorage.getItem('lang') as Lang) || 'zh')

export function useLang() {
  function setLang(l: Lang) {
    lang.value = l
    localStorage.setItem('lang', l)
  }

  function t(key: string): string {
    const keys = key.split('.')
    let result: unknown = translations[lang.value]
    for (const k of keys) {
      result = (result as Record<string, unknown>)?.[k]
    }
    return typeof result === 'string' ? result : key
  }

  return { lang, setLang, t }
}
