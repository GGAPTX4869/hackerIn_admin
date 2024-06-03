<!--
  Description：
  @date：2024-03-18 21:35
  @author：JokerWang
-->

<template>
  <el-card style="border-radius: 10px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="display: flex; align-items: center">
        <div style="font-size: 18px">队伍列表</div>

        <el-input
          style="width: 14vw; margin-left: 2vw"
          size="default"
          placeholder="搜索队伍"
          v-model="selectTeam.teamname"
        >
          <template #append>
            <el-button :icon="Search" @click="selectTeamByName" />
          </template>
        </el-input>
      </div>
      <div style="vertical-align: center">
        <el-button type="primary" size="default" icon="Plus" @click="addTeam">
          新增队伍
        </el-button>
        <el-button
          type="danger"
          size="default"
          icon="Delete"
          @click="handlerMuchDel"
          :loading="isDeleting"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <el-table
      style="margin: 10px 0"
      border
      :data="teamListInfo"
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
      <el-table-column
        label="队伍状态"
        align="center"
        prop="challengetype"
        width="120px"
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

      <el-table-column label="操作" align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="default"
            icon="Edit"
            @click="editTeam(row)"
          ></el-button>
          <el-popconfirm
            title="确认删除吗?"
            icon="delete"
            confirm-button-type="danger"
            cancel-button-type="warning"
            @confirm="deleteTeam(row)"
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
      :total="total"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </el-card>
  <el-card style=" margin-top: 2vh;border-radius: 10px">
    <div style="font-size: 18px">队伍信息</div>
    <el-collapse v-model="string" accordion style="margin-top: 2vh">
      <el-collapse-item v-for="(item, index) in resTeamInfo" :key="index">
        <template #title>
          <div style="display: flex; justify-content: space-between">
            <div
              style="
                font-size: 18px;
                font-weight: bolder;
                color: rgb(29 29 29 / 59%);
              "
            >
              {{ item.teaminfo.teamname }}
            </div>
          </div>
        </template>

        <el-collapse v-model="string" accordion style="margin-top: 2vh">
          <el-collapse-item
            v-for="(itemuser, index) in item.userinfobyteam"
            :key="index"
          >
            <template #title>
              <div
                style="
                  font-size: 14px;
                  font-weight: bolder;
                  color: rgb(29 29 29 / 59%);
                "
              >
                {{ itemuser.user.username }}
              </div>
            </template>
            <el-descriptions title="个人信息" size="large" border>
              <template #extra>
                <el-dropdown>
                  <el-button type="primary">
                    操作
                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="deleteTeamUser(item, itemuser)">
                        删除用户
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
              <el-descriptions-item label="用户名">
                {{ itemuser.user.username }}
              </el-descriptions-item>
              <el-descriptions-item label="真实姓名">
                {{ itemuser.user.realname }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号">
                {{ itemuser.user.phonenumber }}
              </el-descriptions-item>
              <el-descriptions-item label="学号">
                {{ itemuser.user.stunumber }}
              </el-descriptions-item>
              <el-descriptions-item label="用户状态">
                <el-tag
                  :type="itemuser.user.userstatus == 1 ? 'success' : 'warning'"
                >
                  {{ itemuser.user.userstatus == 1 ? '启用' : '禁用' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ itemuser.user.createtime }}
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions
              title="活跃状态"
              size="large"
              border
              style="margin-top: 4vh"
            >
              <el-descriptions-item label="积分">
                {{ itemuser.userrank.rankpoints }}
              </el-descriptions-item>
              <el-descriptions-item label="解题数量">
                {{ itemuser.userrank.questionre }}
              </el-descriptions-item>
              <el-descriptions-item label="最后登录时间">
                {{ itemuser.user.lastlogin }}
              </el-descriptions-item>
              <el-descriptions-item label="解题数量">
                {{ itemuser.actionre.length }}
              </el-descriptions-item>
              <el-descriptions-item label="上传WP量">
                {{ itemuser.uploadwp.length }}
              </el-descriptions-item>
              <el-descriptions-item label="上传题目数量">
                {{ itemuser.uploadchallenge.length }}
              </el-descriptions-item>
            </el-descriptions>
            <div style="margin-top: 4vh">
              <div style="font-size: 16px; font-weight: bolder">
                上传WP(最近5个)
              </div>
              <el-table :data="itemuser.uploadwp">
                <el-table-column
                  label="序号"
                  type="index"
                  width="80px"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="writeupname"
                  label="WP名称"
                  width="100"
                  align="center"
                />
                <el-table-column
                  prop="description"
                  label="WP描述"
                  width="160"
                  align="center"
                />
                <el-table-column
                  prop="challengename"
                  label="题目名称"
                  width="120"
                  align="center"
                />
                <el-table-column
                  prop="typename"
                  label="题目类型"
                  width="120"
                  align="center"
                />
                <el-table-column
                  prop="createtime"
                  label="上传时间"
                  width="200"
                  align="center"
                />
                <el-table-column
                  prop="golden"
                  label="金币量"
                  width="80"
                  align="center"
                />
                <el-table-column
                  prop="downloading"
                  label="下载量"
                  width="120"
                  align="center"
                />
                <el-table-column label="操作" align="center">
                  <template #="{ row, $index }">
                    <el-button
                      type="primary"
                      size="default"
                      @click="downLoad(row)"
                    >
                      下载
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-top: 4vh">
              <div style="font-size: 16px; font-weight: bolder">
                上传题目(最近5个)
              </div>
              <el-table :data="itemuser.uploadchallenge">
                <el-table-column
                  label="序号"
                  type="index"
                  width="80px"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="challengename"
                  label="题目名称"
                  width="160"
                  align="center"
                />
                <el-table-column
                  prop="description"
                  label="题目描述"
                  width="340"
                  align="center"
                />
                <el-table-column
                  prop="challengetype"
                  label="题目类型"
                  width="160"
                  align="center"
                />
                <el-table-column
                  prop="createtime"
                  label="上传时间"
                  width="200"
                  align="center"
                />
                <el-table-column
                  prop="solved"
                  label="当前解题人数"
                  align="center"
                />
              </el-table>
            </div>
            <div style="margin-top: 4vh">
              <div style="font-size: 16px; font-weight: bolder">
                解题记录(最近5个)
              </div>
              <el-table :data="itemuser.actionre">
                <el-table-column
                  type="index"
                  label="序号"
                  width="280"
                  align="center"
                />
                <el-table-column
                  prop="actionname"
                  label="题目名称"
                  width="240"
                  align="center"
                />
                <el-table-column
                  prop="createtime"
                  label="完成时间"
                  align="center"
                />
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>
    </el-collapse>
  </el-card>
  <el-dialog v-model="isAddTeamVision" title="新增队伍">
    <el-form
      style=" margin-top: 4vh; margin-right: 6vw;margin-left: 6vw"
      label-width="80px"
    >
      <el-form-item label="队伍名称">
        <el-input
          placeholder="请输入队伍名称"
          style="width: 29vw"
          v-model="addTeamInfo.teamname"
        ></el-input>
      </el-form-item>
      <div style="display: flex">
        <el-form-item label="队长" style="margin-top: 2vh">
          <el-select
            v-model="addTeamInfo.teamleaderid"
            filterable
            placeholder="请选择队长"
            style="width: 12vw"
          >
            <el-option
              v-for="item in userInfoAllList"
              :key="item.userid"
              :label="item.username"
              :value="item.userid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" style="margin-top: 2vh">
          <el-select
            style="width: 12vw"
            placeholder="请选择题目状态"
            v-model="addTeamInfo.status"
          >
            <el-option
              v-for="item in isTeamStatus"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="队伍成员" style="margin-top: 2vh">
        <el-select
          v-model="selectUser"
          multiple
          default-first-option
          :reserve-keyword="false"
          placeholder="请选择队友"
          style="width: 29vw"
        >
          <el-option
            v-for="item in userInfoAllList"
            :key="item.userid"
            :label="item.username"
            :value="item.userid"
          />
        </el-select>
      </el-form-item>
      <div style="display: flex">
        <el-form-item label="队伍标签" style="margin-top: 2vh">
          <el-input
            placeholder="请输入队伍标签"
            v-model="addTeamInfo.teamtag"
            style="width: 12vw"
            maxlength="20"
            :show-word-limit="true"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" style="margin-top: 2vh">
          <el-input
            placeholder="请输入队伍描述"
            v-model="addTeamInfo.descrption"
            style="width: 12vw"
            maxlength="30"
            :show-word-limit="true"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="备注" style="margin-top: 2vh">
        <el-input
          placeholder="请输入备注"
          v-model="addTeamInfo.remark"
          style="width: 12vw"
          maxlength="50"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto; margin-top: 4vh">
        <el-button type="warning" size="large" @click="addCancel">
          取消
        </el-button>
        <el-button type="primary" size="large" @click="addConform">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-drawer v-model="isEditTeamVision" title="队伍信息">
    <el-form style="margin-left: 10px" label-width="100px">
      <el-form-item label="队伍名称">
        <el-input
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
      <el-form-item label="队伍成员" style="margin-top: 6vh">
        <el-select
          v-model="editUser"
          multiple
          default-first-option
          :reserve-keyword="false"
          placeholder="请选择队友"
          style="width: 16vw"
        >
          <el-option
            v-for="item in userInfoAllList"
            :key="item.userid"
            :label="item.username"
            :value="item.userid"
          />
        </el-select>
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
  reqAddTeam,
  reqAddTeamUser,
  reqDelTeam,
  reqDelTeamUser,
  reqGetTeamById,
  reqGetTeamByName,
  reqGetTeamInfoById,
  reqGetTeamListPa,
  reqGetTeamUserList,
  reqUpdateTeam,
  reqUpdateTeamUser,
} from '@/api/team/team.ts'
import { onMounted, ref } from 'vue'
import { reqRefreshDownLoad } from '@/api/wp'
import { reqGetAllUser } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reqUpdateChallenge } from '@/api/challenge'
import { Search } from '@element-plus/icons-vue'

