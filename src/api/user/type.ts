// 登录接口ts对象
export interface loginForm {
  username: string
  password: string
}

export interface loginResData {
  code: number
  msg?: string
  token?: string
}

interface userInfo {
  userid: string
  username: string
  password: string
  realname: string
  stunumber: string
  ipaddress: string
  avatar: string
  phonenumber: string
  userstatus: number
  usertype: number
  remark: number
  lastlogin: string
  createtime: string
  updatetime: string
}
export interface userInfoResData {
  code: number
  data: userInfo
}
