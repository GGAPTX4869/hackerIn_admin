<!--
  Description：
  @date：2024-03-31 15:10
  @author：JokerWang
-->

<template>
  <div class="container">
    <div class="up">
      <Type />
    </div>
    <div class="down">
      <ChalInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
import Type from './type/index.vue'
import ChalInfo from './chalinfo/index.vue'
import { onMounted } from 'vue'
import useChallengeStore from '@/store/challenge/challenge.ts'

let challengeStore = useChallengeStore()

onMounted(() => {
  GetChallengeList()
  GetChallengeTypeList()
})

const GetChallengeTypeList = async () => {
  await challengeStore.GetChallengeTypeList(1, 10)
}

const GetChallengeList = async () => {
  await challengeStore.GetChallengeList(1, 10)
}
</script>

<style scoped lang="scss">
.container {
  .up {
  }

  .down {
  }
}
</style>
