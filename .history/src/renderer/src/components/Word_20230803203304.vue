<template>
  <div class="dictionary">
    <h2>{{ word }}</h2>
    <div v-for="(meaning, index) in meanings" :key="index">
      <h3>{{ meaning.partOfSpeech }}</h3>
      <ul>
        <li v-for="(definition, i) in meaning.definitions" :key="i">
          {{ definition.definition }}
          <button @click="playAudio(definition.audioUrl)">Play</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Definition {
  definition: string
  audioUrl: string
}

interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
}

interface WordData {
  word: string
  meanings: Meaning[]
}

export default {
  props: {
    wordData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const word = computed(() => props.wordData.word)
    const meanings = computed(() => props.wordData.meanings)

    function playAudio(audioUrl: string) {
      const audio = new Audio(audioUrl)
      audio.play()
    }

    return {
      word,
      meanings,
      playAudio
    }
  }
}
</script>

<style>
.dictionary {
  margin: 20px;
}
h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}
ul {
  margin-left: 20px;
}
li {
  margin-bottom: 5px;
}
button {
  margin-left: 10px;
}
</style>
