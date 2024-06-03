<!--
  Description：
  @date：2024-03-31 15:09
  @author：JokerWang
-->

<template>
  <el-card style=" margin-top: 2vh;border-radius: 10px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="font-size: 18px">WP列表</div>
      <div style="vertical-align: center">
        <el-button type="primary" size="default" icon="Plus" @click="addWP">
          新增WP
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
      :data="wpStore.WpList"
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
        type="index"
        label="序号"
        align="center"
        width="60px"
      ></el-table-column>
      <el-table-column
        label="WP名称"
        align="center"
        prop="writeupname"
        width="120px"
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
        width="120px"
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
        label="创建人"
        align="center"
        prop="operator"
        width="120px"
      ></el-table-column>

      <el-table-column
        label="公告状态"
        align="center"
        prop="status"
        width="120px"
        sortable
      >
        <template #="{ row, $index }">
          <el-check-tag
            :checked="row.status == 1"
            type="success"
            @change="changeStatus(row)"
          >
            {{ row.status == 1 ? '启用' : '禁用' }}
          </el-check-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createtime"
        width="180px"
        sortable
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="default"
            icon="Edit"
            @click="editWp(row)"
          ></el-button>
          <el-popconfirm
            title="确认删除吗?"
            icon="delete"
            confirm-button-type="danger"
            cancel-button-type="warning"
            @confirm="deleteWp(row)"
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
      :total="wpStore.WpTotal"
      @current-change="getNoticeInfoList"
      @size-change="sizeChange"
    />
  </el-card>
  <el-dialog v-model="isAddWpVision" title="新增WP" draggable overflow>
    <el-form style="margin: 1vh 4vw" label-width="80px">
      <div style="display: flex">
        <el-form-item label="WP名称">
          <el-input
            style="width: 13vw"
            placeholder="请输入WP的名称"
            v-model="addWPForm.writeupname"
          ></el-input>
        </el-form-item>
        <el-form-item label="WP链接" style="margin-left: 2vw">
          <el-input
            style="width: 13vw"
            placeholder="请输入WP链接(选填)"
            v-model="addWPForm.writeupurl"
          ></el-input>
        </el-form-item>
      </div>

      <div style="display: flex">
        <el-form-item label="题目类型" style="margin-top: 10px">
          <el-select
            style="width: 13vw"
            placeholder="请选择题目类型"
            v-model="selectChallengeTypeId"
            @change="selectChallengeByType"
          >
            <el-option
              v-for="item in challengeTypeListAll"
              :key="item.challengetypeid"
              :label="item.typename"
              :value="item.challengetypeid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="题目名称"
          style="margin-top: 10px; margin-left: 2vw"
          required
        >
          <el-select
            style="width: 13vw"
            placeholder="请选择题目"
            v-model="addWPForm.challengeid"
          >
            <el-option
              v-for="item in challengeListByType"
              :key="item.challengeid"
              :label="item.challengename"
              :value="item.challengeid"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="需要金币" style="margin-top: 10px">
        <el-input-number
          v-model="addWPForm.golden"
          style="width: 13vw"
          :min="1"
          :max="10"
        />
      </el-form-item>
      <el-form-item label="WP描述" style="margin-top: 10px">
        <el-input
          placeholder="请输入题目描述"
          v-model="addWPForm.description"
          style="width: 20vw"
          maxlength="50"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传文件" style="margin-top: 10px">
        <el-upload
          ref="uploadFile"
          class="upload-demo"
          style="width: 95%"
          drag
          action="http://localhost:8080/public/writeup/wp/add"
          :data="addWPForm"
          multiple
          :on-exceed="handleExceed"
          :auto-upload="false"
          :before-upload="beforeWPUpload"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽文件到此或者
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">文件大小不超过5MB!</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button type="warning" size="large" @click="addCancel">
          取消
        </el-button>
        <el-button type="primary" size="large" @click="addConform">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
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
      <div style="flex: auto; margin-right: 240px">
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
import useWpStore from '@/store/wp/writeUp.ts'
import { onMounted, reactive, ref } from 'vue'
import {
  reqDelChallenge,
  reqGetChallengeByType,
  reqGetChallengeTypeAll,
  reqUpdateChallenge,
} from '@/api/challenge'
import { ElMessage, ElMessageBox, genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import useUserStore from '@/store/modules/user.ts'
import { reqDelWPById, reqUpdateWP } from '@/api/wp'

let userStore = useUserStore()
let wpStore = useWpStore()

onMounted(async () => {
  await getWpList()
})

// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)

// ——————————————————————————————————————————————————————————————————————————————————
// 状态判断栏
let isAddWpVision = ref<boolean>(false)
let isEditWpVision = ref<boolean>(false)
let isDeleting = ref<boolean>(false)
let deletingMessage = ref<string>('批量删除')

// ——————————————————————————————————————————————————————————————————————————————————
// 信息栏
let challengeTypeListAll = ref([])
let selectChallengeTypeId = ref('')
let challengeListByType = ref([])
let uploadFile = ref<UploadInstance>()
let addWPForm = ref({
  writeupname: '',
  writeupurl: '',
  challengeid: '',
  description: '',
  golden: 1,
  userid: userStore.userId,
})
let mutipleSelection = ref([])
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

// 具体实现的方法

const getWpList = async (pager = 1) => {
  pageCurrent.value = pager
  await wpStore.GetWpList(pageCurrent.value, pageSize.value)
}

const getChallengeTypeList = async () => {
  let result = await reqGetChallengeTypeAll()
  console.log(result)
  challengeTypeListAll.value = result.data
}

const getNoticeInfoList = () => {
  getWpList()
}
const sizeChange = () => {
  getWpList()
}
const selectChallengeByType = async () => {
  let result = await reqGetChallengeByType(selectChallengeTypeId.value)
  challengeListByType.value = result.data
  console.log(result)
}

const handleSelectionChange = (val) => {
  mutipleSelection.value = val
}

const addWP = async () => {
  isAddWpVision.value = true
  await getChallengeTypeList()
  addWPForm.value.writeupname = ''
  addWPForm.value.writeupurl = ''
  addWPForm.value.golden = 1
  addWPForm.value.challengeid = ''
  addWPForm.value.description = ''
}

const beforeWPUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log(rawFile)
  // application/vnd.openxmlformats-officedocument.wordprocessingml.document
  // application/pdf

  if (
    rawFile.type !==
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
    rawFile.type !== 'application/pdf' &&
    rawFile.type !== ''
  ) {
    ElMessage.error('文件类型必须为MD、pdf、docx类型文件')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('文件大小不超过5MB!')
    return false
  }
  isAddWpVision.value = false
  return true
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadFile.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadFile.value!.handleStart(file)
}

