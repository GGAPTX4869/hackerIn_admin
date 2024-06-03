import request from '@/utils/request.ts'

enum API {
  GET_ROLE_MENU_LIST = '/role/menu/getlist',
  GET_ROLE_LIST = '/role/role/getlist',
  ADD_ROLE = '/role/role/add',
  DEL_ROLE = '/role/role/del',
  UPDATE_ROLE = '/role/role/update',
  ADD_ROLE_PERMS = '/role/roleperms/add',
  GET_ROLE_PERMS = '/role/roleperms/getperms',
  GET_ROLE_ALL = '/role/role/getall',
  GET_ROLE_BY_ID = '/role/role/getbyid',
  ADD_USER_ROLE = '/role/role/userrole/add',
}

export const reqGetRoleMenuList = () =>
  request.get<any, any>(API.GET_ROLE_MENU_LIST)
export const reqGetRoleList = (data: any) =>
  request.post<any, any>(API.GET_ROLE_LIST, data)

export const reqAddRole = (data: any) =>
  request.post<any, any>(API.ADD_ROLE, data)

export const reqDelRole = (data: string) =>
  request.get<any, any>(API.DEL_ROLE, {
    params: {
      roleid: data,
    },
  })
export const reqGetRoleById = (data: string) =>
  request.get<any, any>(API.GET_ROLE_BY_ID, {
    params: {
      userid: data,
    },
  })

export const reqGetRolePerms = (data: string) =>
  request.get<any, any>(API.GET_ROLE_PERMS, {
    params: {
      roleid: data,
    },
  })
export const reqAddRolePerms = (data: any) =>
  request.post<any, any>(API.ADD_ROLE_PERMS, data)

export const reqUpdateRole = (data: any) =>
  request.post<any, any>(API.UPDATE_ROLE, data)

export const reqGetRoleAll = (data: any) =>
  request.get<any, any>(API.GET_ROLE_ALL, data)

export const reqAddUserRole = (data: any) => {
  request.post<any, any>(API.ADD_USER_ROLE, data)
}
