<!--
  Description：
  @date：2024-04-05 17:30
  @author：JokerWang
-->

<template>
  <el-card style=" margin-top: 10px;border-radius: 10px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="display: flex; align-items: center">
        <div style="font-size: 18px">赛事列表</div>
        <div style="display: flex; margin-left: 2vw">
          <el-select
            style="width: 8vw"
            placeholder="赛事类型"
            @change="selectChallengeByType"
            v-model="selectCompTypeInfo.comptypeid"
          >
            <el-option
              v-for="item in compTypeAll"
              :key="item.competitiontypeid"
              :label="item.typename"
              :value="item.competitiontypeid"
            ></el-option>
          </el-select>
          <el-input
            style="width: 14vw"
            size="default"
            placeholder="Search"
            v-model="selectCompTypeInfo.competitonname"
          >
            <template #append>
              <el-button :icon="Search" @click="selectComp" />
            </template>
          </el-input>
        </div>
        <div style="margin-left: 1vw">
          <el-button type="success" plain size="default" @click="refreshList">
            重置
          </el-button>
        </div>
      </div>
      <div style="vertical-align: center">
        <el-button type="primary" size="default" icon="Plus" @click="addComp">
          新增赛事
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
      :data="compStore.compList"
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
        label="赛事名称"
        width="110px"
        align="center"
        prop="competitonname"
        sortable
      ></el-table-column>
      <el-table-column
        label="描述"
        width="130px"
        align="center"
        prop="description"
      ></el-table-column>
      <el-table-column
        label="赛事类型"
        width="100px"
        align="center"
        prop="comptypename"
      ></el-table-column>
      <el-table-column
        label="赛事链接"
        width="200px"
        align="center"
        prop="compurl"
      ></el-table-column>
      <el-table-column
        label="开始时间"
        width="160px"
        align="center"
        prop="begintime"
      ></el-table-column>
      <el-table-column
        label="截止时间"
        width="160px"
        align="center"
        prop="endtime"
      ></el-table-column>
      <el-table-column
        label="创建人"
        width="110px"
        align="center"
        prop="operator"
      ></el-table-column>

      <el-table-column label="操作" align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="default"
            icon="Edit"
            @click="editComp(row)"
          ></el-button>
          <el-popconfirm
            title="确认删除吗?"
            icon="delete"
            confirm-button-type="danger"
            cancel-button-type="warning"
            @confirm="deleteComp(row)"
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
      :background="true"
      layout="total, sizes, prev, pager, next, jumper,"
      :total="compStore.compTotal"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </el-card>
  <el-dialog v-model="isAddCompVision" title="添加赛事" draggable overflow>
    <el-form
      class="addform"
      style="margin-top: 30px; margin-right: 2vw; margin-left: 2vw"
      label-width="80px"
    >
      <div style="display: flex">
        <el-form-item label="赛事名称" required>
          <el-input
            style="width: 16vw"
            placeholder="请输入赛事名称"
            v-model="addCompForm.competitonname"
          ></el-input>
        </el-form-item>
        <el-form-item label="赛事类型" style="margin-left: 1.5vw">
          <el-select
            style="width: 16vw"
            placeholder="请选择赛事类型"
            v-model="addCompForm.comptypeid"
          >
            <el-option
              v-for="item in compTypeAll"
              :key="item.competitiontypeid"
              :label="item.typename"
              :value="item.competitiontypeid"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="起始时间" style="margin-top: 2vh">
        <el-date-picker
          v-model="compTime"
          type="datetimerange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
        />
      </el-form-item>
      <el-form-item label="赛事链接" style="margin-top: 4vh">
        <el-input
          style="width: 40vw"
          placeholder="请输入赛事链接"
          v-model="addCompForm.compurl"
        ></el-input>
      </el-form-item>
      <el-form-item label="赛事描述" style="margin-top: 4vh">
        <el-input
          placeholder="请输入赛事描述"
          v-model="addCompForm.description"
          style="width: 16vw"
          maxlength="30"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 5 }"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="warning" size="default" @click="cancelAddForm">
        取消
      </el-button>
      <el-button type="primary" size="default" @click="addConfirm">
        确定
      </el-button>
    </template>
  </el-dialog>
  <el-drawer v-model="isEditCompVision" title="修改赛事信息">
    <el-form style="margin-left: 10px" label-width="100px">
      <el-form-item label="赛事名称">
        <el-input
          style="width: 16vw"
          :placeholder="editCompForm.competitonname"
          v-model="editCompForm.competitonname"
        ></el-input>
      </el-form-item>
      <el-form-item label="赛事类型" style="margin-top: 4vh">
        <el-select
          style="width: 16vw"
          placeholder="请选择赛事类型"
          v-model="editCompForm.comptypeid"
        >
          <el-option
            v-for="item in compTypeAll"
            :key="item.competitiontypeid"
            :label="item.typename"
            :value="item.competitiontypeid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" style="margin-top: 4vh">
        <el-date-picker
          style="width: 16vw"
          v-model="editTime[0]"
          type="datetime"
        />
      </el-form-item>
      <el-form-item label="结束时间" style="margin-top: 4vh">
        <el-date-picker
          style="width: 16vw"
          v-model="editTime[1]"
          type="datetime"
        />
      </el-form-item>
      <el-form-item label="赛事链接" style="margin-top: 4vh">
        <el-input
          style="width: 16vw"
          :placeholder="editCompForm.compurl"
          v-model="editCompForm.compurl"
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
      <el-form-item label="赛事描述" style="margin-top: 4vh">
        <el-input
          placeholder="请输入赛事描述"
          v-model="editCompForm.description"
          style="width: 16vw"
          maxlength="30"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 5 }"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建人" style="margin-top: 4vh">
        <el-input
          style="width: 16vw"
          :placeholder="editCompForm.operator"
          v-model="editCompForm.operator"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" style="margin-top: 4vh">
        <el-input
          style="width: 16vw"
          :placeholder="editCompForm.createtime"
          v-model="editCompForm.createtime"
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
import {
  reqAddComp,
  reqDelComp,
  reqGetCompTypeAll,
  reqUpdateComp,
} from '@/api/race/comp'
import { onMounted, reactive, ref } from 'vue'
import useCompStore from '@/store/comp/comp.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import { Search } from '@element-plus/icons-vue'

