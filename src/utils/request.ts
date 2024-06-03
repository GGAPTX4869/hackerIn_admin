// axios二次封装:使用请求与响应拦截器
import axios from 'axios'
import useUserStore from '../store/modules/user.ts'
import { ElMessage } from 'element-plus'

// create创建实例
const request = axios.create({
  // 基础路径
  baseURL: import.meta.env.VITE_APP_URL,
  timeout: 60000, //超时设置
})
// 请求响应拦截器
request.interceptors.request.use((config) => {
  // 返回参数,headers请求头
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    //处理网络错误
    ElMessage({
      type: 'error',
      message: error.response.data.msg,
    })
    return Promise.reject(error)
  },
)

export default request
