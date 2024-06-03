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
let chartRef = ref<HTMLElement>()
let echartRank = ref()
onMounted(() => {
  echartRank.value = echarts.init(chartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: '赛题分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 4,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: true,
        },
        data: [
          { value: 35, name: 'Web' },
          { value: 32, name: 'MISC' },
          { value: 44, name: 'RE' },
          { value: 12, name: 'CRYPTO' },
          { value: 53, name: 'PWN' },
        ],
      },
    ],
  }
  echartRank.value.setOption(option)
})
</script>

<style scoped></style>
