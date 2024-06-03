import request from '../../utils/request.ts'

enum API {
  GET_LOG_LIST = '/log/getlist',
}

export const reqGetLogList = (data: any) =>
  request.post<any, any>(API.GET_LOG_LIST, data)
