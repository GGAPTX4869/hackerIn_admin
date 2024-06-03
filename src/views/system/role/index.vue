<!--
  Description：
  @date：2024-03-18 21:35
  @author：JokerWang
-->

<template>
  <div style="display: flex">
    <div>
      <el-card style="width: 16vw; border-radius: 10px">
        <div
          style="
            display: flex;
            justify-content: center;
            font-size: 20px;
            font-weight: bolder;
            color: rgb(25 29 29 / 56%);
          "
        >
          菜单与按钮总览
        </div>
        <div>
          <el-tree
            style="margin-top: 2vh; font-size: 16px"
            :props="defaultProps"
            node-key="id"
            highlight-current
            :data="roleMenuList"
          />
        </div>
      </el-card>
    </div>
    <div style="margin-left: 1vw">
      <el-card style="width: 65vw; border-radius: 10px">
        <div>
          <el-form style="margin-top: 20px" label-width="100px">
            <div style="display: flex; justify-content: space-between">
              <div>
                <el-form-item label="角色名">
                  <el-input
                    style="width: 200px"
                    placeholder="请输入角色名"
                    v-model="selectRoleList.rolename"
                  ></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="角色编码">
                  <el-input
                    style="width: 200px"
                    placeholder="请输入角色编码"
                    v-model="selectRoleList.encode"
                  ></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="角色描述">
                  <el-input
                    style="width: 200px"
                    placeholder="请输入角色描述"
                    v-model="selectRoleList.description"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between">
              <el-form-item label="用户状态">
                <el-select
                  placeholder="请选择用户状态"
                  style="width: 200px"
                  v-model="selectStatus"
                  @change="getRoleList"
                >
                  <el-option
                    v-for="item in roleStatusSelect"
                    :key="item.value"
                    :label="item.lable"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div>
                <el-button
                  style="color: #042a47"
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
                  @click="getRoleList"
                >
                  查询
                </el-button>
              </div>
            </div>
          </el-form>
        </div>
      </el-card>
      <el-card style="width: 65vw; margin-top: 2vh; border-radius: 10px">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div style="font-size: 18px">角色列表</div>
          <div style="vertical-align: center">
            <el-button
              type="primary"
              size="default"
              icon="Plus"
              @click="addRole"
            >
              新增角色
            </el-button>
            <el-button
              type="danger"
              size="default"
              icon="Delete"
              @click="handlerMuchDel"
            >
              批量删除
            </el-button>
          </div>
        </div>
        <el-table
          style="margin: 10px 0"
          border
          :data="roleList"
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
            label="角色名称"
            width="140px"
            align="center"
            prop="rolename"
          ></el-table-column>
          <el-table-column
            label="角色编码"
            width="220px"
            align="center"
            prop="encode"
          ></el-table-column>
          <el-table-column label="角色描述" width="200px" align="center">
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
            label="角色状态"
            width="130px"
            align="center"
            prop="status"
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
                @click="editRoleInfo(row)"
              ></el-button>
              <el-popconfirm
                title="确认删除吗?"
                icon="delete"
                confirm-button-type="danger"
                cancel-button-type="warning"
                @confirm="deleteRole(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="default"
                    icon="Delete"
                  ></el-button>
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
    </div>
  </div>
  <el-dialog v-model="isAddRoleFormVisible" title="新增角色" draggable overflow>
    <el-form style="margin-top: 40px; margin-left: 180px" label-width="100px">
      <el-form-item label="角色名称">
        <el-input
          style="width: 250px"
          v-model="addRoleInfo.rolename"
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色编码" style="margin-top: 4vh">
        <el-input
          style="width: 250px"
          v-model="addRoleInfo.encode"
          placeholder="请输入角色编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色描述" style="margin-top: 4vh">
        <el-input
          placeholder="请输入角色描述"
          v-model="addRoleInfo.description"
          style="width: 250px"
          maxlength="30"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
      <div>
        <el-form-item
          label="角色状态"
          style=" align-items: center;margin-top: 2vh"
        >
          <el-switch
            size="large"
            v-model="isAddStatus"
            inline-prompt
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button type="warning" size="default" @click="addRoleCancel">
        取消
      </el-button>
      <el-button type="primary" size="default" @click="addRoleConform">
        确定
      </el-button>
    </template>
  </el-dialog>
  <el-drawer v-model="isEditRoleVisible" title="编辑角色">
    <el-form label-width="100px">
      <el-form-item label="角色名称" style="margin-top: 20px">
        <el-input v-model="editInfo.rolename" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" style="margin-top: 40px">
        <el-input
          v-model="editInfo.encode"
          style="width: 250px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="角色描述" style="margin-top: 40px">
        <el-input
          placeholder="请输入类型描述"
          v-model="editInfo.description"
          style="width: 250px"
          maxlength="30"
          :show-word-limit="true"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" style="margin-top: 40px">
        <el-input
          v-model="editInfo.createtime"
          style="width: 250px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="操作用户" style="margin-top: 40px">
        <el-input
          v-model="editInfo.operator"
          style="width: 250px"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="权限操作" style="margin-top: 40px">
        <el-button type="primary" plain @click="chooseRolePerms">
          添加权限
        </el-button>
      </el-form-item>
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
  <el-drawer v-model="chooseRole" title="选择权限" :append-to-body="true">
    <div>
      <el-tree
        style="font-size: 16px"
        :props="defaultProps"
        node-key="id"
        highlight-current
        :data="roleMenuList"
        show-checkbox
        auto-expand-parent
        :default-expanded-keys="checkRoleKeys"
        :default-checked-keys="checkRoleKeys"
        @check="getCheckNode"
      />
    </div>
    <template #footer>
      <div style="flex: auto; margin-top: 4vh; margin-right: 250px">
        <el-button type="warning" size="large" @click="editCancelRolePerms">
          取消
        </el-button>
        <el-button type="primary" size="large" @click="editConformRolePerms">
          确认
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  reqAddRole,
  reqAddRolePerms,
  reqDelRole,
  reqGetRoleList,
  reqGetRoleMenuList,
  reqGetRolePerms,
  reqUpdateRole,
} from '@/api/role'
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

