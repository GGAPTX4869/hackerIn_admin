<!--
  Description：
  @date：2024-04-08 2:28
  @author：JokerWang
-->

<template>
  <div>
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
    <el-table
      style="margin: 10px 0"
      border
      :data="challengeAuditList"
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
        label="题目名称"
        align="center"
        prop="challengename"
        width="160px"
        sortable
      ></el-table-column>
      <el-table-column
        label="镜像名称"
        align="center"
        prop="imagename"
        width="160px"
        sortable
      ></el-table-column>
      <el-table-column
        label="题目Flag"
        align="center"
        prop="flag"
        width="240px"
      ></el-table-column>
      <el-table-column
        label="题目类型"
        align="center"
        prop="challengetype"
        width="140px"
        sortable
      ></el-table-column>
      <el-table-column
        label="赛题来源"
        align="center"
        prop="comptype"
        width="140px"
        sortable
      ></el-table-column>
      <el-table-column
        label="出题人"
        align="center"
        prop="operator"
        width="140px"
        sortable
      ></el-table-column>
      <el-table-column label="审核状态" align="center" prop="status" sortable>
        <template #="{ row, $index }">
          <el-button
            :type="row.status == 3 ? 'warning' : 'danger'"
            @click="pickChallenge(row)"
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
  <el-drawer v-model="isEditChallengeVision" title="题目信息">
    <el-form style="margin-left: 10px" label-width="100px">
      <el-form-item label="题目名称">
        <el-input
          style="width: 240px"
          :placeholder="editChallengeFormInfo.challengename"
          v-model="editChallengeFormInfo.challengename"
        ></el-input>
      </el-form-item>
      <el-form-item label="镜像名称" style="margin-top: 20px">
        <el-input
          style="width: 240px"
          :placeholder="editChallengeFormInfo.imagename"
          v-model="editChallengeFormInfo.imagename"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="镜像链接" style="margin-top: 20px">
        <el-input
          style="width: 240px"
          :placeholder="editChallengeFormInfo.imageurl"
          v-model="editChallengeFormInfo.imageurl"
          disabled
        >
          <template #append>
            <el-button
              v-show="!isImgCanUse && !isImgDanger"
              size="default"
              @click="testImage"
              style="
                align-content: center;
                font-weight: bold;
                color: #4eabf5;
                background: #e6f3fc;
              "
              loading-icon="Eleme"
              :loading="isSending"
            >
              {{ testIngMessage }}
            </el-button>
            <el-button
              v-show="isImgCanUse"
              size="default"
              @click="testImage"
              style="
                align-content: center;
                font-weight: bold;
                color: #66c13a;
                background: #daebd2;
              "
              loading-icon="Eleme"
              :loading="isSending"
            >
              {{ testIngMessage }}
            </el-button>
            <el-button
              v-show="!isImgCanUse && isImgDanger"
              size="default"
              @click="testImage"
              style="
                align-content: center;
                font-weight: bold;
                color: #f36b6b;
                background: #fbe0e0;
              "
              loading-icon="Eleme"
              :loading="isSending"
            >
              {{ testIngMessage }}
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="题目附件" style="margin-top: 20px">
        <el-input
          style="width: 240px"
          :placeholder="editChallengeFormInfo.attachmenturl"
          v-model="editChallengeFormInfo.attachmenturl"
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
              下载附件
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="题目Flag" style="margin-top: 20px">
        <el-input
          style="width: 240px"
          :placeholder="editChallengeFormInfo.flag"
          v-model="editChallengeFormInfo.flag"
        ></el-input>
      </el-form-item>
      <el-form-item label="题目类型" style="margin-top: 20px">
        <el-select
          style="width: 240px"
          placeholder="请选择赛事类型"
          v-model="editChallengeFormInfo.challengetypeid"
        >
          <el-option
            v-for="item in challengeTypeAll"
            :key="item.challengetypeid"
            :label="item.typename"
            :value="item.challengetypeid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="赛事类型" style="margin-top: 20px">
        <el-select
          style="width: 240px"
          placeholder="请选择赛事类型"
          v-model="editChallengeFormInfo.comptypeid"
        >
          <el-option
            v-for="item in challengeCompTypeAll"
            :key="item.challengetypeid"
            :label="item.typename"
            :value="item.challengetypeid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目积分" style="margin-top: 20px">
        <el-input-number
          v-model="editChallengeFormInfo.points"
          style="width: 240px"
          :min="1"
          :max="10"
        />
      </el-form-item>
      <el-form-item label="金币奖励" style="margin-top: 20px">
        <el-input-number
          v-model="editChallengeFormInfo.golden"
          style="width: 240px"
          :min="1"
          :max="10"
        />
      </el-form-item>
      <el-form-item label="额外积分" style="margin-top: 20px">
        <el-input-number
          v-model="editChallengeFormInfo.fbreward"
          style="width: 240px"
          :min="1"
          :max="10"
        />
      </el-form-item>
      <el-form-item label="解题人数" style="margin-top: 20px">
        <el-input
          style="width: 240px"
          :placeholder="editChallengeFormInfo.solved"
          v-model="editChallengeFormInfo.solved"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="一血解题人" style="margin-top: 20px">
        <el-input
          style="width: 240px"
          :placeholder="editChallengeFormInfo.fbname"
          v-model="editChallengeFormInfo.fbname"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="题目提示" style="margin-top: 20px">
        <el-input
          placeholder="请输入题目提示"
          v-model="editChallengeFormInfo.tips"
          style="width: 240px"
          maxlength="30"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="题目描述" style="margin-top: 20px">
        <el-input
          placeholder="请输入题目描述"
          v-model="editChallengeFormInfo.description"
          style="width: 240px"
          maxlength="50"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" style="margin-top: 20px">
        <el-input
          style="width: 240px"
          :placeholder="editChallengeFormInfo.createtime"
          v-model="editChallengeFormInfo.createtime"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" style="margin-top: 20px">
        <el-input
          placeholder="请输入题目描述"
          v-model="editChallengeFormInfo.remark"
          style="width: 240px"
          disabled
          maxlength="100"
          :show-word-limit="true"
          :autosize="{ minRows: 3, maxRows: 8 }"
          type="textarea"
        ></el-input>
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
import { onMounted, ref } from 'vue'
import {
  reqCheckCancel,
  reqCheckPass,
  reqDelChallenge,
  reqGetAuditChallengeList,
  reqGetChallengeById,
  reqGetChallengeCompTypeAll,
  reqGetChallengeTypeAll,
  reqUpdateChallenge,
} from '@/api/challenge'
import useChallengeStore from '@/store/challenge/challenge.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reqPullImg, reqTestRepoUse } from '@/api/docker/images'

