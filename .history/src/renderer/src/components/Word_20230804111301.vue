<template>
  <div class="word">
    <h1>{{ word }}</h1>
    <div v-for="(meaning, index) in meanings" :key="index">
      <h2>{{ meaning.partOfSpeech }}</h2>
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

const props = defineProps<{
  wordData: WordData
}>()

const word = computed(() => props.wordData.word)
const meanings = computed(() => props.wordData.meanings)

function playAudio(audioUrl: string) {
  console.log(audioUrl)
  const audio = new Audio(audioUrl)
  audio.play()
}
</script>

<style>
.word {
  margin: 20px;
}
h1 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}
h2 {
  font-size: 24px;
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
