<!--
  Description：
  @date：2024-03-18 11:11
  @author：JokerWang
-->

<template>
  <el-button plain @click="open1">Success</el-button>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'

const open1 = () => {
  ElNotification({
    title: 'Success',
    message: 'This is a success message',
    type: 'success',
  })
}
</script>

<style scoped></style>
