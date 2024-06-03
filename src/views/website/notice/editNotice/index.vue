<!--
  Description：
  @date：2024-04-03 23:23
  @author：JokerWang
-->

<template>
  <div class="">
    <el-button
      type="primary"
      plain
      round
      style="font-size: 16px"
      size="default"
      @click="goBackToNotice"
    >
      返回
    </el-button>
    <el-button
      type="success"
      plain
      round
      style="font-size: 16px"
      size="default"
      @click="editConfirm"
    >
      确认
    </el-button>
    <el-form style="margin-top: 3vh">
      <div style="display: flex">
        <el-form-item label="标题" style="margin-left: 2vw">
          <el-input
            style="width: 200px"
            v-model="editNoticeForm.actionname"
          ></el-input>
        </el-form-item>
        <el-form-item label="公告状态" style="margin-left: 2vw">
          <el-select
            style="width: 200px"
            placeholder="请选择公告状态"
            v-model="editNoticeForm.actionstatus"
          >
            <el-option
              v-for="item in isChallengeStatus"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="公告内容" style="margin-top: 2vh">
        <div style="width: 100%">
          <v-md-editor
            v-model="editNoticeForm.description"
            height="500px"
          ></v-md-editor>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { reqAddNotice, reqGetNoticeById, reqUpdateNotice } from '@/api/action'
import { ElMessage } from 'element-plus'

onMounted(async () => {
  let actionid = $route.query.actionid
  console.log(actionid)
  await getActionById(actionid)
})

let $router = useRouter()
let $route = useRoute()
let editNoticeForm = ref({
  actionname: '',
  description: '',
  actionstatus: '',
})
let isChallengeStatus = ref([
  {
    value: 1,
    lable: '启用',
  },
  {
    value: 2,
    lable: '禁止',
  },
])

const goBackToNotice = () => {
  $router.push('/website/notice')
}

const getActionById = async (actionid: any) => {
  let result = await reqGetNoticeById(actionid)
  console.log(result)
  if (result.code == 200) {
    editNoticeForm.value = result.data
  }
}

const editConfirm = async () => {
  let result = await reqUpdateNotice(editNoticeForm.value)
  console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '成功修改公告',
    })
    $router.push('/challenge/notice')
  } else {
    ElMessage({
      type: 'error',
      message: '修改失败',
    })
  }
}
</script>

<style scoped></style>
