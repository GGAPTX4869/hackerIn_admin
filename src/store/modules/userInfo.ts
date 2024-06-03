import { defineStore } from 'pinia'
import {
  reqGetCompAll,
  reqGetCompTeamById,
  reqGetTeamUserById,
} from '../../api/race/comp'

const useUserInfoStore = defineStore('userInfo', {
  state: () => {
    return {
      compAll: [],
      compId: '',
      compTeam: [],
      teamId: '',
      teamUser: [],
      userId: '',
    }
  },
  actions: {
    async getCompAll() {
      const result = await reqGetCompAll()
      if (result.code == 200) {
        this.compAll = result.data
      }
    },
    async getCompTeamById(compId: string) {
      const result = await reqGetCompTeamById(compId)
      if (result.code == 200) {
        this.compTeam = result.data
      }
    },
    async getTeamUserById(teamId: string) {
      const result = await reqGetTeamUserById(teamId)
      if (result.code == 200) {
        this.teamUser = result.data
      }
    },
  },
  getters: {},
})

export default useUserInfoStore
