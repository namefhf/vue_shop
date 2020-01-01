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
  },{
    path:'/home',
    component:()=>import('@/components/Home')
  }
]

const router = new VueRouter({
  routes
})
//路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next()//访问登录页 放行
  const tokenstr = sessionStorage.getItem('token')
  if(!tokenstr) return next('/login')
  next()
})

export default router
