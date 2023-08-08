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

<script setup lang="ts"></script>

<style scoped></style>
