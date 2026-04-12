import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '../views/homepage.vue'

const routes = [{ path: '/', component: Homepage }]

export default createRouter({
  history: createWebHistory(),
  routes,
})
