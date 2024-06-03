import { defineStore } from 'pinia'
import { reqGetUserList } from '../../../api/system/user'

const useSysUserStore = defineStore('sysUser', {
  state: () => {
    return {
      userList: [],
    }
  },
  actions: {
    async getUserList() {
      const result = await reqGetUserList(1, 10)
      if (result.code == 200) {
        this.userList = result.data
      }
    },
  },
  getters: {},
})

export default useSysUserStore
