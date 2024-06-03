<!--
  Description：
  @date：2024-03-18 21:48
  @author：JokerWang
-->

<template>
  <el-card style=" margin-top: 10px;border-radius: 10px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="font-size: 18px">容器列表(已开放)</div>
      <div style="vertical-align: center">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          @click="addContainer"
        >
          新增容器
        </el-button>
        <el-button
          type="danger"
          size="default"
          icon="Delete"
          @click="handlerMuchDel"
        >
          正在删除
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
      :data="containerInfoList"
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
        label="容器名称"
        width="120px"
        align="center"
        prop="containername"
        sortable
      ></el-table-column>
      <el-table-column
        label="镜像名称"
        width="120px"
        align="center"
        prop="imagename"
        sortable
      ></el-table-column>
      <el-table-column
        label="镜像地址"
        width="250px"
        align="center"
        prop="imageurl"
      ></el-table-column>
      <el-table-column
        label="容器端口"
        width="190px"
        align="center"
        prop="ipport"
        sortable
      ></el-table-column>
      <el-table-column
        label="创建时间"
        width="180px"
        align="center"
        prop="createtime"
        sortable
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row, $index }">
          <el-popconfirm
            title="确认删除吗?"
            icon="delete"
            confirm-button-type="danger"
            cancel-button-type="warning"
            @confirm="deleteContainer(row)"
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
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </el-card>
  <el-dialog v-model="isAddContanierVision" title="添加容器" draggable overflow>
    <el-form style="margin: 2vh 4vw" label-width="80px">
      <div style="display: flex">
        <el-form-item label="容器名称">
          <el-input
            style="width: 13vw"
            v-model="addContainerForm.containername"
            placeholder="请输入容器名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="映射端口">
          <el-input-number
            v-model="addContainerForm.port"
            style="width: 13vw"
            :min="1"
            :max="40000"
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
        <el-form-item label="镜像名称" style="margin-top: 20px">
          <el-select
            style="width: 13vw"
            placeholder="请选择开启的容器镜像"
            v-model="addContainerForm.imageid"
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
      <el-form-item label="镜像地址" style="margin-top: 20px">
        <el-input
          style="width: 13vw"
          v-model="addContainerForm.type"
          placeholder="请输入容器的类型"
          disabled
        ></el-input>
        <el-button
          type="danger"
          style="margin-left: 12px"
          @click="testContainer"
          loading-icon="Eleme"
          :loading="isLoadingTestContainer"
        >
          {{ isLoadingTestContainerMessage }}
        </el-button>
      </el-form-item>
      <el-form-item label="容器类型" style="margin-top: 40px">
        <el-input
          style="width: 13vw"
          v-model="addContainerForm.type"
          placeholder="请输入容器的类型"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="warning" size="default" @click="addCancel">
        取消
      </el-button>
      <el-button type="primary" size="default" @click="addConform">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  reqAddContainers,
  reqDelDocker,
  reqGetContainerList,
  reqGetImageAll,
  reqGetImageByType,
  reqRmTestContainer,
  reqTestContainer,
} from '@/api/docker/containers'
import { reqGetImageTypeAll } from '@/api/docker/images'
import { ElMessage } from 'element-plus'

// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)

// ——————————————————————————————————————————————————————————————————————————————————
// 表单收集设置
let containerInfoList = ref<any>([])
let selectImageType = ref([])
let imageListAll = ref<any>([])
let imageTypeAll = ref<any>([])
const mutipleSelection = ref([])
let testContainerReform = ref<any>([])
let addContainerForm = reactive<any>({
  containername: '',
  port: 80,
  imageid: '',
  type: 0,
})
let selectContainerInfoList = reactive<any>({
  page: '',
  limit: '',
  containername: '',
  imagename: '',
})

// ——————————————————————————————————————————————————————————————————————————————————
// 状态判断
let isAddContanierVision = ref<boolean>(false)
let isTestReq = ref<boolean>(false)
let isLoadingTestContainer = ref<boolean>(false)
let isLoadingTestContainerMessage = ref('测试容器')

// ——————————————————————————————————————————————————————————————————————————————————
// 相关方法

const handleSelectionChange = (val) => {
  mutipleSelection.value = val
}
const getImageAll = async () => {
  let result = await reqGetImageAll()
  imageListAll.value = result.data
}

const getImageTypeAll = async () => {
  let result = await reqGetImageTypeAll()
  imageTypeAll.value = result.data
  console.log(imageTypeAll)
}

onMounted(() => {
  console.log('11')
  getList()
})

const getList = async (pager = 1) => {
  selectContainerInfoList.page = pageCurrent.value
  selectContainerInfoList.limit = pageSize.value
  let result = await reqGetContainerList(selectContainerInfoList)
  if (result.code == 200) {
    containerInfoList.value = result.data
    total.value = result.total
  }
}
// 添加容器
const addContainer = async () => {
  await getImageAll()
  await getImageTypeAll()
  isAddContanierVision.value = true
}

const addCancel = async () => {
  if (isTestReq.value == true) {
    ElMessage({
      type: 'warning',
      message: '请先移除测试容器',
    })
  } else {
    isAddContanierVision.value = false
  }
}
const addConform = async () => {
  addContainerForm.type = 1
  let result = await reqAddContainers(addContainerForm)
  console.log(result)
}

const currentChange = () => {
  getList()
}
const sizeChange = () => {
  getList()
}

const selectImageByType = async () => {
  let result = await reqGetImageByType(selectImageType.value)
  imageListAll.value = result.data
}
const testContainer = async () => {
  if (addContainerForm.imageid == '') {
    ElMessage({
      type: 'warning',
      message: '请先选择镜像',
    })
  } else {
    if (isTestReq.value == false) {
      isLoadingTestContainer.value = true
      isLoadingTestContainerMessage.value = '正在测试'
      // 执行测试
      let result = await reqTestContainer(
        addContainerForm.port,
        addContainerForm.imageid,
      )
      if (result.code == 200) {
        isLoadingTestContainer.value = false
        testContainerReform.value = result.data
        isTestReq.value = true
        isLoadingTestContainerMessage.value = '移除容器'
        ElMessage({
          type: 'success',
          message: '测试容器已开启',
        })
      } else {
        ElMessage({
          type: 'error',
          message: '镜像不可用',
        })
      }
    } else {
      // 执行remove
      isLoadingTestContainer.value = true
      isLoadingTestContainerMessage.value = '正在移除'
      let result = await reqRmTestContainer(
        testContainerReform.value.containerid,
      )
      console.log(result)
      if (result.code == 200) {
        isLoadingTestContainer.value = false
        isLoadingTestContainerMessage.value = '测试容器'
        isTestReq.value = false
        ElMessage({
          type: 'success',
          message: '测试容器已移除',
        })
      }
    }
  }
}

const deleteContainer = async (row) => {
  let result = await reqDelDocker(row.containerid)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getList()
  } else {
    ElMessage({
      type: 'error',
      message: '系统错误',
    })
  }
}
</script>

<style scoped></style>
