import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user'
import type { loginForm, loginResData } from '@/api/user/type.ts'
import type { UserState } from './types/types.ts'
import { GET_TOKEN, SET_TOKEN } from '@/utils/token.ts'
import { constantRoute } from '@/router/routes.ts'
import { reqGetUserInfo } from '@/api/user'
import { DEL_TOKEN } from '../../utils/token.ts'
import { reqUserLogout } from '../../api/user'
import { DEL_USERID, GET_USERID, SET_USERID } from '../../utils/user.ts'

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户的TOKEN
      menuRoutes: constantRoute, // 仓库存储菜单
      username: '',
      avatar: '',
      userId: GET_USERID(),
    }
  },
  actions: {
    async userLogin(data: loginForm) {
      const result: loginResData = await reqLogin(data)
      console.log(result)

      if (result.code == 200) {
        this.token = result.token as string
        // 本地持久化存储
        await SET_TOKEN(result.token as string)
        await SET_USERID(result.data.userid)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async userInfo() {
      const result = await reqGetUserInfo(this.userId)
      if (result.code == 200) {
        this.username = result.data.username
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject('获取用户信息失败')
      }
    },
    async userLogout() {
      const result = await reqUserLogout(this.userId)
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.userId = ''
        this.avatar = ''
        DEL_TOKEN()
        DEL_USERID()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
  },
  getters: {},
})

export default useUserStore
