<!--
  Description：
  @date：2024-03-31 15:11
  @author：JokerWang
-->

<template>
  <el-card class="chalinfo">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="font-size: 18px">题目列表</div>
      <div style="vertical-align: center">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          @click="addChallenge"
        >
          新增题目
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
      :data="challengeStore.challengeList"
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
        label="题目名称"
        align="center"
        prop="challengename"
        width="140px"
        sortable
      ></el-table-column>
      <el-table-column
        label="镜像名称"
        align="center"
        prop="imagename"
        width="140px"
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
        label="题目状态"
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
      <el-table-column label="操作" align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="default"
            icon="Edit"
            @click="editChallenge(row)"
          ></el-button>
          <el-popconfirm
            title="确认删除吗?"
            icon="delete"
            confirm-button-type="danger"
            cancel-button-type="warning"
            @confirm="deleteChallenge(row)"
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
      :total="challengeStore.challengeTotal"
      @current-change="getDokImgInfoList"
      @size-change="sizeChange"
    />
  </el-card>
  <el-dialog v-model="isAddChallengeVision" title="新增题目" draggable overflow>
    <el-form style="margin: 3vh 5vw" label-width="80px">
      <div style="display: flex">
        <el-form-item label="题目名称" required>
          <el-input
            placeholder="请输入题目名称"
            style="width: 13vw"
            v-model="addChallengeFormInfo.challengename"
          ></el-input>
        </el-form-item>
        <el-form-item label="积分" style="margin-left: 2vw">
          <el-input-number
            v-model="addChallengeFormInfo.points"
            style="width: 13vw"
            :min="1"
            :max="10"
          />
        </el-form-item>
      </div>
      <div style="display: flex">
        <el-form-item label="镜像类型" style="margin-top: 20px">
          <el-select
            style="width: 13vw"
            placeholder="请选择镜像类型"
            v-model="selectImageType"
            @change="selectImageByType"
          >
            <el-option
              v-for="item in imageTypeAll"
              :key="item.imagetypeid"
              :label="item.typename"
              :value="item.imagetypeid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="镜像名称"
          style="margin-top: 20px; margin-left: 2vw"
        >
          <el-select
            style="width: 13vw"
            placeholder="请选择开启的容器镜像"
            v-model="addChallengeFormInfo.imageid"
          >
            <el-option
              v-for="item in imageListAll"
              :key="item.imageid"
              :label="item.imagename"
              :value="item.imageid"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div style="display: flex">
        <el-form-item label="赛事类型" style="margin-top: 20px" required>
          <el-select
            style="width: 13vw"
            placeholder="请选择赛事类型"
            v-model="addChallengeFormInfo.comptypeid"
          >
            <el-option
              v-for="item in challengeCompTypeAll"
              :key="item.challengetypeid"
              :label="item.typename"
              :value="item.challengetypeid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="题目类型"
          style="margin-top: 20px; margin-left: 2vw"
          required
        >
          <el-select
            style="width: 13vw"
            placeholder="请选择题目类型"
            v-model="addChallengeFormInfo.challengetypeid"
          >
            <el-option
              v-for="item in challengeTypeAll"
              :key="item.challengetypeid"
              :label="item.typename"
              :value="item.challengetypeid"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div style="display: flex">
        <el-form-item label="题目Flag" style="margin-top: 20px" required>
          <el-input
            placeholder="请输入题目Flag"
            style="width: 13vw"
            v-model="addChallengeFormInfo.flag"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="额外积分"
          style=" margin-top: 20px;margin-left: 2vw"
        >
          <el-input-number
            v-model="addChallengeFormInfo.fbreward"
            style="width: 13vw"
            :min="1"
            :max="10"
          />
        </el-form-item>
      </div>
      <div style="display: flex">
        <el-form-item label="金币数量" style="margin-top: 20px">
          <el-input-number
            v-model="addChallengeFormInfo.golden"
            style="width: 13vw"
            :min="1"
            :max="10"
          />
        </el-form-item>
        <el-form-item
          label="题目状态"
          style=" margin-top: 20px;margin-left: 2vw"
          required
        >
          <el-select
            style="width: 13vw"
            placeholder="请选择题目状态"
            v-model="addChallengeFormInfo.status"
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
      <div style="display: flex">
        <el-form-item label="提示" style="margin-top: 20px">
          <el-input
            placeholder="请输入题目提示"
            v-model="addChallengeFormInfo.tips"
            style="width: 13vw"
            maxlength="30"
            :show-word-limit="true"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="题目描述"
          style="margin-top: 20px; margin-left: 2vw"
          required
        >
          <el-input
            placeholder="请输入题目描述"
            v-model="addChallengeFormInfo.description"
            style="width: 13vw"
            maxlength="50"
            :show-word-limit="true"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="上传附件" style="margin-top: 2vh">
        <el-upload
          ref="upload"
          class="upload-demo"
          :data="{ challengename: addChallengeFormInfo.challengename }"
          action="http://localhost:8080/public/challenge/challenge/attachment/update"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false"
          :before-upload="beforeWPUpload"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip text-red">
              限制上传一个文件，且文件大小不大于5MB
            </div>
          </template>
        </el-upload>
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
              size="default"
              @click="copyButtunImageInfo"
              style="
                align-content: center;
                font-weight: bold;
                color: #4eabf5;
                background: #e6f3fc;
              "
            >
              复制
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
              下载
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
import { reactive, ref } from 'vue'
import { reqGetImageTypeAll } from '@/api/docker/images'
import { reqGetImageByType } from '@/api/docker/containers'
import {
  reqAddChallenge,
  reqDelChallenge,
  reqGetChallengeById,
  reqGetChallengeCompTypeAll,
  reqGetChallengeTypeAll,
  reqUpdateChallenge,
} from '@/api/challenge'
import { ElMessage, ElMessageBox } from 'element-plus'
import useChallengeStore from '@/store/challenge/challenge.ts'
import useClipboard from 'vue-clipboard3'

