<template>
  <!-- 循环一个数组，生成文字-->
  <div style="padding:20px 40px">
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>元素</th>
          <th>平假名</th>
          <th>词性</th>
          <th>含义</th>
          <th>解析</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in grammar?.结构" :key="index">
          <td style="font-size: 16px;color:#18a058;">{{ item.元素 }}</td>
          <td>{{ item.平假名 }}</td>
          <td>{{ item.词性 }}</td>
          <td>{{ item.含义 }}</td>
          <td>{{ item.解析 }}</td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
`

<script setup lang="ts">
const props = defineProps({
  grammar: Object
})

console.log(props.grammar)
</script>

<style scoped>
.jp-box {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
}
</style>
