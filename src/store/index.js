import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import user from './modules/user';
import deviceServices from './modules/deviceServices';
import marketplaceServices from './modules/marketplaceServices';
import {vuexfireMutations} from 'vuexfire';

const vuexLocal = new VuexPersist({
  storage: window.localStorage
});

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
    ...vuexfireMutations
  },
  actions: {
  },
  modules: {
    user,
	deviceServices,
	marketplaceServices,
  },
  plugins: [vuexLocal.plugin],
})
