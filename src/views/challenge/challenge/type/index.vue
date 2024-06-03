<!--
  Description：
  @date：2024-03-23 18:53
  @author：JokerWang
-->

<template>
  <el-card style="border-radius: 10px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="font-size: 18px">题目类型</div>
      <div style="vertical-align: center">
        <el-button type="primary" size="default" icon="Plus" @click="addType">
          新增类型
        </el-button>
        <el-button
          type="danger"
          size="default"
          icon="Delete"
          @click="handlerMuchDel"
          :loading="isDeleting"
        >
          {{ deletingMessage }}
        </el-button>
      </div>
    </div>
    <el-table
      style="margin: 10px 0"
      border
      :data="challengeStore.challengeTypeList"
      :default-sort="{ prop: 'createtime', order: 'descending' }"
      @selection-change="handleSelectionChange"
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
      <el-table-column
        label="赛题类型"
        width="150px"
        align="center"
        prop="typename"
        sortable
      ></el-table-column>
      <el-table-column
        label="编码"
        width="220px"
        align="center"
        prop="encode"
        sortable
      ></el-table-column>
      <el-table-column
        label="是否赛事类型"
        width="160px"
        align="center"
        prop="comptype"
        sortable
      >
        <template #="{ row, $index }">
          <el-tag :type="row.comptype == 1 ? 'success' : 'warning'">
            {{ row.comptype == 1 ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        width="380px"
        align="center"
        prop="description"
        sortable
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="default"
            icon="Edit"
            @click="editType(row)"
          ></el-button>
          <el-popconfirm
            title="确认删除吗?"
            icon="delete"
            confirm-button-type="danger"
            cancel-button-type="warning"
            @confirm="deleteType(row)"
          >
            <template #reference>
              <el-button type="danger" size="default" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageCurrent"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :small="small"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper,"
      :total="challengeStore.challengeTypeTotal"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </el-card>
  <el-dialog v-model="addTypeVisible" title="添加题目类型" draggable overflow>
    <el-form style="margin-top: 40px; margin-left: 180px" label-width="100px">
      <el-form-item label="类型名称">
        <el-input
          style="width: 250px"
          v-model="addTypeForm.typename"
          placeholder="请输入类型名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型编码" style="margin-top: 30px">
        <el-input
          style="width: 250px"
          v-model="addTypeForm.encode"
          placeholder="请输入镜像编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否赛事分类" style="margin-top: 30px">
        <el-switch
          v-model="isAddCompType"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="类型描述" style="margin-top: 30px">
        <el-input
          placeholder="请输入类型描述"
          v-model="addTypeForm.description"
          style="width: 250px"
          maxlength="30"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="warning" size="default" @click="addTypeCancel">
        取消
      </el-button>
      <el-button type="primary" size="default" @click="addTypeConform">
        确定
      </el-button>
    </template>
  </el-dialog>
  <el-drawer v-model="editTypeVisible" title="镜像类型信息">
    <el-form label-width="100px">
      <el-form-item label="类型名称" style="margin-top: 20px">
        <el-input
          v-model="editTypeForm.typename"
          style="width: 250px"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型编码" style="margin-top: 40px">
        <el-input
          v-model="editTypeForm.encode"
          style="width: 250px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="是否赛事分类" style="margin-top: 30px">
        <el-switch
          v-model="isEditCompType"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="类型描述" style="margin-top: 40px">
        <el-input
          placeholder="请输入类型描述"
          v-model="editTypeForm.description"
          style="width: 250px"
          maxlength="30"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="flex: auto; margin-right: 250px">
        <el-button type="warning" size="large" @click="editCancel">
          取消
        </el-button>
        <el-button type="primary" size="large" @click="editConform">
          确认
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useChallengeStore from '@/store/challenge/challenge.ts'
import {
  reqAddChallengeType,
  reqDelChallengeType,
  reqUpdateChallengeType,
} from '@/api/challenge'

let challengeStore = useChallengeStore()
// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)

// ——————————————————————————————————————————————————————————————————————————————————
// 表单收集设置
let addTypeForm = reactive({
  typename: '',
  encode: '',
  description: '',
  comptype: 0,
})
let editTypeForm = reactive({
  challengetypeid: '',
  typename: '',
  encode: '',
  description: '',
  comptype: 0,
})
let selectChange = ref([])
// ——————————————————————————————————————————————————————————————————————————————————
// 判断栏设置
let isDeleting = ref<boolean>(false)
let addTypeVisible = ref<boolean>(false)
let editTypeVisible = ref<boolean>(false)
let deletingMessage = ref<string>('批量删除')
let isAddCompType = ref<boolean>(false)
let isEditCompType = ref<boolean>(false)
// ——————————————————————————————————————————————————————————————————————————————————
// 实现方法
let sizeChange = async () => {
  await challengeStore.challengeTypeList(pageCurrent.value, pageSize.value)
}
let currentChange = async () => {
  await challengeStore.challengeTypeList(pageCurrent.value, pageSize.value)
}

const addType = () => {
  addTypeForm.encode = ''
  addTypeForm.description = ''
  addTypeForm.typename = ''
  isAddCompType.value = false
  addTypeVisible.value = true
}
const addTypeCancel = () => {
  addTypeVisible.value = false
}
const addTypeConform = async () => {
  if (isAddCompType.value == true) {
    addTypeForm.comptype = 1
  } else {
    addTypeForm.comptype = 2
  }
  let result = await reqAddChallengeType(addTypeForm)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加类型成功',
    })
  }
  addTypeVisible.value = false
  await challengeStore.GetChallengeTypeList(pageCurrent.value, pageSize.value)
}

const deleteType = async (row: challengeStore.challengeTypeList) => {
  let result = await reqDelChallengeType(row.challengetypeid)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
  }
  await challengeStore.GetChallengeTypeList(pageCurrent.value, pageSize.value)
}

const handleSelectionChange = (val) => {
  selectChange.value = val
}
const handlerMuchDel = () => {
  isDeleting.value = true
  deletingMessage.value = '正在删除'
  ElMessageBox.confirm('确认删除这些类型吗?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let delId = ''
      // 愚笨式的循环写法
      for (let i = 0; i < selectChange.value.length; i++) {
        delId = selectChange.value[i].challengetypeid
        await reqDelChallengeType(delId)
      }
      await challengeStore.GetChallengeTypeList(
        pageCurrent.value,
        pageSize.value,
      )
      isDeleting.value = false
      deletingMessage.value = '批量删除'
      ElMessage({
        type: 'success',
        message: '成功删除',
      })
    })
    .catch(() => {
      isDeleting.value = false
      deletingMessage.value = '批量删除'
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
const editType = async (row) => {
  editTypeVisible.value = true
  editTypeForm.challengetypeid = row.challengetypeid
  editTypeForm.typename = row.typename
  editTypeForm.description = row.description
  editTypeForm.encode = row.encode
  if (row.comptype == 1) {
    isEditCompType.value = true
  } else {
    isEditCompType.value = false
  }
}
const editCancel = () => {
  editTypeVisible.value = false
}
const editConform = async () => {
  console.log(isEditCompType.value)

  if (isEditCompType.value == true) {
    editTypeForm.comptype = 1
  } else {
    editTypeForm.comptype = 2
  }
  console.log(editTypeForm)
  let result = await reqUpdateChallengeType(editTypeForm)
  if (result.code == 200) {
    editTypeVisible.value = false
    await challengeStore.GetChallengeTypeList(pageCurrent.value, pageSize.value)
  }
}
</script>

<style scoped></style>