let compStore = useCompStore()
onMounted(async () => {
  await getCompTypeAll()
  await getCompList()
  await getCompType()
})

// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
// ——————————————————————————————————————————————————————————————————————————————————
// 状态栏判断
let isAddCompVision = ref<boolean>(false)
let isEditCompVision = ref<boolean>(false)
let isDeleting = ref<boolean>(false)
let deletingMessage = ref<string>('批量删除')
// ——————————————————————————————————————————————————————————————————————————————————
// 信息栏收集
let selectCompTypeInfo = ref({
  page: pageCurrent.value,
  limit: pageSize.value,
  competitonname: '',
  comptypeid: '',
})

let compTypeAll = ref()
let addCompForm = reactive({
  competitonname: '',
  comptypeid: '',
  compurl: '',
  description: '',
  begintime: '',
  endtime: '',
  duration: 0,
})
const { toClipboard } = useClipboard()
const compTime = ref<[Date, Date]>([new Date(), new Date()])
const editTime = ref<[Date, Date]>([])
const mutipleSelection = ref([])
let editCompForm = reactive({
  competitonid: '',
  begintime: '',
  competitonname: '',
  comptypeid: '',
  comptypename: '',
  compurl: '',
  createtime: '',
  description: '',
  endtime: '',
  operator: '',
  duration: 0,
})
let getListByGroupInfo = ref({
  page: pageCurrent.value,
  limit: pageSize.value,
  competitonname: '',
  comptypeid: '',
})
const getCompTypeAll = async () => {
  let result = await reqGetCompTypeAll()
  if (result.code == 200) {
    compTypeAll.value = result.data
  }
}

const getCompType = async (pager = 1) => {
  pageCurrent.value = pager
  await compStore.GetCompTypeList(pageCurrent.value, pageSize.value)
}
const getCompList = async () => {
  await compStore.GetCompList(getListByGroupInfo.value)
}
const currentChange = () => {
  getCompList()
}
const sizeChange = () => {
  getCompList()
}
const addComp = () => {
  addCompForm.competitonname = ''
  addCompForm.comptypeid = ''
  addCompForm.compurl = ''
  addCompForm.description = ''
  isAddCompVision.value = true
  getCompTypeAll()
}
const getTime = (data: Date) => {
  return data.toLocaleString('zh-cn')
}
const addConfirm = async () => {
  addCompForm.begintime = getTime(compTime.value[0])
  addCompForm.endtime = getTime(compTime.value[1])
  addCompForm.duration =
    String((compTime.value[1] - compTime.value[0]) / 3600000) + 'h'
  let result = await reqAddComp(addCompForm)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '赛事添加成功',
    })
    isAddCompVision.value = false
    await getCompList()
  } else {
    ElMessage({
      type: 'error',
      message: '赛事添加失败',
    })
  }
}
const cancelAddForm = () => {
  isAddCompVision.value = false
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
        delId = mutipleSelection.value[i].competitonid
        await reqDelComp(delId)
      }
      await getCompList()
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
const deleteComp = async (row) => {
  let result = await reqDelComp(row.competitonid)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    await getCompList(pageCurrent.value)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

const editComp = (row) => {
  isEditCompVision.value = true
  editCompForm.begintime = row.begintime
  editCompForm.competitonname = row.competitonname
  editCompForm.comptypename = row.comptypename
  editCompForm.compurl = row.compurl
  editCompForm.comptypeid = row.comptypeid
  editCompForm.createtime = row.createtime
  editCompForm.description = row.description
  editCompForm.competitonid = row.competitonid
  editCompForm.endtime = row.endtime
  editCompForm.operator = row.operator
  editTime.value = [
    new Date(editCompForm.begintime),
    new Date(editCompForm.endtime),
  ]
  getCompTypeAll()
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
const copyButtunImageInfo = () => {
  copy(editCompForm.compurl)
}

const editCancel = () => {
  isEditCompVision.value = false
}
const editConform = async () => {
  console.log(editTime.value[0])
  editCompForm.begintime = getTime(editTime.value[0])
  editCompForm.endtime = getTime(editTime.value[1])
  editCompForm.duration =
    String((compTime.value[1] - compTime.value[0]) / 3600000) + 'h'
  let result = await reqUpdateComp(editCompForm)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '赛事修改成功',
    })
    isEditCompVision.value = false
    await getCompList()
  } else {
    ElMessage({
      type: 'error',
      message: '赛事修改失败',
    })
  }
}

const selectChallengeByType = async () => {
  await compStore.GetCompList(selectCompTypeInfo.value)
}

const selectComp = async () => {
  await compStore.GetCompList(selectCompTypeInfo.value)
}

const refreshList = () => {
  selectCompTypeInfo.value.competitonname = ''
  selectCompTypeInfo.value.comptypeid = ''
  selectCompTypeInfo.value.page = pageCurrent.value
  selectCompTypeInfo.value.limit = pageSize.value
  getCompList()
}
</script>

<style scoped></style>
