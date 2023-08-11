import CryptoJS from 'crypto-js'
import axios from 'axios'
import { ref } from 'vue'

const useYoudaoTranslation = (appKey: string, appSecret: string) => {
  const translation = ref<TranslationData>()
  const loading = ref(false)
  const error = ref(null)

  const translate = async (text, from = 'auto', to = 'auto') => {
    const cacheText = getTranslationCache(text)
    if (cacheText) {
      translation.value = cacheText
      return
    }

    loading.value = true
    error.value = null

    const salt = Date.now()
    const curtime = Math.round(Date.now() / 1000).toString()
    const signStr = appKey + truncate(text) + salt + curtime + appSecret
    const sign = CryptoJS.SHA256(signStr).toString(CryptoJS.enc.Hex)
    const url = `https://openapi.youdao.com/api?q=${encodeURIComponent(
      text
    )}&from=${from}&to=${to}&appKey=${appKey}&salt=${salt}&sign=${sign}&signType=v3&curtime=${curtime}`

    try {
      const response = await axios.get(url)
      const data = response.data

      if (data.errorCode === '0') {
        translation.value = data
        setTranslationCache(text, data)
      } else {
        error.value = data
      }
    } catch (error) {
      error.value = error.message
    }

    loading.value = false
  }

  const truncate = (q: string) => {
    const len = q.length
    return len <= 20 ? q : q.substr(0, 10) + len + q.substr(len - 10, len)
  }

  // 缓存翻译结果

  interface TranslationCache {
    [key: string]: TranslationData
  }

  interface TranslationData {
    errorCode: string
    translation: string[]
    basic?: {
      explains: string[]
    }
    web?: {
      key: string
      value: string[]
    }[]
  }

  const setTranslationCache = (text: string, data: TranslationData) => {
    const cache: TranslationCache = JSON.parse(localStorage.getItem('translationCache') || '{}')
    cache[text] = data
    localStorage.setItem('translationCache', JSON.stringify(cache))
  }

  const getTranslationCache = (text: string): TranslationData | null => {
    const cache: TranslationCache = JSON.parse(localStorage.getItem('translationCache') || '{}')
    return cache[text] || null
  }

  return { translation, loading, error, translate }
}

export default useYoudaoTranslation
