import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Homepage from '../views/Homepage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Homepage',
    name: 'Homepage',
    component: Homepage
  }
]

const router = new VueRouter({
  routes
})

export default router
