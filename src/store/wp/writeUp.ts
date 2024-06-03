import { defineStore } from 'pinia'
import { reqGetWPList } from '../../api/wp'

const useWpStore = defineStore('writeup', {
  state: () => {
    return {
      WpList: [],
      WpTotal: 0,
    }
  },
  actions: {
    async GetWpList(page: any, limit: any) {
      const result = await reqGetWPList(page, limit)
      console.log(result)
      if (result.code == 200) {
        this.WpList = result.data
        this.WpTotal = result.total
      }
    },
  },
  getters: {},
})

export default useWpStore
