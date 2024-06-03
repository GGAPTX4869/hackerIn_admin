<!--
  Description：
  @date：2024-03-19 2:22
  @author：JokerWang
-->

<template>
  <!-- 右侧导航栏 -->
  <div class="tabbar_right">
    <el-button size="small" icon="Refresh" circle @click="Refresh"></el-button>
    <el-button
      size="small"
      icon="FullScreen"
      circle
      @click="FullScreen"
    ></el-button>
    <el-button size="small" icon="Setting" circle></el-button>
    <img
      :src="userStore.avatar"
      style="width: 30px; height: 30px; margin: 0 10px"
    />
    <!-- 下拉菜单 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ userStore.username }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/setting.ts'
import { FullScreen } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user.ts'
import { useRouter, useRoute } from 'vue-router'

let userStore = useUserStore()

let layoutSeettingStore = useLayoutSettingStore()

let $router = useRouter()
let $route = useRoute()

// 刷新主页
const Refresh = () => {
  layoutSeettingStore.refresh = !layoutSeettingStore.refresh
}

// 全屏
const FullScreen = () => {
  // DOM对象的属性
  let full = document.fullscreenElement
  if (!full) {
    // 利用requestFullscreen方法实现
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const logout = async () => {
  // 向服务器发请求,退出登录【token】无效
  await userStore.userLogout()
  // 登录跳转
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped></style>
