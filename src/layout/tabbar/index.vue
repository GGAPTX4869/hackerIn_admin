<!--
  Description：
  @date：2024-03-18 23:13
  @author：JokerWang
-->

<template>
  <div class="tabbar">
    <!-- 左侧导航栏 -->
    <Breadcrumb />
    <!-- 右侧导航栏 -->
    <Setting />
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>

<style scoped lang="scss">
.tabbar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  //background-image: linear-gradient(to right, #957777, #c0c78e);
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .tabbar_right {
    display: flex;
    align-items: center;
    margin-right: 30px;
  }
}
</style>
