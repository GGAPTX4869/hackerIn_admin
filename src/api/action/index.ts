import request from '@/utils/request.ts'

enum API {
  // action
  GET_ACTION_BY_ID = '/action/getbyid',
  DEL_ACTION_BY_ID = '/action/del',

  // actnotice
  GET_ACTNOTICE_LIST = '/action/actnotice/getlist',

  GET_ACTION_LIST = '/action/action/getlist',

  // notice
  GET_NOTICE_LIST = '/action/notice/getlist',
  UPDATE_NOTICE = '/action/notice/update',
  ADD_NOTICE = '/action/notice/add',
  GET_WEEK = '/action/getweek',
}

export const reqGetActNoticeList = (page: any, limit: any) =>
  request.get<any, any>(API.GET_ACTNOTICE_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })
export const reqGetWeek = () => request.get<any, any>(API.GET_WEEK)

export const reqGetActionList = (page: any, limit: any) =>
  request.get<any, any>(API.GET_ACTION_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })

export const reqGetNoticeList = (page: any, limit: any) =>
  request.get<any, any>(API.GET_NOTICE_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })
export const reqGetNoticeById = (data: any) =>
  request.get<any, any>(API.GET_ACTION_BY_ID, {
    params: {
      actionid: data,
    },
  })
export const reqDelNoticeById = (data: any) =>
  request.get<any, any>(API.DEL_ACTION_BY_ID, {
    params: {
      actionid: data,
    },
  })

export const reqAddNotice = (data: any) =>
  request.post<any, any>(API.ADD_NOTICE, data)

export const reqUpdateNotice = (data: any) =>
  request.post<any, any>(API.UPDATE_NOTICE, data)
