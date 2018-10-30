import * as types from './types'

const state = {
  ternimalAuthorityList: []
}

const actions = {
  setTernimalAuthorityList ({ commit }, res) {
    commit(types.SET_TERMINAL_AUTHORITY_LIST, res)
  }
}

const getters = {
  getTernimalAuthorityList: state => state.ternimalAuthorityList
}

const mutations = {
  [types.SET_TERMINAL_AUTHORITY_LIST] (state, res) {
    state.ternimalAuthorityList = res
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}