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
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // Public routes that don't require login
  const publicRoutes = ['/', '/login']

  // If route requires auth and user is not logged in → redirect to login
  if (!publicRoutes.includes(to.path) && !isAuthenticated) {
    return next('/login')
  }

  // If user is logged in and tries to go to login → redirect to profile
  if (to.path === '/login' && isAuthenticated) {
    return next('/profile')
  }

  next()
})

export default router
