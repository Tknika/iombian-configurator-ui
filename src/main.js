import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyDxn26nFwMbKU3PK8759M7b7kn7skMfOpo",
  authDomain: "iombian-configurator-tes-90623.firebaseapp.com",
  projectId: "iombian-configurator-tes-90623",
  storageBucket: "iombian-configurator-tes-90623.appspot.com",
  messagingSenderId: "526131974785",
  appId: "1:526131974785:web:b3f0cd80503a14745fb380"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const apiKey = firebaseConfig.apiKey;
export const projectId = firebaseConfig.projectId;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
