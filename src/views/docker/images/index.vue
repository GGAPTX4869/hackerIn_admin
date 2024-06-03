<!--
  Description：
  @date：2024-03-18 21:48
  @author：JokerWang
-->

<template>
  <el-card style="border-radius: 10px">
    <Type />
  </el-card>
  <el-card style=" margin-top: 10px;border-radius: 10px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="font-size: 18px">镜像列表</div>
      <div style="vertical-align: center">
        <el-button type="primary" size="default" icon="Plus" @click="addImage">
          新增镜像
        </el-button>
        <el-button
          type="success"
          size="default"
          icon="Refresh"
          @click="refreshImage"
          :loading="isRefreshing"
        >
          {{ refreshingMessage }}
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

    <!-- 表格组件 -->
    <!--
     border 设置竖线
     label 设置标签
     width 设置宽度
    -->
    <el-table
      style="margin: 10px 0"
      border
      :data="dokImgInfoListArr"
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
        label="镜像名称"
        width="150px"
        align="center"
        prop="imagename"
        sortable
      ></el-table-column>
      <el-table-column
        label="版本标签"
        width="120px"
        align="center"
        prop="tag"
        sortable
      ></el-table-column>
      <el-table-column
        label="镜像地址"
        width="480px"
        align="center"
        prop="pullurl"
        sortable
      ></el-table-column>
      <el-table-column
        label="创建时间"
        width="200px"
        align="center"
        prop="createtime"
        sortable
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="default"
            icon="Edit"
            @click="editImage(row)"
          ></el-button>
          <el-popconfirm
            title="确认删除吗?"
            icon="delete"
            confirm-button-type="danger"
            cancel-button-type="warning"
            @confirm="deleteImage(row)"
          >
            <template #reference>
              <el-button type="danger" size="default" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
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
      @current-change="getDokImgInfoList"
      @size-change="sizeChange"
    />
  </el-card>
  <el-dialog v-model="addFormVisible" title="添加容器镜像" draggable overflow>
    <el-form class="addform">
      <el-form-item label="镜像名称" required>
        <el-input
          placeholder="输入镜像名称"
          v-model="addFormInfo.imagename"
        ></el-input>
      </el-form-item>
      <el-form-item label="镜像地址" required>
        <el-input
          placeholder="请输入镜像地址Repo"
          v-model="addFormInfo.pullurl"
          :disabled="isImgCanUse"
        ></el-input>
      </el-form-item>
      <el-form-item label="镜像类型" required>
        <el-select
          v-model="selectTypeInfo"
          multiple
          default-first-option
          :reserve-keyword="false"
          placeholder="请选择镜像类型"
          style="width: 240px"
        >
          <el-option
            v-for="item in imageStore.imageTypeAll"
            :key="item.imagetypeid"
            :label="item.typename"
            :value="item.imagetypeid"
          />
        </el-select>
      </el-form-item>
      <div class="el-button-p">
        <el-button
          type="primary"
          size="default"
          style="margin-top: 10px"
          @click="testRepoUse"
          loading-icon="Eleme"
          :loading="isSending"
        >
          {{ testIngMessage }}
        </el-button>
        <p class="test-result" style="color: #e8198b; transition: all 1s">
          {{ isUseMessage }}
        </p>
      </div>
      <div style="margin-top: 10px; font-size: 12px; color: #3f74bc">
        Tips:由于镜像测试和提交时，都需要对镜像进行装载，请耐心等候!
      </div>
    </el-form>
    <template #footer>
      <el-button type="warning" size="default" @click="cancel">取消</el-button>
      <el-button
        type="primary"
        size="default"
        @click="conform"
        :loading="isConformSending"
        loading-icon="Eleme"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
  <el-drawer v-model="editFormVisible" title="镜像信息">
    <el-form class="editform" label-width="80px">
      <el-form-item label="镜像名称">
        <el-input v-model="editFormInfo.imagename"></el-input>
      </el-form-item>
      <el-form-item label="镜像ID">
        <el-input disabled v-model="editFormInfo.imageid">
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
      <el-form-item label="版本标签">
        <el-input disabled v-model="editFormInfo.tag"></el-input>
      </el-form-item>
      <el-form-item label="镜像地址">
        <el-input disabled v-model="editFormInfo.pullurl">
          <template #append>
            <el-button
              size="default"
              @click="copyButtunPullUrl"
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
      <el-form-item label="镜像大小">
        <el-input disabled v-model="editFormInfo.size"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input disabled v-model="editFormInfo.operateuser"></el-input>
      </el-form-item>
      <el-form-item label="镜像类型">
        <el-select
          v-model="selectPushInfo"
          multiple
          default-first-option
          :reserve-keyword="false"
          placeholder="请选择镜像类型"
          style="width: 240px"
        >
          <el-option
            v-for="item in imageStore.imageTypeAll"
            :key="item.imagetypeid"
            :label="item.typename"
            :value="item.imagetypeid"
          />
        </el-select>
      </el-form-item>
      <div class="el-button-p">
        <el-button
          type="primary"
          size="default"
          style="margin-top: 10px"
          @click="EditTestRepoUse"
          loading-icon="Eleme"
          :loading="isSending"
        >
          {{ editTestMessage }}
        </el-button>
        <p class="test-result" style="color: #e8198b; transition: all 1s">
          {{ editIsUseMessage }}
        </p>
      </div>
      <div style="margin-top: 10px; font-size: 12px; color: #3f74bc">
        Tips:由于镜像测试时，需要对镜像进行装载，请耐心等候!
      </div>
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
import { ref, onMounted, reactive } from 'vue'
import {
  delImage,
  delTestDokImg,
  getImageInfo,
  refreshDokImgInfo,
  reqAddImageOfType,
  reqDokImgInfoList,
  reqGetImageOfTypeById,
  reqGetImageTypeAll,
  reqGetImageTypeList,
  reqPullImg,
  reqTestRepoUse,
  updatetDokImg,
} from '@/api/docker/images'
import type { DokImgList } from '@/api/docker/images/type.ts'
import {
  getDokImgListResData,
  updateDokImgInfo,
} from '@/api/docker/images/type.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import Type from './type/index.vue'
import useImageStore from '@/store/docker/images/image.ts'

