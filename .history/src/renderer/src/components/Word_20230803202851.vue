<template>
  <div>
    <h1>{{ word }}</h1>

    <div v-for="phonetic in phonetics">
      <audio :src="phonetic.audio" controls />
      {{ phonetic.text }}
    </div>

    <div v-for="meaning in meanings">
      <h2>{{ meaning.partOfSpeech }}</h2>

      <div v-for="definition in meaning.definitions">
        {{ definition.definition }}
        <p v-if="definition.example">Example: {{ definition.example }}</p>
      </div>

      <div v-if="meaning.synonyms.length">Synonyms: {{ meaning.synonyms.join(', ') }}</div>

      <div v-if="meaning.antonyms.length">Antonyms: {{ meaning.antonyms.join(', ') }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  props: ['dictionaryData'],

  setup(props) {
    const state = reactive({
      word: props.dictionaryData[0].word,
      phonetics: props.dictionaryData[0].phonetics,
      meanings: props.dictionaryData[0].meanings
    })

    return {
      ...state
    }
  }
})
</script>
