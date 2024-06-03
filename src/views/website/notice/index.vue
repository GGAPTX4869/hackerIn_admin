<!--
  Description：
  @date：2024-04-03 21:37
  @author：JokerWang
-->

<template>
  <el-card style=" margin-top: 2vh;border-radius: 10px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="font-size: 18px">公告列表</div>
      <div style="vertical-align: center">
        <el-button type="primary" size="default" icon="Plus" @click="addNotice">
          新增公告
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
      :data="actionStore.noticeList"
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
        label="公告名称"
        align="center"
        prop="actionname"
        width="120px"
      ></el-table-column>
      <el-table-column
        label="公告描述"
        align="center"
        prop="flag"
        width="200px"
      >
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
        label="留言量"
        align="center"
        prop="comment"
        width="120px"
        sortable
      ></el-table-column>
      <el-table-column
        label="浏览量"
        align="center"
        prop="reader"
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
            :checked="row.actionstatus == 1"
            type="success"
            @change="changeStatus(row)"
          >
            {{ row.actionstatus == 1 ? '启用' : '禁用' }}
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
            @click="editNotice(row)"
          ></el-button>
          <el-popconfirm
            title="确认删除吗?"
            icon="delete"
            confirm-button-type="danger"
            cancel-button-type="warning"
            @confirm="deleteNotice(row)"
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
      :total="actionStore.noticeTotal"
      @current-change="getNoticeInfoList"
      @size-change="sizeChange"
    />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import useActionStore from '@/store/action/action.ts'
import { useRouter } from 'vue-router'
import { reqDelNoticeById, reqUpdateNotice } from '@/api/action'
import { ElMessage, ElMessageBox } from 'element-plus'

let actionStore = useActionStore()
let $router = useRouter()
onMounted(async () => {
  await getNoticeList()
})

// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)

// ——————————————————————————————————————————————————————————————————————————————————
// 判断设置栏
let isAddNoticeVision = ref<boolean>(false)
let deletingMessage = ref<string>('批量删除')
let isDeleting = ref<boolean>(false)

// ——————————————————————————————————————————————————————————————————————————————————
// 收集信息栏设置
let mutipleSelection = ref([])
let changeNoticeStatus = reactive({
  actionid: '',
  actionstatus: 0,
})

const getNoticeList = async (pager = 1) => {
  pageCurrent.value = pager
  await actionStore.GetNoticeList(pageCurrent.value, pageSize.value)
  console.log(actionStore.noticeList)
}

const addNotice = () => {
  $router.push('/website/notice/addnotice')
}

const editNotice = (row) => {
  console.log(row.actionid)
  $router.push({
    path: '/website/notice/editnotice',
    query: {
      actionid: row.actionid,
    },
  })
}

const deleteNotice = async (row) => {
  let result = await reqDelNoticeById(row.actionid)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    await getNoticeList()
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
        delId = mutipleSelection.value[i].actionid
        await reqDelNoticeById(delId)
      }
      await getNoticeList()
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

const getNoticeInfoList = () => {
  getNoticeList()
}

const sizeChange = () => {
  getNoticeList()
}

const changeStatus = (row) => {
  if (row.actionstatus == 1) {
    changeNoticeStatus.actionid = row.actionid
    changeNoticeStatus.actionstatus = 2
    ElMessageBox.confirm('确认禁用公告吗?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        let result = await reqUpdateNotice(changeNoticeStatus)
        if (result.code == 200) {
          await getNoticeList(row.status ? pageCurrent.value : 1)
          {
            ElMessage({
              type: 'success',
              message: '公告已禁用',
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
    ElMessageBox.confirm('确认开启公告吗?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        changeNoticeStatus.actionid = row.actionid
        changeNoticeStatus.actionstatus = 1
        let result = await reqUpdateNotice(changeNoticeStatus)
        if (result.code == 200) {
          await getNoticeList(row.status ? pageCurrent.value : 1)
          {
            ElMessage({
              type: 'success',
              message: '公告已开启',
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
