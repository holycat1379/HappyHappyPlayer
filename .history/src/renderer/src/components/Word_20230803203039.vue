<template>
  <div class="dictionary">
    <h2>{{ word }}</h2>
    <div v-for="(meaning, index) in meanings" :key="index">
      <h3>{{ meaning.partOfSpeech }}</h3>
      <ul>
        <li v-for="(definition, i) in meaning.definitions" :key="i">
          {{ definition.definition }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    wordData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    word() {
      return this.wordData.word;
    },
    meanings() {
      return this.wordData.meanings;
    },
  },
};
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
</style>
