// word.js

import { computed, ref } from 'vue'

import { lookupWord } from './wordApi'

export default function useWordLookup(initialWord = '') {

  const word = ref(initialWord)
  const result = ref(null)

  const lookup = async () => {
    result.value = await lookupWord(word.value)
  }

  const isLookupDone = computed(() => !!result.value)

  return {
    word,
    result,
    lookup,
    isLookupDone
  }

}
