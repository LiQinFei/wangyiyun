import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


import state from "./state"
import mutations from "./mutations"
import actions from "./actions"

const store = new Vuex.Store({
// 定义状态
  state ,
  mutations,
  actions
  }

)

export default store

