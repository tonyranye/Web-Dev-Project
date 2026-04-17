import { createRouter, createWebHistory } from 'vue-router'
import { supabase} from '../lib/supabase'

// Import your views
import Homepage from '../views/homepage.vue'
import FitnessTracker from '../views/fitness_tracker.vue'
import FoodTracker from '../views/food_tracker.vue'
import ProfilePage from '../views/profile_page.vue'
import LoginSignup from '../views/LoginSignup.vue'
import LandingPage from '../views/landing_page.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/workouts', component: FitnessTracker },
  { path: '/profile', component: ProfilePage },
  { path: '/food_tracker', component: FoodTracker },
  { path: '/login', component: LoginSignup },
  { path: '/logout', redirect: '/login' },
  { path: '/home', component: Homepage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  const publicRoutes = ['/', '/login']

  if (!publicRoutes.includes(to.path) && !isAuthenticated) {
    return '/login'
  }

  if (to.path === '/login' && isAuthenticated) {
    return '/profile'
  }

  if (to.path === '/' && isAuthenticated) {
    return next('/home')
  }

  next()
})

export default router
