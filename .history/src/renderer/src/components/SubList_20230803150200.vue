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
import Player from './components/Player.vue'

const props = defineProps<{ srtArray: Parser.; player: InstanceType<typeof Player> }>()

const preElement = ref()
const currentItem = ref('')

// 监听当前播放时间
watch(
  () => player.value?.currentStartSeconds,
  () => {
    const resultArray = []
    srtArray.value.forEach((item, index) => {
      // 如果是最后一个 则下一个开始时间为0 也就是视频结束时间
      let nextStartSeconds = srtArray.value[index + 1] ? srtArray.value[index + 1].startSeconds : 0

      // 如果两者相等说明存在同样两个的时间 就需要判断下一个的下一个时间
      if (nextStartSeconds === item.startSeconds && srtArray.value[index + 2]) {
        nextStartSeconds = srtArray.value[index + 2].startSeconds
      }

      // 如果当前时间大于等于当前字幕开始时间 并且小于下一个字幕开始时间 则说明当前字幕正在播放
      if (
        player.value?.currentStartSeconds >= item.startSeconds &&
        player.value?.currentStartSeconds < nextStartSeconds
      ) {
        resultArray.push(item)
      }
    })

    // 如果有多个字幕正在播放 则优先选择日文字幕
    if (resultArray.length > 1) {
      resultArray.forEach((item) => {
        if (check_is_jp(item.text)) {
          currentItem.value = item
        }
      })
    } else {
      currentItem.value = resultArray[0]
    }
    // 如果当前字幕为空 则不做任何操作
    if (!currentItem.value) {
      return
    }

    // 获取当前字幕对应的元素
    const element = document.getElementById(currentItem.value.id)

    // 如果当前元素和上一个元素相同 则不做任何操作
    if (element === preElement.value) {
      return
    }

    // 如果当前元素存在 则将当前元素滚动到中间
    if (element) {
      grammar.value = jsonArray.value.find((item) => {
        return item['原句'] === currentItem.value.text
      })

      // 如果上一个元素存在 则将上一个元素的样式还原
      if (preElement.value) {
        preElement.value.style.color = '#fff'
        preElement.value.style.fontSize = '18px'
        preElement.value.style.margin = '0 0'
      }

      // 将当前元素的样式修改
      element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' })
      element.style.color = '#18a058'
      element.style.fontSize = '22px'
      element.style.margin = '10px 0'

      preElement.value = element
    }
  }
)

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