onMounted(async () => {
  await getRoleMenuList()
  await getRoleList()
})

// ——————————————————————————————————————————————————————————————————————————————————
// 分页栏设置
let pageCurrent = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)

// ——————————————————————————————————————————————————————————————————————————————————
// 判断栏
let isAddRoleFormVisible = ref<boolean>(false)
let isEditRoleVisible = ref<boolean>(false)
let chooseRole = ref<boolean>(false)
let selectStatus = ref('')

// ——————————————————————————————————————————————————————————————————————————————————
// 信息栏
let roleMenuList = ref([])
let defaultProps = ref({
  label: 'title',
})
let selectRoleList = ref({
  page: pageCurrent.value,
  limit: pageSize.value,
  encode: '',
  description: '',
  rolename: '',
  status: 0,
})
let roleStatusSelect = ref([
  {
    value: 1,
    lable: '启用',
  },
  {
    value: 2,
    lable: '禁用',
  },
])
let roleList = ref()
let checkRoleKeys = ref([])

let reAddRolePerms = ref({
  roleid: '',
  permsid: [],
})
const mutipleSelection = ref([])

let addRoleInfo = ref({
  rolename: '',
  description: '',
  encode: '',
  status: 0,
})

let editInfo = ref({
  createtime: '',
  description: '',
  encode: '',
  operateid: '',
  operator: '',
  roleid: '',
  rolename: '',
  status: 1,
})
let isAddStatus = ref()

const getRoleMenuList = async () => {
  let result = await reqGetRoleMenuList()
  roleMenuList.value = result.data
  console.log(result)
}

const getRoleList = async () => {
  if (selectStatus.value == 1) {
    selectRoleList.value.status = 1
  } else if (selectStatus.value == 2) {
    selectRoleList.value.status = 2
  }
  let result = await reqGetRoleList(selectRoleList.value)
  console.log(result)
  roleList.value = result.data
}

const addRole = () => {
  isAddRoleFormVisible.value = true
  addRoleInfo.value.rolename = ''
  addRoleInfo.value.descrition = ''
  addRoleInfo.value.encode = ''
  addRoleInfo.value.status = 0
}

const addRoleCancel = () => {
  isAddRoleFormVisible.value = false
}
const addRoleConform = async () => {
  if (isAddStatus.value) {
    addRoleInfo.value.status = 1
  } else {
    addRoleInfo.value.status = 2
  }
  let result = await reqAddRole(addRoleInfo.value)
  if (result.code == 200) {
    isAddRoleFormVisible.value = false
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
    getRoleList()
  } else {
    ElMessage({
      type: 'error',
      message: '系统出错',
    })
  }
}

const handleSelectionChange = (val) => {
  mutipleSelection.value = val
}
const handlerMuchDel = async () => {
  ElMessageBox.confirm('确认删除这些角色吗?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let delId = ''
      // 愚笨式的循环写法
      for (let i = 0; i < mutipleSelection.value.length; i++) {
        delId = mutipleSelection.value[i].roleid
        await reqDelRole(delId)
      }
      await getRoleList()
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

const deleteRole = async (row) => {
  let result = await reqDelRole(row.roleid)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    await getRoleList()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

const editRoleInfo = (row) => {
  isEditRoleVisible.value = true
  editInfo.value.createtime = row.createtime
  editInfo.value.description = row.description
  editInfo.value.encode = row.encode
  editInfo.value.operateid = row.operateid
  editInfo.value.operator = row.operator
  editInfo.value.roleid = row.roleid
  editInfo.value.rolename = row.rolename
  editInfo.value.status = row.status
  reAddRolePerms.value.roleid = row.roleid
}

const chooseRolePerms = async () => {
  chooseRole.value = true
  let result = await reqGetRolePerms(reAddRolePerms.value.roleid)
  console.log(result)
  if (result.code == 200) {
    checkRoleKeys.value = result.data
    console.log(checkRoleKeys.value)
  }
}

const getCheckNode = (nodeObj, SelectedObj) => {
  console.log(SelectedObj)
  checkRoleKeys.value = SelectedObj.checkedKeys
}

const editCancelRolePerms = () => {
  chooseRole.value = false
}
const editConformRolePerms = async () => {
  reAddRolePerms.value.permsid = checkRoleKeys.value
  let result = await reqAddRolePerms(reAddRolePerms.value)
  if (result.code == 200) {
    chooseRole.value = false
    ElMessage({
      type: 'success',
      message: '权限已添加',
    })
  } else {
    ElMessage({
      type: 'error',
      message: '系统错误',
    })
  }
}

const editCancel = () => {
  isEditRoleVisible.value = false
}
const editConform = async () => {
  let result = await reqUpdateRole(editInfo.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '更新成功',
    })
    isEditRoleVisible.value = false
    getRoleList()
  } else {
    ElMessage({
      type: 'error',
      message: '系统错误',
    })
  }
}

const refreshSelectForm = async () => {
  selectRoleList.value.rolename = ''
  selectRoleList.value.description = ''
  selectRoleList.value.encode = ''
  selectStatus.value = ''
  await getRoleList()
}
</script>

<style scoped></style>
