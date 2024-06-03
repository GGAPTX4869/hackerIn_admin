import { defineStore } from 'pinia'
import {
  reqGetActionList,
  reqGetActNoticeList,
  reqGetNoticeList,
} from '../../api/action'

const useActionStore = defineStore('action', {
  state: () => {
    return {
      actNoticeList: [],
      actNoticeTotal: 0,
      actionList: [],
      actionTotal: 0,
      noticeList: [],
      noticeTotal: 0,
    }
  },
  actions: {
    async GetActNoticeList(page: any, limit: any) {
      const result = await reqGetActNoticeList(page, limit)
      console.log(result)
      if (result.code == 200) {
        this.actNoticeList = result.data
        this.actNoticeTotal = result.total
      }
    },
    async GetActionList(page: any, limit: any) {
      const result = await reqGetActionList(page, limit)
      console.log(result)
      if (result.code == 200) {
        this.actionList = result.data
        this.actionTotal = result.total
      }
    },
    async GetNoticeList(page: any, limit: any) {
      const result = await reqGetNoticeList(page, limit)
      if (result.code == 200) {
        this.noticeList = result.data
        this.noticeTotal = result.total
      }
    },
  },
  getters: {},
})

export default useActionStore
