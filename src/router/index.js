import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';
import Devices from '../views/Devices.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/',
    name: 'Devices',
    component: Devices,
    beforeEnter: guard
  },
]

function guard(to, from, next) {
  if (store.state.user.id) {
    next();
  } else {
    next('/sign-in');
  }
}

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes
})

export default router
