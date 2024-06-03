<!--
  Description：
  @date：2024-03-18 11:11
  @author：JokerWang
-->

<template>
  <div>
    <el-card style="border-radius: 10px">
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex">
          <el-avatar :size="100" :src="userInfo.avatar"></el-avatar>
          <div>
            <div style=" margin-top: 2vh; margin-left: 2vw;font-size: 20px">
              {{ timeMessage }}，{{ userInfo.username }}，祝你愉快度过今天！
            </div>
            <div
              style="
                margin-top: 2vh;
                margin-left: 2vw;
                font-size: 16px;
              "
            >
              今日天气晴朗，最高温度19℃！
            </div>
            <div
              style="
                margin-top: 2vh;
                margin-left: 2vw;
                font-size: 16px;
              "
            >
              {{ nowTime }}
            </div>
          </div>
        </div>
        <div
          style="
            display: flex;
            margin-top: 2vh;
            margin-left: 2vw;
            font-size: 20px;
          "
        >
          <div style="margin-left: 1vw">
            <div>今日已处理</div>
            <div style="margin-top: 3vh; margin-left: 3vw; font-size: 16px">
              2
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <div style="display: flex; justify-content: space-between; margin-top: 3vh">
      <el-card
        style="
          width: 20vw;
          height: 15vh;
          background-color: rgb(154 154 220 / 71%);
          border-radius: 10px;
        "
      >
        <div style="font-size: 20px; font-weight: bolder">今日访问量</div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 2vh;
          "
        >
          <el-icon size="50" style="margin-left: 2vw"><User /></el-icon>
          <div style=" margin-right: 2vw;font-size: 40px">33</div>
        </div>
      </el-card>
      <el-card
        style="
          width: 20vw;
          height: 15vh;
          background-color: rgb(227 68 154 / 44%);
          border-radius: 10px;
        "
      >
        <div style="font-size: 20px; font-weight: bolder">当前容器运行数量</div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 2vh;
          "
        >
          <el-icon size="50" style="margin-left: 2vw"><Cpu /></el-icon>
          <div style=" margin-right: 2vw;font-size: 40px">13</div>
        </div>
      </el-card>
      <el-card
        style="
          width: 20vw;
          height: 15vh;
          background-color: rgb(155 230 119 / 69%);
          border-radius: 10px;
        "
      >
        <div style="font-size: 20px; font-weight: bolder">当前活跃人数</div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 2vh;
          "
        >
          <el-icon size="50" style="margin-left: 2vw"><Promotion /></el-icon>
          <div style=" margin-right: 2vw;font-size: 40px">13/56</div>
        </div>
      </el-card>
      <el-card
        style="
          width: 20vw;
          height: 15vh;
          background-color: rgb(206 149 129 / 75%);
          border-radius: 10px;
        "
      >
        <div style="font-size: 20px; font-weight: bolder">待办事项</div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 2vh;
          "
        >
          <el-icon size="50" style="margin-left: 1vw"><Collection /></el-icon>
          <div style=" margin-right: 2vw;font-size: 40px">20</div>
        </div>
      </el-card>
    </div>
    <div style="display: flex">
      <el-card style=" width: 50vw;margin-top: 3vh; border-radius: 10px">
        <div
          style="
            margin-left: 20vw;
            font-size: 24px;
            color: rgb(36 54 57 / 65%);
          "
        >
          每日解题数量
        </div>
        <Daily style="margin-top: 2vh" />
      </el-card>
      <el-card
        style="
          width: 30vw;
          margin-top: 3vh;
          margin-left: 2vw;
          border-radius: 10px;
        "
      >
        <div
          style="
            margin-left: 9vw;
            font-size: 24px;
            color: rgb(36 54 57 / 65%);
          "
        >
          WP分布数量
        </div>
        <ChallengChart />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// import {onMounted} from "vue";
import useUserStore from '@/store/modules/user.ts'
import { reqGetUserInfo } from '@/api/user'
import { onMounted, ref } from 'vue'
import ChallengChart from './echart/challenge/index.vue'
import Daily from './echart/daily/index.vue'
import { reqGetWeek } from '@/api/action'

let userStore = useUserStore()
onMounted(async () => {
  await getUserInfo()
  await getWeek()
})

let userInfo = ref({
  avatar: '',
  username: '',
})
let timeMessage = ref()
let nowTime = ref()

const getUserInfo = async () => {
  let result = await reqGetUserInfo()
  userInfo.value = result.data
  console.log(result)
  await getTime()
}

const getTime = () => {
  let timeNow = new Date()
  let hours = timeNow.getHours()
  if (hours >= 0 && hours <= 10) {
    timeMessage.value = '早安'
  } else if (hours > 10 && hours <= 14) {
    timeMessage.value = '中午好'
  } else if (hours > 14 && hours <= 18) {
    timeMessage.value = '下午好'
  } else if (hours > 18 && hours <= 24) {
    timeMessage.value = '晚上好'
  }
  let time = new Date()
  nowTime.value = time.toLocaleDateString()
}
</script>

<style scoped></style>
