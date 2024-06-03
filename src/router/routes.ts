export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'Login',
    meta: {
      title: '登录',
      hidden: true,
      icon: 'UserFilled',
    },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: true,
      icon: 'HomeFilled',
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '主页',
          hidden: false,
          icon: 'DataLine',
        },
      },
    ],
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'Close',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'Select',
    },
  },
  {
    path: '/website',
    component: () => import('@/layout/index.vue'),
    name: 'Website',
    meta: {
      title: '网站管理',
      hidden: false,
      icon: 'HomeFilled',
    },
    redirect: '/website/tournament',
    children: [
      {
        path: '/website/audit',
        component: () => import('@/views/website/audit/index.vue'),
        name: 'Audit',
        meta: {
          title: '信息审批',
          hidden: false,
          icon: 'Checked',
        },
      },
      {
        path: '/website/tournament',
        component: () => import('@/views/website/tournament/index.vue'),
        name: 'Tournament',
        meta: {
          title: '赛事赛程',
          hidden: false,
          icon: 'Position',
        },
      },
      {
        path: '/website/team',
        component: () => import('@/views/website/team/index.vue'),
        name: 'Team',
        meta: {
          title: '队伍管理',
          hidden: false,
          icon: 'Grid',
        },
      },
      {
        path: '/website/notice/addnotice',
        component: () => import('@/views/website/notice/addNotice/index.vue'),
        name: 'AddNotice',
        meta: {
          title: '添加公告',
          hidden: true,
        },
      },
      {
        path: '/website/notice/editnotice',
        component: () => import('@/views/website/notice/editNotice/index.vue'),
        name: 'EditNotice',
        meta: {
          title: '修改公告',
          hidden: true,
        },
      },
      {
        path: '/website/notice',
        component: () => import('@/views/website/notice/index.vue'),
        name: 'Notice',
        meta: {
          title: '公告管理',
          hidden: false,
          icon: 'Bell',
        },
      },
    ],
  },
  {
    path: '/docker',
    component: () => import('@/layout/index.vue'),
    name: 'Docker',
    meta: {
      title: '容器管理',
      hidden: false,
      icon: 'Grid',
    },
    redirect: '/docker/containers',
    children: [
      {
        path: '/docker/containers',
        component: () => import('@/views/docker/containers/index.vue'),
        name: 'Containers',
        meta: {
          title: 'Contaniers管理',
          hidden: false,
          icon: 'PriceTag',
        },
      },

      {
        path: '/docker/images',
        component: () => import('@/views/docker/images/index.vue'),
        name: 'Images',
        meta: {
          title: 'Images管理',
          hidden: false,
          icon: 'Monitor',
        },
      },
    ],
  },
  {
    path: '/challenge',
    component: () => import('@/layout/index.vue'),
    name: 'Challenge',
    meta: {
      title: '题库管理',
      hidden: false,
      icon: 'Management',
    },
    redirect: '/challenge/challenge',
    children: [
      {
        path: '/challenge/challenge',
        component: () => import('@/views/challenge/challenge/index.vue'),
        name: 'ChallengeInfo',
        meta: {
          title: '题目信息',
          hidden: false,
          icon: 'Tickets',
        },
      },

      {
        path: '/challenge/wp',
        component: () => import('@/views/challenge/wp/index.vue'),
        name: 'WP',
        meta: {
          title: 'WP管理',
          hidden: false,
          icon: 'Opportunity',
        },
      },
    ],
  },
  {
    path: '/system',
    component: () => import('@/layout/index.vue'),
    name: 'System',
    meta: {
      title: '系统管理',
      hidden: false,
      icon: 'Setting',
    },
    redirect: '/system/user',
    children: [
      {
        path: '/system/user',
        component: () => import('@/views/system/user/index.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'UserFilled',
        },
      },
      {
        path: '/system/role',
        component: () => import('@/views/system/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'CollectionTag',
        },
      },
      {
        path: '/system/log',
        component: () => import('@/views/system/log/index.vue'),
        name: 'LOG',
        meta: {
          title: '日志管理',
          hidden: false,
          icon: 'Tools',
        },
      },
    ],
  },
]
