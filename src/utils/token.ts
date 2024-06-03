// 封装本地存储数据
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('token', token)
}

// 获取本地存储token
export const GET_TOKEN = () => {
  return localStorage.getItem('token')
}

// 本地存储删除数据
export const DEL_TOKEN = () => {
  localStorage.removeItem('token')
}
