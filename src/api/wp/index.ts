import request from '@/utils/request.ts'

enum API {
  GET_WRITEUP_LIST = '/writeup/wp/getlist',
  DEL_WRITEUP_BY_ID = '/writeup/wp/del',
  UPDATE_WRITEUP = '/writeup/wp/update',
  REFRESH_DOWNLOAD = '/writeup/wp/download/refresh',

  GET_AUDIT_LIST = '/writeup/wp/audit/getlist',
}

export const reqGetWPList = (page: any, limit: any) =>
  request.get<any, any>(API.GET_WRITEUP_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })

export const reqGetAuditWp = (page: any, limit: any) =>
  request.get<any, any>(API.GET_AUDIT_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })
export const reqDelWPById = (data: any) =>
  request.get<any, any>(API.DEL_WRITEUP_BY_ID, {
    params: {
      writeupid: data,
    },
  })
export const reqUpdateWP = (data: any) =>
  request.post<any, any>(API.UPDATE_WRITEUP, data)

export const reqRefreshDownLoad = (data: any) =>
  request.get<any, any>(API.REFRESH_DOWNLOAD, {
    params: {
      challengename: data,
    },
  })
