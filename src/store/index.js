import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations: {
    SET_ROUTEPATHLIST(state, val) {
      state.routePathList = val
    },
    SET_NAVPATHLIST(state, val) {
      state.navPathList = val
    },
    SET_AREAPATHLIST(state, val) {
      state.areaPathList = val;
    },
    SET_AREAPATH(state, val) {
      state.areaPath = val;
    },
    SET_CGFSELECTDATA(state, val) {
      state.CGFSelectData = val;
    }
  },
  actions: {
    updateRoutePathList({
      commit
    }, data) {
      commit('SET_ROUTEPATHLIST', data);
    },
    updateNavPathList({
      commit
    }, data) {
      commit('SET_NAVPATHLIST', data);
    },
    updateAreaPathList({
      commit
    }, data) {
      commit('SET_AREAPATHLIST', data);
    },
    updateAreaPath({
      commit
    }, data) {
      commit('SET_AREAPATH', data);
    },
    updateCGFSelectData({
      commit
    }, data) {
      commit('SET_CGFSELECTDATA', data);
    }
  },
  modules: {},
  getters: {
    getRoutePathList: state => {
      return state.routePathList;
    },
    getNavPathList: state => {
      return state.navPathList;
    },
    getAreaPathList: state => {
      return state.areaPathList;
    },
    getAreaPath: state => {
      return state.areaPath;
    },
    getCGFSelectData: state => {
      return state.CGFSelectData;
    },
  }

})