onMounted(async () => {
  await getTeamList()
})

// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)

// ——————————————————————————————————————————————————————————————————————————————————
// 判断栏
let isAddTeamVision = ref<boolean>(false)
let isEditTeamVision = ref<boolean>(false)
let isDeleting = ref<boolean>(false)
// ——————————————————————————————————————————————————————————————————————————————————
// 信息栏
let teamListInfo = ref([])
let selectUser = ref([])
let editUser = ref([])
let selectTeam = ref({
  teamname: '',
  page: 1,
  limit: 10,
})
let isTeamStatus = ref([
  {
    value: 1,
    lable: '是',
  },
  {
    value: 2,
    lable: '否',
  },
])
let userInfoAllList = ref<{
  avatar: ''
  createtime: ''
  email: ''
  ipaddress: ''
  lastlogin: ''
  password: ''
  phonenumber: ''
  realname: ''
  remark: ''
  stunumber: ''
  updatetime: ''
  userid: ''
  username: ''
  userstatus: 1
  usertype: 1
}>([])
const mutipleSelection = ref([])
let resTeamInfo = ref([])
let deleteTeamUserInfo = ref({
  teamid: '',
  userid: '',
})
let addTeamUser = ref({
  userid: '',
  teamname: '',
})
let updateTeamUser = ref({
  teamid: '',
  userid: [],
})
let addTeamInfo = ref({
  teamname: '',
  teamleaderid: '',
  descrption: '',
  status: 1,
  remark: '',
  teamtag: '',
})
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

