<!--
  Description：
  @date：2024-04-08 15:55
  @author：JokerWang
-->

<template>
  <div>
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="vertical-align: center">
        <el-button
          type="danger"
          size="default"
          icon="Delete"
          @click="handlerMuchDel"
        >
          删除
        </el-button>
      </div>
    </div>
    <el-table
      style="margin: 10px 0"
      border
      :data="auditList"
      :default-sort="{ prop: 'status', order: 'ascending' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label=""
        width="40px"
        align="center"
        type="selection"
      ></el-table-column>
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="60px"
      ></el-table-column>
      <el-table-column
        label="WP名称"
        align="center"
        prop="writeupname"
        width="140px"
      ></el-table-column>
      <el-table-column label="WP描述" align="center" prop="flag" width="200px">
        <template #="{ row, $index }">
          <div
            style="
              display: -webkit-box;
              overflow: hidden;
              word-break: break-all;
              word-wrap: break-word;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            "
          >
            {{ row.description }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="题目名称"
        align="center"
        prop="challengename"
        width="140px"
        sortable
      ></el-table-column>
      <el-table-column
        label="题目类型"
        align="center"
        prop="typename"
        width="120px"
        sortable
      ></el-table-column>
      <el-table-column
        label="提供人"
        align="center"
        prop="operator"
        width="140px"
      ></el-table-column>
      <el-table-column
        label="提供时间"
        align="center"
        prop="createtime"
        width="180px"
        sortable
      ></el-table-column>
      <el-table-column label="审核状态" align="center" prop="status" sortable>
        <template #="{ row, $index }">
          <el-button
            :type="row.status == 3 ? 'warning' : 'danger'"
            @click="pickWp(row)"
          >
            {{ row.status == 3 ? '待审核' : '审核不通过' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageCurrent"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper,"
      :total="total"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </div>
  <el-drawer v-model="isEditWpVision" title="题目信息">
    <el-form style="margin-left: 10px" label-width="100px">
      <el-form-item label="WP名称">
        <el-input
          style="width: 16vw"
          :placeholder="editWPForm.writeupname"
          v-model="editWPForm.writeupname"
        ></el-input>
      </el-form-item>
      <el-form-item label="wp描述" style="margin-top: 4vh">
        <el-input
          :placeholder="editWPForm.description"
          v-model="editWPForm.description"
          style="width: 16vw"
          maxlength="50"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="题目名称" style="margin-top: 4vh">
        <el-input
          style="width: 16vw"
          :placeholder="editWPForm.challengename"
          v-model="editWPForm.challengename"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="题目类型" style="margin-top: 4vh">
        <el-input
          style="width: 16vw"
          :placeholder="editWPForm.typename"
          v-model="editWPForm.typename"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="需要金币" style="margin-top: 4vh">
        <el-input-number
          v-model="editWPForm.golden"
          style="width: 16vw"
          :min="1"
          :max="10"
        />
      </el-form-item>
      <el-form-item label="创建人" style="margin-top: 4vh">
        <el-input
          style="width: 16vw"
          :placeholder="editWPForm.operator"
          v-model="editWPForm.operator"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" style="margin-top: 4vh">
        <el-input
          style="width: 16vw"
          :placeholder="editWPForm.createtime"
          v-model="editWPForm.createtime"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="OSS下载链接" style="margin-top: 4vh">
        <el-input
          style="width: 16vw"
          :placeholder="editWPForm.writeupurl"
          v-model="editWPForm.writeupurl"
          disabled
        >
          <template #append>
            <el-button
              size="default"
              @click="downLoadFile"
              style="
                align-content: center;
                font-weight: bold;
                color: #4eabf5;
                background: #e6f3fc;
              "
            >
              下载
            </el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto; margin-right: 160px">
        <el-button type="warning" size="large" @click="pickCancel">
          取消
        </el-button>
        <el-button type="danger" size="large" @click="pickUnConform">
          不通过
        </el-button>
        <el-button type="primary" size="large" @click="pickConform">
          通过
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { reqDelWPById, reqGetAuditWp, reqUpdateWP } from '@/api/wp'
import useChallengeStore from '@/store/challenge/challenge.js'
import { ElMessage, ElMessageBox } from 'element-plus'

let challengeStore = useChallengeStore()

onMounted(async () => {
  await getAuditList()
})

// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)

// ——————————————————————————————————————————————————————————————————————————————————
// 状态栏
let isEditWpVision = ref<boolean>(false)

// ——————————————————————————————————————————————————————————————————————————————————
// 信息栏
let auditList = ref([])
let editWPForm = reactive({
  challengeid: '',
  golden: 0,
  challengename: '',
  challengetype: '',
  createtime: '',
  description: '',
  operator: '',
  typename: '',
  writeupid: '',
  writeupname: '',
  writeupurl: '',
  status: 1,
})
let mutipleSelection = ref([])
// ——————————————————————————————————————————————————————————————————————————————————
// 方法栏

const handleSelectionChange = (val) => {
  mutipleSelection.value = val
}
const handlerMuchDel = async () => {
  ElMessageBox.confirm('确认删除这些镜像吗?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let delId = ''
      // 愚笨式的循环写法
      for (let i = 0; i < mutipleSelection.value.length; i++) {
        delId = mutipleSelection.value[i].writeupid
        await reqDelWPById(delId)
      }
      await getAuditList()
      ElMessage({
        type: 'success',
        message: '成功删除',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

const getAuditList = async () => {
  let result = await reqGetAuditWp(pageCurrent.value, pageSize.value)
  auditList.value = result.data

  let tempTotal = 0
  for (let item in auditList.value) {
    if (auditList.value[item].status == 3) {
      tempTotal += 1
    }
  }
  total.value = result.total
  challengeStore.WpAuditTotal = tempTotal
}
const currentChange = () => {
  getAuditList()
}

const sizeChange = () => {
  getAuditList()
}
const pickWp = (row) => {
  isEditWpVision.value = true
  editWPForm.challengeid = row.challengeid
  editWPForm.challengename = row.challengename
  editWPForm.challengetype = row.challengetype
  editWPForm.createtime = row.createtime
  editWPForm.description = row.description
  editWPForm.operator = row.operator
  editWPForm.typename = row.typename
  editWPForm.writeupid = row.writeupid
  editWPForm.writeupname = row.writeupname
  editWPForm.writeupurl = row.writeupurl
  editWPForm.status = row.status
  editWPForm.golden = row.golden
}

const downLoadFile = () => {
  if (editWPForm.writeupurl) {
    window.location.href = editWPForm.writeupurl
  } else {
    ElMessage({
      type: 'warning',
      message: '当前题目无附件',
    })
  }
}

const pickCancel = () => {
  isEditWpVision.value = false
}

const pickUnConform = async () => {
  editWPForm.status = 4
  let result = await reqUpdateWP(editWPForm)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '更新成功',
    })
    isEditWpVision.value = false
    getAuditList()
  } else {
    ElMessage({
      type: 'error',
      message: '更新失败',
    })
    isEditWpVision.value = false
    getAuditList()
  }
}

const pickConform = async () => {
  editWPForm.status = 1
  let result = await reqUpdateWP(editWPForm)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '更新成功',
    })
    isEditWpVision.value = false
    getAuditList()
  } else {
    ElMessage({
      type: 'error',
      message: '更新失败',
    })
    isEditWpVision.value = false
    getAuditList()
  }
}
</script>

<style scoped></style>
