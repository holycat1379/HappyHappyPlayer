<template>
  <div>
    <div class="translation__basic">
      <ul class="translation__list">
        <li v-for="item in basic.explains" :key="item" class="translation__item">{{ item }}</li>
      </ul>
      <button
        v-if="basic.phonetic"
        class="translation__audio-button"
        @click="playAudio(basic['uk-speech'])"
      >
        {{ basic.phonetic }}
      </button>
    </div>
    <div v-if="web" class="translation__web">
      <h3 class="translation__subtitle">网络释义</h3>
      <ul class="translation__list">
        <li v-for="item in web" :key="item.key" class="translation__item">
          <h4 class="translation__subsubtitle">{{ item.key }}</h4>
          <ul class="translation__list">
            <li v-for="value in item.value" :key="value" class="translation__item">{{ value }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// defineProps
const props = defineProps<{
  basic: {
    phonetic: string
    explains: string[]
  }
  web: {
    key: string
    value: string[]
  }[]
}>()

const playAudio = (phonetic): void => {
  const audio = new Audio(phonetic)
  audio.play()
}
</script>

<style scoped>
.translation__audio-button {
  font-size: 20px;

  width: 200px;
  height: 30px;
}
.translation__basic {
  font-size: 18px;
}
.translation {
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: white;
}

.translation__title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.translation__subtitle {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.translation__subsubtitle {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.translation__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.translation__item {
  margin-bottom: 8px;
}
</style>
