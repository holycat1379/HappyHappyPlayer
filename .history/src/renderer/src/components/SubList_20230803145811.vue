<template>
  <div class="subtitle-item">
    <p
      v-for="(subtitle, index) in srtArray"
      :id="subtitle.id"
      :key="index"
      style="cursor: pointer"
      class="subtitle-text"
      @click="handleSubtitleClick(subtitle)"
    >
      {{ subtitle.text }}
    </p>
  </div>
</template>

<script setup lang="ts">
// 当前字幕点击事件
const handleSubtitleClick = (subtitle) => {
  const element = document.getElementById(subtitle.id)
  if (element) {
    element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' })
    player.value?.instance.currentTime(subtitle.startSeconds)
  }
}
</script>

<style scoped>
.subtitle-item {
  overflow: auto;
  grid-area: subtitle;
  padding: 10px 20px 10px 40px;
  font-size: 18px;

  .subtitle-text:hover {
    color: cyan;
  }
}
</style>
