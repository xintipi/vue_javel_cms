import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import Cookie from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state () {
    return {
      layout: 'default',
      profile: null,
      currentPermissions: [],
      token: Cookie.get('token'),
      loadingOverlay: false,
      prefectures: null,
      dataChart: {},
      mapInit: false,
      previewUpdateTime: '',
      productionUpdateTime: '',
      isResponseError: false
    }
  },
  getters: {
    profile: state => state.profile,
    hasToken: state => state.token,
    layout: state => state.layout || 'default',
    prefectures: state => state.prefectures,
    dataChart: state => state.dataChart,
    currentPermissions: state => state.currentPermissions,
    mapInit: state => state.mapInit,
    previewUpdateTime: state => state.previewUpdateTime,
    productionUpdateTime: state => state.productionUpdateTime,
    isResponseError: state => state.isResponseError
  },
  mutations: {
    setIsResponseError (state, payload) {
      state.isResponseError = payload
    },
    [types.SET_PREFECTURES] (state, payload) {
      state.prefectures = payload
    },
    [types.SET_CHART] (state, payload) {
      state.dataChart = payload
    },
    [types.START_LOADING] (state) {
      state.loadingOverlay = true
      document.getElementById('loading').style.opacity = 'block'
    },
    [types.END_LOADING] (state) {
      state.loadingOverlay = false
      document.getElementById('loading').style.display = 'none'
    },
    [types.SET_LAYOUT] (state, { layout }) {
      state.layout = layout
    },
    [types.SET_PROFILE] (state, { profile }) {
      state.profile = profile
    },
    [types.SET_TOKEN] (state, { token }) {
      state.token = token
      Cookie.set('token', token)
    },
    [types.SET_PERMISSION] (state, permissions) {
      state.currentPermissions = permissions
    },
    [types.LOG_OUT] (state) {
      state.token = null
      state.profile = null
      Cookie.remove('token')
    },
    setMapInit (state, payload) {
      state.mapInit = payload
    },
    [types.SET_APP_UPDATE_TIME] (state, data) {
      state.previewUpdateTime = data.preview
      state.productionUpdateTime = data.production
    }
  }
})