let challengeStore = useChallengeStore()
onMounted(async () => {
  await getAudit()
})
// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)

// ——————————————————————————————————————————————————————————————————————————————————
// 判断状态栏
let isEditChallengeVision = ref<boolean>(false)
let isSending = ref(false)
let isImgCanUse = ref(false)
let isImgDanger = ref(false)
let testIngMessage = ref<string>('测试镜像')
// ——————————————————————————————————————————————————————————————————————————————————
// 信息栏
let challengeTypeAll = ref<any>([])
let challengeAuditList = ref([])
let editChallengeFormInfo = ref<any>({})
let challengeCompTypeAll = ref<any>([])
const mutipleSelection = ref([])
const handleSelectionChange = (val) => {
  mutipleSelection.value = val
}
const getAudit = async () => {
  let result = await reqGetAuditChallengeList(1, 10)
  challengeAuditList.value = result.data
  let tempTotal = 0
  for (let item in challengeAuditList.value) {
    if (challengeAuditList.value[item].status == 3) {
      tempTotal += 1
    }
  }
  total.value = result.total
  challengeStore.challengeAuditTotal = tempTotal
}
const currentChange = async () => {
  await getAudit()
}
const sizeChange = async () => {
  await getAudit()
}
const getChallengeCompTypeAll = async () => {
  let result = await reqGetChallengeCompTypeAll()
  challengeCompTypeAll.value = result.data
}
const getChallengeTypeAll = async () => {
  let result = await reqGetChallengeTypeAll()
  challengeTypeAll.value = result.data
}
const getChallengeById = async (id: string) => {
  let result = await reqGetChallengeById(id)
  console.log(result)
  editChallengeFormInfo.value = result.data
}
const pickChallenge = async (row) => {
  isSending.value = false
  isImgCanUse.value = false
  isImgDanger.value = false
  testIngMessage.value = '测试镜像'
  isEditChallengeVision.value = true
  await getChallengeCompTypeAll()
  await getChallengeTypeAll()
  await getChallengeById(row.challengeid)
}

const downLoadFile = () => {
  if (editChallengeFormInfo.value.attachmenturl) {
    window.location.href = editChallengeFormInfo.value.attachmenturl
  } else {
    ElMessage({
      type: 'warning',
      message: '当前题目无附件',
    })
  }
}

const handlerMuchDel = () => {
  ElMessageBox.confirm('确认删除这些信息吗?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let delId = ''
      // 愚笨式的循环写法
      for (let i = 0; i < mutipleSelection.value.length; i++) {
        delId = mutipleSelection.value[i].challengeid
        await reqDelChallenge(delId)
      }
      await getAudit()
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

const testImage = async () => {
  isSending.value = true
  console.log(editChallengeFormInfo.value.imageurl)
  if (editChallengeFormInfo.value.imageurl) {
    testIngMessage.value = '正在测试'
    let result = await reqTestRepoUse(editChallengeFormInfo.value.imageurl)
    if (result.code == 200) {
      testIngMessage.value = '镜像可用'
      isSending.value = false
      isImgCanUse.value = true
      ElMessage({
        message: '你的镜像可以使用！',
        type: 'success',
      })
    } else {
      isImgDanger.value = true
      isSending.value = false
      testIngMessage.value = '不可使用'
      ElMessage({
        message: '你的镜像不可以使用！',
        type: 'warning',
      })
    }
  } else {
    isSending.value = false
    ElMessage({
      message: '此题无镜像,无需测试',
      type: 'warning',
    })
  }
}
const pickCancel = () => {
  isEditChallengeVision.value = false
}
const pickUnConform = async () => {
  editChallengeFormInfo.value.status = 4
  let result = await reqCheckCancel(editChallengeFormInfo.value)
  if (result.code == 200) {
    ElMessage({
      type: 'warning',
      message: '题目不通过',
    })
    isEditChallengeVision.value = false
    getAudit()
  } else {
    ElMessage({
      type: 'error',
      message: '请求失败',
    })
    isEditChallengeVision.value = false
    getAudit()
  }
}
const pickConform = async () => {
  if (isImgCanUse.value || editChallengeFormInfo.value.imageurl == '') {
    console.log(editChallengeFormInfo.value)
    let result = await reqCheckPass(editChallengeFormInfo.value)
    if (result.code == 200) {
      isEditChallengeVision.value = false
      ElMessage({
        type: 'success',
        message: '镜像添加成功',
      })
      await getAudit()
    } else {
      isEditChallengeVision.value = false
      ElMessage({
        type: 'success',
        message: '镜像添加失败!',
      })
    }
  } else {
    ElMessage({
      type: 'warning',
      message: '请先测试镜像可用',
    })
  }
}
</script>

<style scoped></style>