// ——————————————————————————————————————————————————————————————————————————————————
// 方法

const getTeamList = async () => {
  let result = await reqGetTeamListPa(pageCurrent.value, pageSize.value)
  teamListInfo.value = result.data
  total.value = result.total
}
const handleSelectionChange = async (val) => {
  mutipleSelection.value = val
  resTeamInfo.value = []
  for (let i in mutipleSelection.value) {
    let result = await reqGetTeamInfoById(mutipleSelection.value[i].teamid)
    resTeamInfo.value.push(result.data)
  }
}

const refreshSelect = async () => {
  resTeamInfo.value = []
  for (let i in mutipleSelection.value) {
    let result = await reqGetTeamInfoById(mutipleSelection.value[i].teamid)
    resTeamInfo.value.push(result.data)
  }
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

const getAllUserInfo = async () => {
  let result = await reqGetAllUser()
  userInfoAllList.value = result.data
}

const downLoad = async (row) => {
  await reqRefreshDownLoad(row.challengename)
  window.location.href = row.writeupurl
}

const addTeam = async () => {
  isAddTeamVision.value = true
  addTeamInfo.value.teamname = ''
  addTeamInfo.value.teamleaderid = ''
  addTeamInfo.value.status = 1
  addTeamInfo.value.remark = ''
  addTeamInfo.value.teamtag = ''
  await getAllUserInfo()
}

const addCancel = () => {
  isAddTeamVision.value = false
}
const addConform = async () => {
  let result = await reqAddTeam(addTeamInfo.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '队伍添加成功',
    })
    if (selectUser.value != []) {
      for (let i in selectUser.value) {
        addTeamUser.value.teamname = addTeamInfo.value.teamname
        addTeamUser.value.userid = selectUser.value[i]
        await reqAddTeamUser(addTeamUser.value)
      }
    }
  } else {
    ElMessage({
      type: 'error',
      message: '发生错误',
    })
  }
  isAddTeamVision.value = false
  await getTeamList()
}

