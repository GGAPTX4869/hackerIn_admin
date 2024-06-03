<!--
  Description：
  @date：2024-04-11 2:04
  @author：JokerWang
-->

<template>
  <el-card style="border-radius: 10px">
    <div>
      <el-form style="margin-top: 20px" label-width="100px">
        <div style="display: flex; justify-content: space-between">
          <el-form-item label="日志类型">
            <el-select
              placeholder="请选择日志类型"
              style="width: 200px"
              @change="getList"
              v-model="getLogInfo.logtype"
            >
              <el-option
                v-for="item in roleStatusSelect"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日志信息">
            <el-input
              style="width: 200px"
              placeholder="请输入日志信息"
              v-model="getLogInfo.loginfo"
            ></el-input>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input
              style="width: 200px"
              placeholder="请输入操作人"
              v-model="getLogInfo.operator"
            ></el-input>
          </el-form-item>

          <div>
            <el-button
              style="color: #042a47"
              icon="Refresh"
              @click="refreshSelectForm"
            >
              重置
            </el-button>
            <el-button
              type="primary"
              style="margin-left: 20px; color: #042a47"
              icon="Aim"
              color="#DD9BF1FF"
              @click="getRoleList"
            >
              查询
            </el-button>
          </div>
        </div>
      </el-form>
    </div>
  </el-card>
  <el-card style=" margin-top: 10px;border-radius: 10px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="font-size: 18px">日志列表</div>
    </div>
    <el-table
      style="margin: 10px 0"
      border
      :data="logList"
      :default-sort="{ prop: 'createtime', order: 'descending' }"
    >
      <el-table-column
        label=""
        width="40px"
        align="center"
        type="selection"
      ></el-table-column>
      <el-table-column
        label="序号"
        width="60px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="日志类型" width="110px" align="center">
        <template #="{ row, $index }">
          <el-tag :type="getType(row)">
            {{ row.logtype }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="日志信息"
        width="500px"
        align="center"
        prop="loginfo"
      ></el-table-column>
      <el-table-column
        label="IP地址"
        width="160px"
        align="center"
        prop="operateip"
      ></el-table-column>
      <el-table-column
        label="操作人"
        width="160px"
        align="center"
        prop="operator"
      ></el-table-column>
      <el-table-column
        label="操作时间"
        align="center"
        prop="createtime"
        sortable
      ></el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageCurrent"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :small="small"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper,"
      :total="total"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqGetLogList } from '@/api/log'

let logList = ref()
onMounted(async () => {
  await getList()
})
// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let getLogInfo = ref({
  page: pageCurrent.value,
  limit: pageSize.value,
  logtype: '',
  loginfo: '',
  operator: '',
})
let roleStatusSelect = ref([
  {
    lable: 'INFO',
    value: 'INFO',
  },
  {
    lable: 'WARNING',
    value: 'WARNING',
  },
  {
    lable: 'ERROR',
    value: 'ERROR',
  },
])

const getList = async () => {
  let result = await reqGetLogList(getLogInfo.value)
  logList.value = result.data
  total.value = result.total
  console.log(result)
}
const getType = (row) => {
  if (row.logtype == 'INFO') {
    return 'success'
  } else if (row.logtype == 'WARNING') {
    return 'warning'
  } else {
    return 'error'
  }
}
const currentChange = () => {
  getList()
}
const sizeChange = () => {
  getList()
}
</script>

<style scoped></style>
