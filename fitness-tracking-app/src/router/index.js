import { createRouter, createWebHistory } from 'vue-router'
import { supabase} from '../lib/supabase'

// Import your views
import Homepage from '../views/homepage.vue'
import FitnessTracker from '../views/fitness_tracker.vue'
import FoodTracker from '../views/food_tracker.vue'
import ProfilePage from '../views/profile_page.vue'
import LoginSignup from '../views/LoginSignup.vue'

const routes = [
  { path: '/', component: Homepage },
  { path: '/workouts', component: FitnessTracker },
  { path: '/profile', component: ProfilePage },
  { path: '/food_tracker', component: FoodTracker },
  { path: '/login', component: LoginSignup },
  { path: '/logout', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach(async (to, from, next) => {
  const user = await supabase.auth.getSession()
  const isAuthenticated = user.data.session !== null
  if (to.path === '/login' && isAuthenticated) {
    next('/profile')
  } else if (to.path !== '/login' && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
export default router
