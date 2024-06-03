<!--
  Description：
  @date：2024-04-11 8:36
  @author：JokerWang
-->

<template>
  <div ref="chartRef" style="height: 300px; background-color: white"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { reqGetWeek } from '@/api/action'
let chartRef = ref<HTMLElement>()
let echartRank = ref()
onMounted(() => {
  getData()
  echartRank.value = echarts.init(chartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Crypto', 'Web', 'RE', 'MISC', 'PWN'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: week.value,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Crypto',
        type: 'line',
        smooth: true,
        data: [23, 12, 45, 23, 32, 54, 12],
      },
      {
        name: 'Web',
        type: 'line',
        smooth: true,
        data: [53, 12, 43, 22, 13, 35, 70],
      },
      {
        name: 'RE',
        type: 'line',
        smooth: true,
        data: [53, 12, 42, 33, 23, 23, 12],
      },
      {
        name: 'MISC',
        type: 'line',
        smooth: true,
        data: [11, 32, 33, 22, 17, 42, 19],
      },
      {
        name: 'PWN',
        type: 'line',
        smooth: true,
        data: [64, 43, 23, 11, 34, 74, 23],
      },
    ],
  }
  echartRank.value.setOption(option)
})
let week = ref()

const getData = async () => {
  week.value = await reqGetWeek().data
}
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
</script>

<style scoped></style>
