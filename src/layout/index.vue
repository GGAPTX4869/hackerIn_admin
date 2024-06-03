<template>
  <div class="layout_container" style="overflow: hidden hidden">
    <!-- 左侧菜单栏 -->
    <div
      class="layout_slider"
      :class="{ fold: layoutSettingStore.fold ? true : false }"
    >
      <!-- logo组件 -->
      <logo />
      <!-- 滚动组件-->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          text-color="black"
          :collapse="layoutSettingStore.fold ? true : false"
          collapse-transition
          :default-active="$route.path"
        >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 导航栏 -->
    <div
      class="layout_tabbar"
      :class="{ fold: layoutSettingStore.fold ? true : false }"
    >
      <tabble />
    </div>
    <!-- 内容区 -->
    <div
      class="layout_main"
      :class="{ fold: layoutSettingStore.fold ? true : false }"
    >
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabble from './tabbar/index.vue'
import useUserStore from '@/store/modules/user.ts'
import useLayoutSettingStore from '@/store/setting.ts'

let layoutSettingStore = useLayoutSettingStore()

console.log(layoutSettingStore.fold)

let $route = useRoute()

let userStore = useUserStore()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  background-color: #ede6e6;

  .layout_slider {
    width: $base-menu-width;
    height: 98.5vh;
    padding-top: 5px;
    margin-top: 4px;
    margin-left: 4px;
    background-color: $base-menu-background;
    border-radius: 10px;
    transition: all 1s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $slider-logo-image-height);

      .el-menu {
        border-right: 0;
      }
    }

    &.fold {
      width: $base-menu-min-width;
    }
  }

  .layout_tabbar {
    position: absolute;
    top: 5px;
    left: $base-menu-width + 10px;
    width: calc(100% - $base-menu-width - 15px);
    height: $base-tabbar-height;
    font-size: 20px;
    background-color: #fff;
    border-radius: 10px;
    transition: all 1s;

    &.fold {
      left: $base-menu-min-width + 13px;
      width: calc(100vw - $base-menu-min-width - 20px);
    }
  }

  .layout_main {
    position: absolute;
    top: $base-tabbar-height + 10px;
    left: $base-menu-width + 10px;
    width: calc(100% - $base-menu-width - 15px);
    height: calc(100vh - $base-tabbar-height - 16px);
    padding: 20px;
    overflow: auto;
    background-color: white;
    border-radius: 10px;
    transition: all 1s;

    &.fold {
      left: $base-menu-min-width + 13px;
      width: calc(100vw - $base-menu-min-width - 20px);
    }
  }
}
</style>
