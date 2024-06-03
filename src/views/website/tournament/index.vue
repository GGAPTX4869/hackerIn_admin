<!--
  Description：
  @date：2024-03-20 23:21
  @author：JokerWang
-->

<template>
  <div>
    <Type />
  </div>
  <div>
    <CompInfo />
  </div>
</template>

<script setup lang="ts">
import Type from './type/index.vue'
import CompInfo from './compinfo/index.vue'
import { onMounted, ref } from 'vue'
import useCompStore from '@/store/comp/comp.ts'
onMounted(async () => {
  await getCompType()
  await getCompList()
})
let compStore = useCompStore()
// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)
</script>

<style scoped></style>
