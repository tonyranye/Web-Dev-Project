import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'


const activities = ref([])
const loading = ref(false)
const error = ref(null)

export function useActivity() {

  // Fetch 
  async function fetchActivities(range = 'daily') {
    loading.value = true
    error.value = null

    const now = new Date()
    let from

    if (range === 'daily') {
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    } else if (range === 'weekly') {
      const day = now.getDay()
      from = new Date(now - day * 86400000)
      from.setHours(0, 0, 0, 0)
      from = from.toISOString()
    } else {
      from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    }

    const { data, error: err } = await supabase
      .from('activities')
      .select('*')
      .gte('created_at', from)
      .order('created_at', { ascending: false })

    if (err) {
      error.value = 'Failed to load activities. Please try again.'
      console.error('fetchActivities:', err.message)
    } else {
      activities.value = data
    }

    loading.value = false
  }

  // Insert
  async function logActivity(form) {
    error.value = null

    const validation = validateForm(form)
    if (!validation.valid) {
      error.value = validation.message
      return false
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      error.value = 'You must be logged in to log an activity.'
      return false
    }

    const payload = {
      user_id: user.id,  
      activity_name: form.name,
      activity_type: form.category,
      duration: parseInt(form.duration),
      calories: form.calories ? parseInt(form.calories) : null,
      created_at: new Date().toISOString()
    }

    const { data, error: err } = await supabase
      .from('activities')
      .insert(payload)
      .select()
      .single()

    if (err) {
      error.value = 'Could not save activity. Please try again.'
      console.error('logActivity:', err.message)
      return false
    }

    activities.value.unshift(data)
    return true
  }

  // Delete
  async function deleteActivity(id) {
    error.value = null

    const { error: err } = await supabase
      .from('activities')
      .delete()
      .eq('activity_id', id)

    if (err) {
      error.value = 'Could not delete activity. Please try again.'
      console.error('deleteActivity:', err.message)
      return false
    }

    activities.value = activities.value.filter(a => a.activity_id !== id)
    return true
  }

  //  Validation 
  function validateForm(form) {
    if (!form.name || !form.name.trim()) {
      return { valid: false, message: 'Activity name is required.' }
    }
    if (form.name.trim().length > 100) {
      return { valid: false, message: 'Activity name must be under 100 characters.' }
    }
    if (!form.category) {
      return { valid: false, message: 'Please select a category.' }
    }
    if (!form.duration || isNaN(form.duration) || parseInt(form.duration) <= 0) {
      return { valid: false, message: 'Duration must be a positive number.' }
    }
    if (parseInt(form.duration) > 1440) {
      return { valid: false, message: 'Duration cannot exceed 1440 minutes (24 hours).' }
    }
    if (form.calories && (isNaN(form.calories) || parseInt(form.calories) < 0)) {
      return { valid: false, message: 'Calories must be a positive number.' }
    }
    if (form.calories && parseInt(form.calories) > 10000) {
      return { valid: false, message: 'Calories value seems too high. Please check.' }
    }
    if (form.notes && form.notes.length > 300) {
      return { valid: false, message: 'Notes must be under 300 characters.' }
    }
    return { valid: true }
  }

  //  Computed stats 
  const todayActivities = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return activities.value.filter(a => new Date(a.created_at) >= today)
  })

  const totalDuration = computed(() =>
    todayActivities.value.reduce((sum, a) => sum + (a.duration || 0), 0)
  )

  const totalCalories = computed(() =>
    todayActivities.value.reduce((sum, a) => sum + (a.calories || 0), 0)
  )

  const categoryBreakdown = computed(() => {
    const total = totalDuration.value || 1
    const groups = {}
    todayActivities.value.forEach(a => {
      groups[a.activity_type] = (groups[a.activity_type] || 0) + a.duration
    })
    return Object.entries(groups).map(([cat, mins]) => ({
      name: cat,
      minutes: mins,
      percent: Math.round((mins / total) * 100)
    })).sort((a, b) => b.percent - a.percent)
  })

  const weeklyData = computed(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const now = new Date()
    return days.map((label, i) => {
      const dayActivities = activities.value.filter(a => {
        const d = new Date(a.created_at)
        return d.getDay() === i
      })
      return {
        label,
        isToday: i === now.getDay(),
        duration: dayActivities.reduce((s, a) => s + a.duration, 0),
        calories: dayActivities.reduce((s, a) => s + (a.calories || 0), 0)
      }
    })
  })

  return {
    activities,
    loading,
    error,
    todayActivities,
    totalDuration,
    totalCalories,
    categoryBreakdown,
    weeklyData,
    fetchActivities,
    logActivity,
    deleteActivity
  }
}