const { toClipboard } = useClipboard()

import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const beforeWPUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log(rawFile)
  // application/vnd.openxmlformats-officedocument.wordprocessingml.document
  // application/pdf
  isUploadingAttachment.value = true
  if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('文件大小不超过5MB!')
    return false
  }
  return true
}

const submitUpload = () => {
  upload.value!.submit()
}

const copy = async (msg) => {
  try {
    // 复制
    await toClipboard(msg)
    ElMessage({
      type: 'success',
      message: '复制成功',
    })
  } catch (e) {
    // 复制失败
    ElMessage({
      type: 'error',
      message: '复制失败',
    })
  }
}

let challengeStore = useChallengeStore()

// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)

// ——————————————————————————————————————————————————————————————————————————————————
// 判断设置栏
let isAddChallengeVision = ref<boolean>(false)
let isEditChallengeVision = ref<boolean>(false)
let isUploadingAttachment = ref<boolean>(false)
let isDeleting = ref<boolean>(false)
let deletingMessage = ref<string>('批量删除')
let isChallengeStatus = ref([
  {
    value: 1,
    lable: '是',
  },
  {
    value: 2,
    lable: '否',
  },
])

// ——————————————————————————————————————————————————————————————————————————————————
// 信息收集
let addChallengeFormInfo = reactive<any>({
  challengename: '',
  fbreward: 0,
  imageid: '',
  challengetypeid: '',
  flag: '',
  comptypeid: '',
  tips: '',
  golden: 1,
  points: 1,
  status: '',
  description: '',
})
let changeChallengeStatus = reactive<any>({
  challengeid: '',
  status: '',
})
let editChallengeFormInfo = ref<any>({})

let selectImageType = ref()
let imageTypeAll = ref<any>([])
let imageListAll = ref<any>([])
let challengeTypeAll = ref<any>([])
let challengeCompTypeAll = ref<any>([])
const mutipleSelection = ref([])
let uploadFileChallengename = ref()

