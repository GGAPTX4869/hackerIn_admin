import { defineStore } from 'pinia'
import {
  reqGetChallengeList,
  reqGetChallengeTypeList,
} from '../../api/challenge'

const useChallengeStore = defineStore('challenge', {
  state: () => {
    return {
      challengeTypeList: [],
      challengeTypeTotal: 0,
      challengeList: [],
      challengeTotal: 0,
      challengeAuditTotal: 0,
      WpAuditTotal: 0,
      teamAuditTotal: 0,
    }
  },
  actions: {
    async GetChallengeTypeList(page: any, limit: any) {
      const result = await reqGetChallengeTypeList(page, limit)
      if (result.code == 200) {
        this.challengeTypeList = result.data
        this.challengeTypeTotal = result.total
        console.log(this.challengeTypeList)
      }
    },
    async GetChallengeList(page: any, limit: any) {
      const result = await reqGetChallengeList(page, limit)
      if (result.code == 200) {
        this.challengeList = result.data
        this.challengeTotal = result.total
        console.log(this.challengeList)
      }
    },
  },
  getters: {},
})

export default useChallengeStore
