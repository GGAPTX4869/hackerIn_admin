import request from '@/utils/request.ts'

enum API {
  GET_TEAM_LIST_PA = '/team/team/data/getlist',
  GET_TEAM_INFO = '/team/team/data/getinfo',
  ADD_TEAM = '/team/team/add',
  GET_TEAM_BYNAME = '/team/team/getbyname',
  ADD_TEAMUSER = '/team/teamuser/add',
  DEL_TEAM = '/team/team/del',
  UPDATE_TEAM = '/team/team/update',

  GET_TEAM_BY_ID = '/team/team/teaminfo/getbyid',
  DEL_TEAMUSER = '/team/teamuser/del',
  GET_TEAMUSER_ID_LIST = '/team/teamuser/getidlist',
  UPDATE_TEAMUSER = '/team/teamuser/update',

  GET_AUDIT_LIST = '/team/audit/getlist',
  CHECK_UP_TEAM = '/team/audit/checkup',
}

export const reqGetTeamListPa = (page: any, limit: any) =>
  request.get<any, any>(API.GET_TEAM_LIST_PA, {
    params: {
      page: page,
      limit: limit,
    },
  })

export const reqGetAuditTeamList = (page: any, limit: any) =>
  request.get<any, any>(API.GET_AUDIT_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })

export const reqGetTeamInfoById = (data: any) =>
  request.get<any, any>(API.GET_TEAM_INFO, {
    params: {
      teamid: data,
    },
  })

export const reqAddTeam = (data: any) =>
  request.post<any, any>(API.ADD_TEAM, data)

export const reqAddTeamUser = (data: any) =>
  request.post<any, any>(API.ADD_TEAMUSER, data)

export const reqDelTeam = (data: any) =>
  request.get<any, any>(API.DEL_TEAM, {
    params: {
      teamid: data,
    },
  })

export const reqDelTeamUser = (data: any) =>
  request.post<any, any>(API.DEL_TEAMUSER, data)

export const reqGetTeamById = (data: any) =>
  request.get<any, any>(API.GET_TEAM_BY_ID, {
    params: {
      teamid: data,
    },
  })

export const reqGetTeamUserList = (data: any) =>
  request.get<any, any>(API.GET_TEAMUSER_ID_LIST, {
    params: {
      teamid: data,
    },
  })

export const reqGetTeamByName = (data: any) =>
  request.post<any, any>(API.GET_TEAM_BYNAME, data)

export const reqUpdateTeam = (data: any) =>
  request.post<any, any>(API.UPDATE_TEAM, data)

export const reqUpdateTeamUser = (data: any) =>
  request.post<any, any>(API.UPDATE_TEAMUSER, data)

export const reqCheckUpTeam = (data: any) =>
  request.post<any, any>(API.CHECK_UP_TEAM, data)