const deleteTeam = async (row) => {
  let result = await reqDelTeam(row.teamid)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getTeamList()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

const deleteTeamUser = async (item, itemuser) => {
  deleteTeamUserInfo.value.teamid = item.teaminfo.teamid
  deleteTeamUserInfo.value.userid = itemuser.user.userid
  let result = await reqDelTeamUser(deleteTeamUserInfo.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '用户移除成功',
    })
    await refreshSelect()
  } else {
    ElMessage({
      type: 'error',
      message: '系统异常',
    })
  }
}

const editTeam = async (row) => {
  let result = await reqGetTeamById(row.teamid)
  editTeamInfo.value = result.data
  let resultUserId = await reqGetTeamUserList(row.teamid)
  editUser.value = resultUserId.data.userid
  isEditTeamVision.value = true
  await getAllUserInfo()
}

const editCancel = () => {
  isEditTeamVision.value = false
}
const editConform = async () => {
  let result = await reqUpdateTeam(editTeamInfo.value)
  updateTeamUser.value.teamid = editTeamInfo.value.teamid
  updateTeamUser.value.userid = editUser.value
  let resultTeamUser = await reqUpdateTeamUser(updateTeamUser.value)
  if (result.code == 200 && resultTeamUser.code == 200) {
    ElMessage({
      type: 'success',
      message: '修改成功',
    })
    isEditTeamVision.value = false
  } else {
    ElMessage({
      type: 'error',
      message: '系统异常',
    })
  }
}

const changeStatus = async (row) => {
  editTeamInfo.value.teamid = row.teamid
  if (row.status == 1) {
    editTeamInfo.value.status = 2
    console.log(editTeamInfo.value)
    ElMessageBox.confirm('确认禁用队伍吗?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        let result = await reqUpdateTeam(editTeamInfo.value)
        if (result.code == 200) {
          getTeamList()
          {
            ElMessage({
              type: 'success',
              message: '队伍已禁用',
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
    ElMessageBox.confirm('确认开启队伍吗?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        editTeamInfo.value.status = 1
        let result = await reqUpdateChallenge(editTeamInfo.value)
        if (result.code == 200) {
          getTeamList()
          {
            ElMessage({
              type: 'success',
              message: '队伍已开启',
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

const selectTeamByName = async () => {
  console.log(selectTeam.value)
  selectTeam.value.page = pageCurrent.value
  selectTeam.value.limit = pageSize.value
  let result = await reqGetTeamByName(selectTeam.value)
  teamListInfo.value = result.data
  total.value = result.total
}
</script>

<style scoped></style>
