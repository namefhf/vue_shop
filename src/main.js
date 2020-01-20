import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
Vue.config.productionTip = false
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')//向请求头中添加Authorization，来成功调用有权限的api
  // console.log(config)
  return config
})
Vue.component('tree-table',TreeTable)
// Vue.filter('dateFormat',(originval)=>{
//   const date = new Date(originval)
//   const y = date.getFullYear()
//   const m = (date.getMonth()+1+'').padStart(2,'0')
//   const d = (date.getDate()+'').padStart(2,'0')
//   const hh = (date.getHours()+'').padStart(2,'0')
//   const mm = (date.getMinutes()+'').padStart(2,'0')
//   const ss = (date.getSeconds()+'').padStart(2,'0')
//   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// })
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.prototype.$axios = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
