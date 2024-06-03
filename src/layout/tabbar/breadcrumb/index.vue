<!--
  Description：
  @date：2024-03-19 2:22
  @author：JokerWang
-->

<template>
  <div class="tabbar_left">
    <el-icon style="margin-right: 20px" @click="changeIcon">
      <component :is="layoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb :separator-icon="ArrowRightBold">
      <el-breadcrumb-item
        v-for="(item, index) in $route.matched"
        :key="index"
        v-show="item.meta.title"
        :to="item.path"
      >
        <el-icon style="vertical-align: middle">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span style="margin: 0 5px">{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightBold } from '@element-plus/icons-vue'
import useLayoutSettingStore from '@/store/setting.ts'
import { useRoute } from 'vue-router'

let layoutSettingStore = useLayoutSettingStore()

let $route = useRoute()

const changeIcon = () => {
  //图标切换
  layoutSettingStore.fold = !layoutSettingStore.fold
}
</script>

<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>

<style scoped></style>
