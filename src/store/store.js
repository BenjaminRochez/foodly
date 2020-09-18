import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: [],
    count: 0
  },
  mutations: {
    addUser (state, user) {
        state.user = user
    },
    increment (state) {
        state.count++
      }
  },

  getters: {
      user: state => state.user,
  }
})