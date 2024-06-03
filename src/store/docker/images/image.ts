import { defineStore } from 'pinia'
import {
  reqGetImageTypeAll,
  reqGetImageTypeList,
} from '../../../api/docker/images'

const useImageStore = defineStore('image', {
  state: () => {
    return {
      imageType: [],
      imageTypeTotal: 0,
      imageTypeAll: [],
    }
  },
  actions: {
    async GetImageTypeAll() {
      const result = await reqGetImageTypeAll()
      this.imageTypeAll = result.data
    },
    async GetImageTypeList(page: any, limit: any) {
      const result = await reqGetImageTypeList(page, limit)
      this.imageType = result.data
      this.imageTypeTotal = result.total
    },
  },
  getters: {},
})

export default useImageStore
