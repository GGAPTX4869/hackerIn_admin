import request from '@/utils/request.ts'

enum API {
  GET_USER_LIST = '/user/getlist',
  UPDATE_USER_INFO = '/user/update',
  GET_USER_BY_GROUP = '/user/selbyg',
  ADD_USER = '/user/add',
  DELETE_USER = '/user/del',
}
export const reqGetUserList = (page: number, limit: number) =>
  request.get<any, any>(API.GET_USER_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })
export const reqUpdateUserInfo = (data: any) =>
  request.post<any, any>(API.UPDATE_USER_INFO, data)
export const reqGetUserByGroup = (data: any) =>
  request.get<any, any>(API.GET_USER_BY_GROUP, {
    params: {
      page: data.page,
      limit: data.limit,
      username: data.username,
      realname: data.realname,
      stunumber: data.stunumber,
      phonenumber: data.phonenumber,
      email: data.email,
      userstatus: data.userstatus,
    },
  })

export const reqAddUser = (data: any) =>
  request.post<any, any>(API.ADD_USER, data)

export const reqUpdateUser = (data: any) =>
  request.post<any, any>(API.UPDATE_USER, data)

export const reqDelUser = (data: any) =>
  request.get<any, any>(API.DELETE_USER, {
    params: {
      userid: data,
    },
  })
