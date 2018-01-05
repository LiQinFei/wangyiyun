// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './vuex/store'
Vue.use(Vuex)
Vue.config.productionTip = false
// import SDK from './NIM_Web_SDK_v4.5.8/js/NIM_Web_SDK_v4.5.8'

// import './NIM_Web_SDK_v4.5.8/config.js'




// const nim = SDK.NIM.getInstance({
//   // ...
// })
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
