import { defineStore } from 'pinia'
import { reqGetCompListByGroup, reqGetCompTypeList } from '../../api/race/comp'

const useCompStore = defineStore('comp', {
  state: () => {
    return {
      compTypeList: [],
      compTypeTotal: [],
      compList: [],
      compTotal: [],
    }
  },
  actions: {
    async GetCompTypeList(page: any, limit: any) {
      const result = await reqGetCompTypeList(page, limit)
      if (result.code == 200) {
        this.compTypeList = result.data
        this.compTypeTotal = result.total
      }
    },
    async GetCompList(data: any) {
      const result = await reqGetCompListByGroup(data)
      console.log(result)
      if (result.code == 200) {
        this.compList = result.data
        this.compTotal = result.total
      }
    },
  },
  getters: {},
})

export default useCompStore
