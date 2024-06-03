// layout组件仓库
import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false,
      refresh: false, // 控制刷新效果
    }
  },
  actions: {},
  getters: {},
})

export default useLayoutSettingStore
