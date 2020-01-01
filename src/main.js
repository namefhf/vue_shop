import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')//向请求头中添加Authorization，来成功调用有权限的api
  // console.log(config)
  return config
})
Vue.prototype.$axios = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