const addConform = async () => {
  await uploadFile.value!.submit()
  await getWpList()
}

const addCancel = () => {
  isAddWpVision.value = false
}
const deleteWp = async (row) => {
  let result = await reqDelWPById(row.writeupid)
  console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    await getWpList()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
const handlerMuchDel = () => {
  isDeleting.value = true
  deletingMessage.value = '正在删除'
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
      getWpList()
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

const editWp = (row) => {
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
const editCancel = () => {
  isEditWpVision.value = false
}
const editConform = async () => {
  let result = await reqUpdateWP(editWPForm)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '更新成功',
    })
    isEditWpVision.value = false
    getWpList()
  } else {
    ElMessage({
      type: 'error',
      message: '更新失败',
    })
    isEditWpVision.value = false
    getWpList()
  }
}
const downLoadFile = () => {
  window.location.href = editWPForm.writeupurl
}

const changeStatus = (row) => {
  editWPForm.writeupid = row.writeupid
  if (row.status == 1) {
    editWPForm.status = 2
    ElMessageBox.confirm('确认禁用WP吗?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        let result = await reqUpdateWP(editWPForm)
        if (result.code == 200) {
          await getWpList(row.status ? pageCurrent.value : 1)
          {
            ElMessage({
              type: 'success',
              message: 'WP已禁用',
            })
          }
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消修改',
        })
      })
  } else {
    ElMessageBox.confirm('确认开启WP吗?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        editWPForm.status = 1
        let result = await reqUpdateWP(editWPForm)
        if (result.code == 200) {
          getWpList(row.status ? pageCurrent.value : 1)
          {
            ElMessage({
              type: 'success',
              message: 'WP已开启',
            })
          }
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消修改',
        })
      })
  }
}
</script>

<style scoped></style>
