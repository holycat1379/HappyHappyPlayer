// word.js

import { computed, ref } from 'vue'

export default function useWordLookup(initialWord = '') {
  const word = ref(initialWord)
  const result = ref(null)

  const lookup = async () => {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.value}`)
    const data = await response.json()

    return data[0].meanings[0].definitions[0].definition
  }

  const isLookupDone = computed(() => !!result.value)

  return {
    word,
    result,
    lookup,
    isLookupDone
  }
}