// 具体实现方法
const getImageTypeAll = async () => {
  let result = await reqGetImageTypeAll()
  imageTypeAll.value = result.data
  console.log(imageTypeAll)
}
const getChallengeTypeAll = async () => {
  let result = await reqGetChallengeTypeAll()
  challengeTypeAll.value = result.data
}
const getChallengeCompTypeAll = async () => {
  let result = await reqGetChallengeCompTypeAll()
  challengeCompTypeAll.value = result.data
}
const getChallengeList = () => {
  challengeStore.GetChallengeList(pageCurrent.value, pageSize.value)
}
// 按钮
const refreshAddForm = () => {
  addChallengeFormInfo.challengename = ''
  addChallengeFormInfo.fbreward = 0
  addChallengeFormInfo.imageid = ''
  addChallengeFormInfo.challengetypeid = ''
  addChallengeFormInfo.flag = ''
  addChallengeFormInfo.comptype = ''
  addChallengeFormInfo.tips = ''
  addChallengeFormInfo.golden = 1
  addChallengeFormInfo.points = 1
  addChallengeFormInfo.status = ''
  addChallengeFormInfo.description = ''
}
const addChallenge = () => {
  refreshAddForm()
  isAddChallengeVision.value = true
  getImageTypeAll()
  getChallengeTypeAll()
  getChallengeCompTypeAll()
}
const selectImageByType = async () => {
  let result = await reqGetImageByType(selectImageType.value)
  imageListAll.value = result.data
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
const addTypeCancel = () => {
  isAddChallengeVision.value = false
}
const addTypeConform = async () => {
  uploadFileChallengename.value = addChallengeFormInfo.challengename
  if (addChallengeFormInfo.challengename == '') {
    ElMessage({
      type: 'warning',
      message: '请输入完整相关信息',
    })
  }
  let result = await reqAddChallenge(addChallengeFormInfo)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '题目添加成功',
    })
    await upload.value!.submit()
    isAddChallengeVision.value = false
    await getChallengeList()
  } else {
    ElMessage({
      type: 'error',
      message: '题目添加失败，请检查错误',
    })
  }
}
const getDokImgInfoList = () => {
  getChallengeList()
}
const sizeChange = () => {
  getChallengeList()
}
const changeStatus = (row) => {
  changeChallengeStatus.challengeid = row.challengeid
  if (row.status == 1) {
    changeChallengeStatus.status = 2
    ElMessageBox.confirm('确认禁用题目吗?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        let result = await reqUpdateChallenge(changeChallengeStatus)
        if (result.code == 200) {
          getChallengeList()
          {
            ElMessage({
              type: 'success',
              message: '题目已禁用',
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
    ElMessageBox.confirm('确认开启题目吗?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        changeChallengeStatus.challengeid = row.challengeid
        changeChallengeStatus.status = 1
        let result = await reqUpdateChallenge(changeChallengeStatus)
        if (result.code == 200) {
          getChallengeList()
          {
            ElMessage({
              type: 'success',
              message: '题目已开启',
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
const deleteChallenge = async (row) => {
  let result = await reqDelChallenge(row.challengeid)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getChallengeList()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

const handleSelectionChange = (val) => {
  mutipleSelection.value = val
}
const handlerMuchDel = async () => {
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
        delId = mutipleSelection.value[i].challengeid
        await reqDelChallenge(delId)
      }
      getChallengeList()
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

const getChallengeById = async (id: string) => {
  let result = await reqGetChallengeById(id)
  editChallengeFormInfo.value = result.data
}

const editChallenge = (row) => {
  isEditChallengeVision.value = true
  getChallengeCompTypeAll()
  getChallengeTypeAll()
  getChallengeById(row.challengeid)
}

const editCancel = () => {
  isEditChallengeVision.value = false
}

const editConform = async () => {
  let result = await reqUpdateChallenge(editChallengeFormInfo.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '更新成功',
    })
    isEditChallengeVision.value = false
    getChallengeList()
  } else {
    ElMessage({
      type: 'error',
      message: '更新失败',
    })
    isEditChallengeVision.value = false
    getChallengeList()
  }
}

const copyButtunImageInfo = () => {
  copy(editChallengeFormInfo.value.imageurl)
}
</script>

<style scoped lang="scss">
.chalinfo {
  margin-top: 2vh;
  border-radius: 10px;
}
</style>
