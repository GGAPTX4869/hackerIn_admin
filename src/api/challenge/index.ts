import request from '../../utils/request.ts'

enum API {
  // type
  GET_CHALLENGE_TYPE_LIST = '/challenge/type/getlist',
  ADD_CHALLENGE_TYPE = '/challenge/type/add',
  DEL_CHALLENGE_TYPE = '/challenge/type/del',
  UPDATE_CHALLENGE_TYPE = '/challenge/type/update',
  GET_CHALLENGE_TYPE_ALL = '/challenge/type/getall',
  GET_CHALLENGE_COMP_TYPE_ALL = '/challenge/type/comp/getall',

  // challenge
  ADD_CHALLENGE = '/challenge/challenge/add',
  GET_CHALLENGE_LIST = '/challenge/challenge/getlist',
  DEL_CHALLENGE = '/challenge/challenge/del',
  UPDATE_CHALLENGE = '/challenge/challenge/update',
  GET_CHALLENGE_BY_ID = '/challenge/challenge/getbyid',
  GET_CHALLENGE_BY_TYPE = '/challenge/challenge/getbytype',

  GET_CHALLENGE_AUDIT = '/challenge/challenge/getaudit',
  CHECK_PASS = '/challenge/challenge/checkpass',
  CHECK_CANCEL = '/challenge/challenge/cancel',
}

export const reqGetChallengeTypeList = (page: any, limit: any) =>
  request.get<any, any>(API.GET_CHALLENGE_TYPE_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })
export const reqGetChallengeList = (page: any, limit: any) =>
  request.get<any, any>(API.GET_CHALLENGE_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })
export const reqGetAuditChallengeList = (page: any, limit: any) =>
  request.get<any, any>(API.GET_CHALLENGE_AUDIT, {
    params: {
      page: page,
      limit: limit,
    },
  })

export const reqAddChallengeType = (data: any) =>
  request.post<any, any>(API.ADD_CHALLENGE_TYPE, data)

export const reqDelChallengeType = (data: string) =>
  request.get<any, any>(API.DEL_CHALLENGE_TYPE, {
    params: {
      challengetypeid: data,
    },
  })

export const reqUpdateChallengeType = (data: any) =>
  request.post<any, any>(API.UPDATE_CHALLENGE_TYPE, data)
export const reqUpdateChallenge = (data: any) =>
  request.post<any, any>(API.UPDATE_CHALLENGE, data)
export const reqCheckPass = (data: any) =>
  request.post<any, any>(API.CHECK_PASS, data)
export const reqCheckCancel = (data: any) =>
  request.post<any, any>(API.CHECK_CANCEL, data)

export const reqGetChallengeTypeAll = () =>
  request.get<any, any>(API.GET_CHALLENGE_TYPE_ALL)

export const reqGetChallengeCompTypeAll = () =>
  request.get<any, any>(API.GET_CHALLENGE_COMP_TYPE_ALL)

export const reqAddChallenge = (data: any) =>
  request.post<any, any>(API.ADD_CHALLENGE, data)
export const reqDelChallenge = (data: string) =>
  request.get<any, any>(API.DEL_CHALLENGE, {
    params: {
      challengeid: data,
    },
  })
export const reqGetChallengeById = (data: string) =>
  request.get<any, any>(API.GET_CHALLENGE_BY_ID, {
    params: {
      challengeid: data,
    },
  })

export const reqGetChallengeByType = (data: string) =>
  request.get<any, any>(API.GET_CHALLENGE_BY_TYPE, {
    params: {
      challengetypeid: data,
    },
  })
