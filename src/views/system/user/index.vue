<!--
  Description：
  @date：2024-03-22 10:57
  @author：JokerWang
-->

<template>
  <el-card style="border-radius: 10px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="font-size: 18px">搜索框</div>
    </div>
    <el-form style="margin-top: 20px">
      <div style="display: flex">
        <el-form-item label="用户名" style="margin-left: 50px">
          <el-input
            style="width: 200px"
            placeholder="请输入用户名"
            v-model="selectUserInfo.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" style="margin-left: 50px">
          <el-input
            style="width: 200px"
            placeholder="请输入真实姓名"
            v-model="selectUserInfo.realname"
          ></el-input>
        </el-form-item>
        <el-form-item label="学号" style="margin-left: 50px">
          <el-input
            style="width: 200px"
            placeholder="请输入学号"
            v-model="selectUserInfo.stunumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" style="margin-left: 50px">
          <el-input
            style="width: 200px"
            placeholder="请输入邮箱"
            v-model="selectUserInfo.email"
          ></el-input>
        </el-form-item>
      </div>
      <div style="display: flex">
        <el-form-item label="手机号" style="margin-left: 50px">
          <el-input
            style="width: 200px"
            placeholder="请输入手机号"
            v-model="selectUserInfo.phonenumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户状态" style="margin-left: 50px">
          <el-select
            v-model="selectUserStatus"
            placeholder="请选择用户状态"
            style="width: 200px"
          >
            <el-option
              v-for="item in userStatusSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-button
          style="margin-left: 400px; color: #042a47"
          icon="Refresh"
          @click="refreshSelectForm"
        >
          重置
        </el-button>
        <el-button
          type="primary"
          style="margin-left: 20px; color: #042a47"
          icon="Aim"
          color="#DD9BF1FF"
          @click="findUser"
        >
          查询
        </el-button>
      </div>
    </el-form>
  </el-card>
  <el-card style=" margin-top: 10px;border-radius: 10px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="font-size: 18px">用户列表</div>
      <div style="vertical-align: center">
        <el-button type="primary" size="default" icon="Plus" @click="addUser">
          新增用户
        </el-button>
        <el-button
          type="success"
          size="default"
          icon="Refresh"
          @click="refreshSelectForm"
        >
          刷新列表
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
      :data="userInfoArr"
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
        label="用户名"
        width="110px"
        align="center"
        prop="username"
        sortable
      ></el-table-column>
      <el-table-column
        label="真实姓名"
        width="110px"
        align="center"
        prop="realname"
        sortable
      ></el-table-column>
      <el-table-column
        label="学号"
        width="130px"
        align="center"
        prop="stunumber"
        sortable
      ></el-table-column>
      <el-table-column
        label="手机号"
        width="130px"
        align="center"
        prop="phonenumber"
      ></el-table-column>
      <el-table-column
        label="IP地址"
        width="150px"
        align="center"
        prop="ipaddress"
      ></el-table-column>

      <el-table-column
        label="最后登录时间"
        width="170px"
        align="center"
        prop="lastlogin"
        sortable
      ></el-table-column>
      <el-table-column label="用户状态" width="90px" align="center">
        <template #="{ row, $index }">
          <el-check-tag
            :checked="row.userstatus == 1"
            type="success"
            @change="changeStatus(row)"
          >
            {{ row.userstatus == 1 ? '启用' : '禁用' }}
          </el-check-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row, $index }">
          <el-button
            type="success"
            size="default"
            icon="Unlock"
            @click="updatePassword(row)"
          ></el-button>
          <el-button
            type="primary"
            size="default"
            icon="Edit"
            @click="editUserInfo(row)"
          ></el-button>
          <el-popconfirm
            title="确认删除吗?"
            icon="delete"
            confirm-button-type="danger"
            cancel-button-type="warning"
            @confirm="deleteUser(row)"
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
      @current-change="findUser"
      @size-change="sizeChange"
    />
  </el-card>
  <el-dialog v-model="addUserFormVisible" title="添加用户" draggable overflow>
    <el-form
      class="addform"
      style="margin-top: 30px; margin-left: 20px"
      label-width="100px"
    >
      <div style="display: flex">
        <el-form-item label="用户名" required>
          <el-input
            style="width: 200px"
            v-model="addUserForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" style="margin-left: 10px" required>
          <el-input
            style="width: 200px"
            v-model="addUserForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
      </div>
      <div style="display: flex; margin-top: 20px">
        <el-form-item label="真实姓名">
          <el-input
            style="width: 200px"
            v-model="addUserForm.realname"
            placeholder="请输入真实姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="学号" style="margin-left: 10px">
          <el-input
            style="width: 200px"
            v-model="addUserForm.stunumber"
            placeholder="请输入学号"
          ></el-input>
        </el-form-item>
      </div>
      <div style="display: flex; margin-top: 20px">
        <el-form-item label="邮箱">
          <el-input
            style="width: 200px"
            v-model="addUserForm.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" style="margin-left: 10px">
          <el-input
            style="width: 200px"
            v-model="addUserForm.phonenumber"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
      </div>
      <div style="display: flex; margin-top: 20px">
        <el-form-item label="用户状态">
          <el-select
            v-model="addUserStatus"
            placeholder="请选择用户状态"
            style="width: 200px"
          >
            <el-option
              v-for="item in userStatusSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="refreshAddForm">
        重置
      </el-button>
      <el-button type="warning" size="default" @click="cancelAddForm">
        取消
      </el-button>
      <el-button
        type="success"
        size="default"
        @click="conformAddForm"
        :loading="isConformSending"
        loading-icon="Eleme"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
  <el-dialog
    v-model="updatePasswordFormVisible"
    title="修改密码"
    draggable
    overflow
  >
    <el-form
      class="addform"
      style="margin-top: 30px; margin-left: 120px"
      label-width="100px"
    >
      <el-form-item label="用户名">
        <el-input
          disabled
          style="width: 400px"
          v-model="updateUserForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <div style="display: flex; margin-top: 40px">
        <el-form-item label="新用户密码">
          <el-input
            style="width: 400px"
            v-model="updateUserPassword.value"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-button
          type="primary"
          size="default"
          @click="refreshPassword"
          style="margin-left: 20px"
        >
          重置密码
        </el-button>
      </div>
      <div
        style="
          margin-top: 5px;
          margin-left: 100px;
          font-size: 18px;
          color: #6060c4;
        "
      >
        Tips:重置用户密码，密码同用户名一致
      </div>
    </el-form>
    <template #footer>
      <el-button
        type="warning"
        size="default"
        @click="cancelUpdatePassword"
        style="margin-top: 60px"
      >
        取消
      </el-button>
      <el-button
        type="success"
        size="default"
        @click="conformUpdatePassword"
        style="margin-top: 60px; margin-left: 30px"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
  <el-drawer v-model="editUserInfoVisible" title="用户信息">
    <el-form style="margin-left: 10px" label-width="100px">
      <el-form-item label="用户名">
        <el-input
          style="width: 300px"
          :placeholder="userInfo.username"
          v-model="editUserForm.username"
        ></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" style="margin-top: 35px">
        <el-input
          style="width: 300px"
          :placeholder="userInfo.realname"
          v-model="editUserForm.realname"
        ></el-input>
      </el-form-item>
      <el-form-item label="学号" style="margin-top: 35px">
        <el-input
          style="width: 300px"
          :placeholder="userInfo.stunumber"
          v-model="editUserForm.stunumber"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" style="margin-top: 35px">
        <el-input
          style="width: 300px"
          :placeholder="userInfo.phonenumber"
          v-model="editUserForm.phonenumber"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" style="margin-top: 35px">
        <el-input
          style="width: 300px"
          :placeholder="userInfo.email"
          v-model="editUserForm.email"
        ></el-input>
      </el-form-item>
      <el-form-item label="IP地址" style="margin-top: 35px">
        <el-input
          style="width: 300px"
          disabled
          :placeholder="userInfo.ipaddress"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" style="margin-top: 35px">
        <el-input
          style="width: 300px"
          disabled
          :placeholder="userInfo.createtime"
        ></el-input>
      </el-form-item>
      <el-form-item label="最后登录时间" style="margin-top: 35px">
        <el-input
          style="width: 300px"
          disabled
          :placeholder="userInfo.lastlogin"
        ></el-input>
      </el-form-item>
      <el-form-item label="更新时间" style="margin-top: 35px">
        <el-input
          style="width: 300px"
          disabled
          :placeholder="userInfo.updatetime"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户角色" style="margin-top: 35px">
        <el-select
          v-model="editRole"
          multiple
          default-first-option
          :reserve-keyword="false"
          placeholder="请选择用户角色"
          style="width: 16vw"
        >
          <el-option
            v-for="item in userRoleList"
            :key="item.roleid"
            :label="item.rolename"
            :value="item.roleid"
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
import { onMounted, reactive, ref } from 'vue'
import useSysUserStore from '@/store/system/user/sysUser.ts'
import {
  reqAddUser,
  reqDelUser,
  reqGetUserByGroup,
  reqUpdateUser,
  reqUpdateUserInfo,
} from '@/api/system/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reqAddUserRole, reqGetRoleAll, reqGetRoleById } from '@/api/role'
let sysUserStore = useSysUserStore()
// ——————————————————————————————————————————————————————————————————————————————————
// 事件挂载
onMounted(() => {
  findUser()
})
// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
// ——————————————————————————————————————————————————————————————————————————————————
// 表单收集设置
let userInfoArr = ref<any>([])
let selectUserStatus = ref<any>()
let userRoleList = ref<any>([])
let addUserStatus = ref<any>()
let editRole = ref<any>([])
let addUserRoleList = ref({
  userid: '',
  roleid: [],
})
let updateUserPassword = ref<any>('')
const userStatusSelect = [
  {
    value: '1',
    label: '启用',
  },
  {
    value: '2',
    label: '禁止',
  },
]
let selectUserInfo = reactive<any>({
  page: '',
  limit: '',
  username: '',
  realname: '',
  stunumber: '',
  phonenumber: '',
  email: '',
  userstatus: '',
})
let userUpdate = reactive<any>({
  userid: '',
  username: '',
  password: '',
  realname: '',
  stunumber: '',
  phonenumber: '',
  remark: '',
  userstatus: 0,
  updatetime: '',
})
let addUserForm = reactive<any>({
  username: '',
  password: '',
  realname: '',
  stunumber: '',
  phonenumber: '',
  email: '',
  userstatus: 0,
})
let updateUserForm = reactive<any>({
  userid: '',
  username: '',
  password: '',
  realname: '',
  stunumber: '',
  phonenumber: '',
  email: '',
  userstatus: 0,
})
let editUserForm = reactive<any>({
  username: '',
  realname: '',
  stunumber: '',
  phonenumber: '',
  email: '',
})
let userInfo = reactive<any>()
const mutipleSelection = ref([])
// ——————————————————————————————————————————————————————————————————————————————————
// 判断栏设置
let addUserFormVisible = ref<boolean>(false)
let updatePasswordFormVisible = ref<boolean>(false)
let editUserInfoVisible = ref<boolean>(false)
let isDeleting = ref<boolean>(false)
let deletingMessage = ref<string>('批量删除')
// ——————————————————————————————————————————————————————————————————————————————————
// 实现方法
// 页码切换
const sizeChange = () => {
  findUser()
}
// ———————————————————————————————————————————————————————————————————————————————————
// 修改用户状态
const changeStatus = async (row) => {
  if (row.userstatus == 1) {
    userUpdate.userid = row.userid
    userUpdate.userstatus = 2
    ElMessageBox.confirm('确认禁用用户吗?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        let result = await reqUpdateUserInfo(userUpdate)
        if (result.code == 200) {
          findUser(row.userstatus ? pageCurrent.value : 1)
          {
            ElMessage({
              type: 'success',
              message: '用户已禁用',
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
    userUpdate.userid = row.userid
    userUpdate.userstatus = 1
    ElMessageBox.confirm('确认开启用户吗?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        let result = await reqUpdateUserInfo(userUpdate)
        if (result.code == 200) {
          findUser(row.userstatus ? pageCurrent.value : 1)
          {
            ElMessage({
              type: 'success',
              message: '用户已开启',
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
// ———————————————————————————————————————————————————————————————————————————————————
// 查询用户
const findUser = async (pager = 1) => {
  selectUserInfo.page = pager
  selectUserInfo.userstatus = selectUserStatus.value
  selectUserInfo.page = pageCurrent.value
  selectUserInfo.limit = pageSize.value
  let result = await reqGetUserByGroup(selectUserInfo)
  userInfoArr.value = result.data
  total.value = result.total
}

// ———————————————————————————————————————————————————————————————————————————————————
// 选择列表重置
const refreshSelectForm = () => {
  selectUserInfo.username = ''
  selectUserInfo.realname = ''
  selectUserInfo.stunumber = ''
  selectUserInfo.phonenumber = ''
  selectUserInfo.email = ''
  selectUserStatus.value = ''
  findUser()
}
// ———————————————————————————————————————————————————————————————————————————————————
// 新增用户
const addUser = () => {
  addUserFormVisible.value = true
}
// 添加用户重置框
const refreshAddForm = () => {
  addUserForm.username = ''
  addUserForm.password = ''
  addUserForm.realname = ''
  addUserForm.stunumber = ''
  addUserForm.phonenumber = ''
  addUserForm.email = ''
  addUserStatus.value = ''
}
// 添加用户取消按钮
const cancelAddForm = () => {
  refreshAddForm()
  addUserFormVisible.value = false
}
const conformAddForm = async () => {
  if (addUserForm.password == '' || addUserForm.username == '') {
    if (addUserForm.password == '') {
      ElMessage({
        type: 'warning',
        message: '用户密码不能为空',
      })
    }
    if (addUserForm.username == '') {
      ElMessage({
        type: 'warning',
        message: '用户名不能为空',
      })
    }
  } else {
    if (addUserStatus.value == '1') {
      addUserForm.userstatus = 1
    } else {
      addUserForm.userstatus = 0
    }
    let result = await reqAddUser(addUserForm)

    if (result.code == 200) {
      addUserFormVisible.value = false
      findUser()
      ElMessage({
        type: 'success',
        message: '用户添加成功',
      })
    } else {
      ElMessage({
        type: 'error',
        message: '用户添加失败，请重新尝试',
      })
    }
  }
}
// ———————————————————————————————————————————————————————————————————————————————————
// 修改密码
const updatePassword = (row) => {
  updatePasswordFormVisible.value = true
  updateUserForm = row
}
// 重置密码
const refreshPassword = async () => {
  updateUserForm.password = updateUserForm.username
  ElMessageBox.confirm('确认修改密码吗?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let result = await reqUpdateUserInfo(updateUserForm)
      if (result.code == 200) {
        updatePasswordFormVisible.value = false
        ElMessage({
          type: 'success',
          message: '密码修改成功',
        })
      } else {
        ElMessage({
          type: 'error',
          message: '密码修改出错',
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消重置密码',
      })
    })
}
const cancelUpdatePassword = () => {
  updatePasswordFormVisible.value = false
  updateUserPassword.value = ''
}
const conformUpdatePassword = async () => {
  updateUserForm.password = updateUserPassword.value
  let result = await reqUpdateUserInfo(updateUserForm)
  if (result.code == 200) {
    updatePasswordFormVisible.value = false
    findUser()
    updateUserPassword.value = ''
    ElMessage({
      type: 'success',
      message: '密码修改成功',
    })
  } else {
    updatePasswordFormVisible.value = false
    findUser()
    updateUserPassword.value = ''
    ElMessage({
      type: 'error',
      message: '密码修改失败',
    })
  }
}
// ———————————————————————————————————————————————————————————————————————————————————
// 详细信息展示与修改
const refreshEditForm = () => {
  editUserForm.userid = ''
  editUserForm.username = ''
  editUserForm.realname = ''
  editUserForm.stunumber = ''
  editUserForm.phonenumber = ''
  editUserForm.email = ''
}
const editUserInfo = async (row) => {
  addUserRoleList.value.userid = row.userid
  editUserInfoVisible.value = true
  userInfo = row
  editUserForm.userid = userInfo.userid
  editUserForm.username = userInfo.username
  editUserForm.realname = userInfo.realname
  editUserForm.stunumber = userInfo.stunumber
  editUserForm.phonenumber = userInfo.phonenumber
  editUserForm.email = userInfo.email
  await getRoleAll()

  let result = await reqGetRoleById(row.userid)
  editRole.value = result.data.roleid
}
const editCancel = () => {
  editUserInfoVisible.value = false
  refreshEditForm()
}
const editConform = async () => {
  let result = await reqUpdateUser(editUserForm)
  if (result.code == 200) {
    editUserInfoVisible.value = false
    ElMessage({
      type: 'success',
      message: '修改成功',
    })
    await addUserRole()
    await findUser()
  } else {
    editUserInfoVisible.value = false
    ElMessage({
      type: 'error',
      message: '更新失败',
    })
  }
}
const getRoleAll = async () => {
  let result = await reqGetRoleAll()
  console.log(result)
  userRoleList.value = result.data
}
const addUserRole = async () => {
  addUserRoleList.value.roleid = editRole.value
  console.log(addUserRoleList.value)
  let result = await reqAddUserRole(addUserRoleList.value)
  console.log(result)
}
// ———————————————————————————————————————————————————————————————————————————————————
// 删除用户
const deleteUser = async (row) => {
  let result = await reqDelUser(row.userid)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    findUser()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// ———————————————————————————————————————————————————————————————————————————————————
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
        delId = mutipleSelection.value[i].userid
        await reqDelUser(delId)
      }
      findUser()
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

<style scoped lang="scss"></style>
