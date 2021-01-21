import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyDLoQVbGfi7fN-FQrlO9k8rPVX7G0w75Ks",
  authDomain: "iombian-configurator.firebaseapp.com",
  projectId: "iombian-configurator",
  storageBucket: "iombian-configurator.appspot.com",
  messagingSenderId: "594894421010",
  appId: "1:594894421010:web:03688fd63addc0acc02ccb",
  measurementId: "G-B4NNN1TW32"
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
