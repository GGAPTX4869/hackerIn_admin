// 路由鉴权服务
import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from '../store/modules/user.ts'
import pinia from '../store'
import setting from '../setting.ts'
nprogress.configure({ showSpinner: false })
const userStore = useUserStore(pinia)

// 前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = setting.title + '-' + to.meta.title
  // to即将访问的对象，from路由源路径，next路由放行
  nprogress.start()

  // 判断用户是否登录
  const token = userStore.token
  const username = userStore.username
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          await userStore.userLogout()
          next({ path: '/login' })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      console.log(token)
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 后置守卫
router.afterEach(() => {
  nprogress.done()
})
