<!--
  Description：
  @date：2024-03-18 18:29
  @author：JokerWang
-->

<template>
  <div class="logo" :class="{ fold: layoutSettingStore.fold ? true : false }">
    <img src=" @/assets/images/logo.png " alt="" />
    <p v-show="!layoutSettingStore.fold">{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting.ts'
import useLayoutSettingStore from '@/store/setting.ts'

let layoutSettingStore = useLayoutSettingStore()
</script>

<script lang="ts">
export default {
  name: 'Logo',
}
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  transition: all 1s;

  img {
    height: $slider-logo-image-height;
  }

  p {
    margin-left: 8px;
    font-family: "Microsoft YaHei";
    font-size: 18px;
    color: #3f74bc;
  }

  &.fold {
    margin-left: 7px;
  }
}
</style>