let imageStore = useImageStore()

// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
// ——————————————————————————————————————————————————————————————————————————————————
// 判断状态栏设置
let isImgCanUse = ref<boolean>(false)
const isSending = ref(false)
const isRefreshing = ref(false)
const isDeleting = ref(false)
const isConformSending = ref(false)

// ——————————————————————————————————————————————————————————————————————————————————
// 文本信息栏设置
let testIngMessage = ref<string>('开启测试')
let isUseMessage = ref<string>('请点击测试按钮，测试镜像是否可用！')
let editTestMessage = ref<string>('开启测试')
let editIsUseMessage = ref<string>('点击测试按钮，测试镜像是否可用')
let refreshingMessage = ref<string>('更新镜像')
let deletingMessage = ref<string>('批量删除')

// ——————————————————————————————————————————————————————————————————————————————————
// 表单收集设置
let dokImgInfoListArr = ref<DokImgList>([])
let selectTypeInfo = ref<any>([])
let selectPushInfo = ref<any>([])
let addFormInfo = reactive<any>({
  type: [],
  imagename: '',
  pullurl: '',
  tag: '',
  status: 0,
})
let editFormInfo = reactive<any>({
  imagename: '',
  imageid: '',
  tag: '',
  pullurl: '',
  size: '',
  operateuser: '',
  status: 0,
})
let dokImgId = ref<string>('')
let updateTypeList = <any>{
  imageid: '',
  typeid: [],
}
const mutipleSelection = ref([])
// ——————————————————————————————————————————————————————————————————————————————————
// 对话框弹出设置
let addFormVisible = ref<boolean>(false)
let editFormVisible = ref<boolean>(false)
// ——————————————————————————————————————————————————————————————————————————————————
// 相关方法
// 获取容器列表
const initList = async () => {
  let resultImage: getDokImgListResData = await reqDokImgInfoList(
    pageCurrent.value,
    pageSize.value,
  )
  dokImgInfoListArr.value = resultImage.data
  total.value = resultImage.total
  await imageStore.GetImageTypeList(pageCurrent.value, pageSize.value)
}
const getDokImgInfoList = async (pager = 1) => {
  pageCurrent.value = pager
  let result: getDokImgListResData = await reqDokImgInfoList(
    pageCurrent.value,
    pageSize.value,
  )
  if (result.code == 200) {
    total.value = result.total
    dokImgInfoListArr.value = result.data
  }
}
// 监控列表事件
onMounted(() => {
  initList()
})
const sizeChange = () => {
  getDokImgInfoList()
}
// ——————————————————————————————————————————————————————————————————————————————————
// 新增镜像按钮——容器测试
const addImage = async () => {
  if (isImgCanUse.value == true) {
    await delTestDokImg(addFormInfo.pullurl)
  }

  isImgCanUse.value = false
  addFormVisible.value = true
  addFormInfo.imagename = ''
  addFormInfo.pullurl = ''
  addFormInfo.tag = ''
  addFormInfo.type = []
  addFormInfo.status = 0
  selectTypeInfo.value = []
  let result = await reqGetImageTypeAll()
  console.log(addFormInfo)
  await imageStore.GetImageTypeAll()
}
// 测试镜像
const testRepoUse = async () => {
  isSending.value = true
  if (addFormInfo.pullurl) {
    try {
      testIngMessage.value = '正在测试'
      isUseMessage.value = '测试当中请勿关闭！'
      await reqTestRepoUse(addFormInfo.pullurl)

      isUseMessage.value = '你的镜像可以使用！'
      testIngMessage.value = '开启测试'
      isSending.value = false
      ElMessage({
        message: '你的镜像可以使用！',
        type: 'success',
      })
      isImgCanUse.value = true
    } catch (error) {
      isSending.value = false
      testIngMessage.value = '开启测试'
      isUseMessage.value = '你的镜像不可以使用，请重新输入'
      ElMessage({
        message: '你的镜像不可以使用！',
        type: 'warning',
      })
    }
  } else {
    isSending.value = false
    ElMessage({
      message: '请输入镜像地址',
      type: 'warning',
    })
  }
}
// 取消按钮
const cancel = async () => {
  console.log(selectTypeInfo)
  if (isImgCanUse.value) {
    let result = await delTestDokImg(addFormInfo.pullurl)
    if (result.code == 200) {
      isImgCanUse.value = false
      addFormVisible.value = false
    } else {
      ElMessage({
        type: 'error',
        message: '镜像残余未清理干净',
      })
      isImgCanUse.value = false
      addFormVisible.value = false
    }
  } else {
    addFormVisible.value = false
  }
}
// 确认按钮
const conform = async () => {
  if (isImgCanUse.value) {
    isConformSending.value = true
    addFormInfo.type = selectTypeInfo.value
    console.log(addFormInfo)
    let result = await reqPullImg(addFormInfo)
    if (result.code == 200) {
      addFormVisible.value = false
      ElMessage({
        type: 'success',
        message: '镜像添加成功',
      })
      isConformSending.value = false
      await getDokImgInfoList()
    } else {
      addFormVisible.value = false
      ElMessage({
        type: 'success',
        message: '镜像添加失败!',
      })
      isConformSending.value = false
    }
  } else {
    ElMessage({
      type: 'warning',
      message: '请先测试镜像可用',
    })
    isConformSending.value = false
  }
}
// ——————————————————————————————————————————————————————————————————————————————————
// 刷新镜像信息
const refreshImage = async () => {
  refreshingMessage.value = '正在更新'
  isRefreshing.value = true
  let result = await refreshDokImgInfo()
  if (result.code == 200) {
    await getDokImgInfoList()
    refreshingMessage.value = '更新镜像'
    ElMessage({
      type: 'success',
      message: '刷新成功',
    })
    isRefreshing.value = false
  } else {
    ElMessage({
      type: 'warning',
      message: '刷新失败',
    })
    refreshingMessage.value = '更新镜像'
    isRefreshing.value = false
  }
}
// ——————————————————————————————————————————————————————————————————————————————————
// 编辑镜像信息
const editImage = async (row: dokImgInfoListArr) => {
  await imageStore.GetImageTypeAll()
  let result = await getImageInfo(row.tag)
  editFormVisible.value = true
  if (result.code == 200) {
    editFormInfo.imagename = row.imagename
    editFormInfo.imageid = result.data.imageid
    editFormInfo.tag = row.tag
    editFormInfo.pullurl = row.pullurl
    editFormInfo.size = result.data.size
    editFormInfo.operateuser = row.operateuser
    dokImgId.value = row.imageid
  } else {
    editFormVisible.value = false
    ElMessage({
      type: 'warning',
      message: '获取镜像信息失败',
    })
  }
  console.log(row.imageid)
  let resultTy = await reqGetImageOfTypeById(row.imageid)
  let data = resultTy.data
  selectPushInfo.value = []
  for (let i = 0; i < resultTy.data.length; i++) {
    selectPushInfo.value.push(data[i].typeid)
  }
}
const copyButtunImageInfo = () => {
  copy(editFormInfo.imageid)
}
const copyButtunPullUrl = () => {
  copy(editFormInfo.pullurl)
}
// 复制组件
const { toClipboard } = useClipboard()
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
const EditTestRepoUse = async () => {
  isSending.value = true
  if (editFormInfo.pullurl) {
    try {
      editTestMessage.value = '正在测试'
      editIsUseMessage.value = '测试当中请勿关闭！'
      await reqTestRepoUse(editFormInfo.pullurl)
      editIsUseMessage.value = '你的镜像可以使用！'
      editTestMessage.value = '开启测试'
      isSending.value = false
      ElMessage({
        message: '你的镜像可以使用！',
        type: 'success',
      })
      isImgCanUse.value = true
    } catch (error) {
      isSending.value = false
      editTestMessage.value = '开启测试'
      editIsUseMessage.value = '此镜像已经不可以使用'
      ElMessage({
        message: '你的镜像不可以使用！',
        type: 'warning',
      })
    }
  }
}
const editCancel = () => {
  editFormVisible.value = false
}
const editConform = async () => {
  let data = <updateDokImgInfo>{
    imageid: '',
    imagename: '',
    status: 0,
  }
  data.imageid = dokImgId.value
  data.imagename = editFormInfo.imagename
  data.status = 0

  updateTypeList.imageid = dokImgId.value
  updateTypeList.typeid = selectPushInfo.value
  let resultTy = await reqAddImageOfType(updateTypeList)
  let result = await updatetDokImg(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '更新成功',
    })
    await getDokImgInfoList(
      dokImgId.value ? pageCurrent.value : 1,
      pageSize.value,
    )
    editFormVisible.value = false
  } else {
    ElMessage({
      type: 'error',
      message: '更新失败',
    })
    editFormVisible.value = false
  }
}
// ——————————————————————————————————————————————————————————————————————————————————
// 删除镜像
const deleteImage = async (row: dokImgInfoListArr) => {
  let result = await delImage(row.imageid)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    await getDokImgInfoList(row.value ? pageCurrent.value : 1, pageSize.value)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// 批量删除
const handleSelectionChange = (val) => {
  mutipleSelection.value = val
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
        delId = mutipleSelection.value[i].imageid
        await delImage(delId)
      }
      getDokImgInfoList()
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
</script>

<style scoped>
.addform {
  width: 80%;
  margin: 20px auto;

  .el-form-item {
    display: flex;
    margin-top: 30px;
  }

  .el-button-p {
    display: flex;

    .test-result {
      margin-top: 18px;
      margin-left: 1%;
      font-size: 16px;
    }
  }
}

.editform {
  width: 80%;
  margin: 20px auto;

  .el-form-item {
    width: 90%;
    margin-top: 30px;
  }

  .el-button-p {
    display: flex;

    .test-result {
      margin-top: 18px;
      margin-left: 1%;
      font-size: 16px;
    }
  }
}
</style>
