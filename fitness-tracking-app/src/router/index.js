import { createRouter, createWebHistory } from 'vue-router'

// Import your views
import Homepage from '../views/homepage.vue'
import FitnessTracker from '../views/fitness_tracker.vue'
import FoodTracker from '../views/food_tracker.vue'
import ProfilePage from '../views/profile_page.vue'

const routes = [
  { path: '/', component: Homepage },
  { path: '/workouts', component: FitnessTracker },
  { path: '/profile', component: ProfilePage },
  { path: '/food_tracker', component: FoodTracker },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
