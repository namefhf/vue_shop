import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/components/Login')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: () => import('@/components/Home'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('@/components/Welcome')
      },
      {
        path: '/users',
        component: () => import('@/components/user/Users')
      },
      {
        path: '/rights',
        component: () => import('@/components/power/Rights')
      },
      {
        path: '/roles',
        component: () => import('@/components/power/Roles')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
//路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()//访问登录页 放行
  const tokenstr = sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()
})

export default router
