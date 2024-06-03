import request from '@/utils/request.ts'
import {
  GetCompReq,
  GetCompTeamReq,
  GetListReq,
  GetTeamUserReq,
} from './type.ts'

enum API {
  GET_TEAM_LIST = '/comp/team/getlist',
  GET_COMP_LIST = '/comp/comp/getlist',

  ADD_COMP = '/comp/comp/add',
  ADD_TEAM = '/comp/team/add',

  ADD_CAMPTEAM = '/comp/compteam/add',
  GET_CAMPTEAM_ALL = '/comp/compteam/getall',

  ADD_TEAMUSER = '/comp/teamuser/add',
  GET_TEAMUSER_ALL = '/comp/teamuser/getall',

  GET_COMP_ALL = '/comp/comp/getall',
  GET_COMPTEAM_BYID = '/comp/compteam/getbyid',
  GET_TEAMUSER_BYID = '/comp/teamuser/getbyid',

  // comp
  GET_COMP_LIST_BY_GROUP = '/comp/comp/getbg',
  DEL_COMP_LIST_BY_ID = '/comp/comp/del',
  UPDATE_COMP = '/comp/comp/update',

  GET_COMP_TPYE_LIST = '/comp/comptype/getlist',
  ADD_COMP_TPYE = '/comp/comptype/add',
  UPDATE_COMP_TPYE = '/comp/comptype/update',
  DEL_COMP_TPYE = '/comp/comptype/del',
  GET_COMP_TPYE_ALL = '/comp/comptype/getall',
}

export const reqGetTeamList = (page: number, limit: number) =>
  request.get<any, GetListReq>(API.GET_TEAM_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })
export const reqGetCompList = (page: number, limit: number) =>
  request.get<any, GetCompReq>(API.GET_COMP_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })
export const reqGetCompTeamAll = () =>
  request.get<any, GetCompTeamReq>(API.GET_CAMPTEAM_ALL)

export const reqGetTeamUserAll = () =>
  request.get<any, GetTeamUserReq>(API.GET_TEAMUSER_ALL)

export const reqGetCompAll = () => request.get<any, any>(API.GET_COMP_ALL)

export const reqGetCompTeamById = (data: string) =>
  request.get<any, any>(API.GET_COMPTEAM_BYID, {
    params: {
      compid: data,
    },
  })
export const reqGetTeamUserById = (data: string) =>
  request.get<any, any>(API.GET_TEAMUSER_BYID, {
    params: {
      teamid: data,
    },
  })

export const reqGetCompListByGroup = (data: any) =>
  request.post<any, any>(API.GET_COMP_LIST_BY_GROUP, data)
export const reqAddCompType = (data: any) =>
  request.post<any, any>(API.ADD_COMP_TPYE, data)
export const reqUpdateCompType = (data: any) =>
  request.post<any, any>(API.UPDATE_COMP_TPYE, data)
export const reqAddComp = (data: any) =>
  request.post<any, any>(API.ADD_COMP, data)
export const reqUpdateComp = (data: any) =>
  request.post<any, any>(API.UPDATE_COMP, data)
export const reqDelCompType = (data: any) =>
  request.get<any, any>(API.DEL_COMP_TPYE, {
    params: {
      competitiontypeid: data,
    },
  })

export const reqGetCompTypeList = (page: any, limit: any) =>
  request.get<any, any>(API.GET_COMP_TPYE_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })
export const reqDelComp = (data: any) =>
  request.get<any, any>(API.DEL_COMP_LIST_BY_ID, {
    params: {
      competitonid: data,
    },
  })
export const reqGetCompTypeAll = () =>
  request.get<any, any>(API.GET_COMP_TPYE_ALL)
