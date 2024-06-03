<!--
  Description：
  @date：2024-04-09 3:40
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
      :data="teamListInfo"
      :default-sort="{ prop: 'createtime', order: 'ascending' }"
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
        label="队伍名称"
        align="center"
        prop="teamname"
        width="140px"
      ></el-table-column>
      <el-table-column
        label="队伍描述"
        align="center"
        prop="teamleader"
        width="240px"
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
        label="队伍标签"
        align="center"
        prop="teamleader"
        width="140px"
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
            {{ row.teamtag }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="队长"
        align="center"
        prop="teamleader"
        width="140px"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createtime"
        width="200px"
      ></el-table-column>
      <el-table-column label="备注" align="center" prop="remark" width="120px">
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
            {{ row.remark }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="审核状态" align="center" prop="status" sortable>
        <template #="{ row, $index }">
          <el-button
            :type="row.status == 3 ? 'warning' : 'danger'"
            @click="pickTeam(row)"
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
      :small="small"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper,"
      :total="total"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </div>
  <el-drawer v-model="isEditTeamVision" title="队伍信息">
    <el-form style="margin-left: 10px" label-width="100px">
      <el-form-item label="队伍名称">
        <el-input
          disabled
          style="width: 16vw"
          :placeholder="editTeamInfo.teamname"
          v-model="editTeamInfo.teamname"
        ></el-input>
      </el-form-item>
      <el-form-item label="队长" style="margin-top: 6vh">
        <el-input
          style="width: 16vw"
          disabled
          :placeholder="editTeamInfo.teamleader"
          v-model="editTeamInfo.teamleader"
        ></el-input>
      </el-form-item>
      <el-form-item label="队伍标签" style="margin-top: 6vh">
        <el-input
          placeholder="请输入队伍标签"
          v-model="editTeamInfo.teamtag"
          style="width: 16vw"
          maxlength="20"
          disabled
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" style="margin-top: 6vh">
        <el-input
          placeholder="请输入队伍描述"
          v-model="editTeamInfo.descrption"
          style="width: 16vw"
          maxlength="30"
          disabled
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" style="margin-top: 6vh">
        <el-input
          placeholder="请输入备注"
          v-model="editTeamInfo.remark"
          style="width: 16vw"
          maxlength="50"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
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
import { ref } from 'vue'
import {
  reqCheckUpTeam,
  reqDelTeam,
  reqGetAuditTeamList,
  reqGetTeamById,
  reqGetTeamInfoById,
  reqGetTeamListPa,
  reqGetTeamUserList,
} from '@/api/team/team.ts'
import { onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useChallengeStore from '@/store/challenge/challenge.ts'
import { reqUpdateWP } from '@/api/wp'

let challengeStore = useChallengeStore()

onMounted(async () => {
  await getTeamList()
})

// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)

// ——————————————————————————————————————————————————————————————————————————————————
// 状态栏
let isEditTeamVision = ref<boolean>(false)
// ——————————————————————————————————————————————————————————————————————————————————
// 信息栏
let teamListInfo = ref([])
const mutipleSelection = ref([])
let editTeamInfo = ref({
  createtime: '',
  descrption: '',
  description: '',
  operateuser: '',
  remark: '',
  status: 1,
  teamid: '',
  teamleader: '',
  teamleaderid: '',
  teamname: '',
  teamtag: '',
  updatetime: '',
})

const getTeamList = async () => {
  let result = await reqGetAuditTeamList(pageCurrent.value, pageSize.value)
  teamListInfo.value = result.data
  total.value = result.total

  let tempTotal = 0
  for (let item in teamListInfo.value) {
    if (teamListInfo.value[item].status == 3) {
      tempTotal += 1
    }
  }
  challengeStore.teamAuditTotal = tempTotal
}
const handleSelectionChange = async (val) => {
  mutipleSelection.value = val
}

const handlerMuchDel = async () => {
  ElMessageBox.confirm('确认删除这些队伍吗?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let delId = ''
      // 愚笨式的循环写法
      for (let i = 0; i < mutipleSelection.value.length; i++) {
        delId = mutipleSelection.value[i].teamid
        await reqDelTeam(delId)
      }
      getTeamList()
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

const currentChange = () => {
  getTeamList()
}
const sizeChange = () => {
  getTeamList()
}
const pickTeam = async (row) => {
  let result = await reqGetTeamById(row.teamid)
  editTeamInfo.value = result.data
  isEditTeamVision.value = true
}

const editCancel = () => {
  isEditTeamVision.value = false
}

const editConform = async () => {
  let result = await reqCheckUpTeam(editTeamInfo.value)

  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '更新成功',
    })
    isEditTeamVision.value = false
    await getTeamList()
  } else {
    ElMessage({
      type: 'error',
      message: '更新失败',
    })
    isEditTeamVision.value = false
    await getTeamList()
  }
}
</script>

<style scoped></style>
