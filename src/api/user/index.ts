import request from '@/utils/request.ts'
import { loginForm, loginResData, userInfoResData } from './type.ts'
import { commonRedData } from '../commonres/type.ts'

enum API {
  LOGIN_URL = '/public/user/login',
  // GETUSERLIST_URL = '/user/getlist'
  GET_USERINFO_URL = '/user/getuser',
  USER_LOGOUT_URL = '/public/user/logout',
  USER_GET_ALL = '/user/userinfo/getall',
}

export const reqLogin = (data: loginForm) =>
  request.post<any, loginResData>(API.LOGIN_URL, data)

// export const reqGetUserList = () => request.get<any,userListResData>(API.GETUSERLIST_URL,data)

export const reqGetUserInfo = () =>
  request.get<any, userInfoResData>(API.GET_USERINFO_URL)

export const reqGetAllUser = () =>
  request.get<any, userInfoResData>(API.USER_GET_ALL)

export const reqUserLogout = (data: string) =>
  request.get<any, commonRedData>(API.USER_LOGOUT_URL, {
    params: {
      userid: data,
    },
  })
