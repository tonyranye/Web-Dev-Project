<script setup>

// Importing and implementation of supabase db
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase.js'


// Importing and implementation of supabase db
// Props
const props = defineProps({
  stats: {
    type: Array,
    default: () => [
      { label: 'Most Recent Meal', value: '-' },
      { label: 'Calories', value: '-' , change: '-5%', arrow: 'down' },
      {label: 'Logged', value: '-'},
    ]
  }
})

// Local reactive copy of stats (so we can modify it)
const localStats = ref([...props.stats])
const meal = ref(null)
const errorMessage = ref(null)


function getTimeAgo(dateString) {
  const pastDate = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.abs(Math.floor((now - pastDate) / 1000)) // ✅ abs fixes negative

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  return `${diffInHours} hours ago`
}



async function loadMostRecentMeal() {
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user)

  if (!user) {
    console.log("No user is currently logged in.");
    return
  }

  const { data, error } = await supabase
      .from('meals')
      .select('name, calories, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

  if (error) {
    console.error("Supabase Error:", error.message, error.details);
    return
  }

  if (error || !data) {
    localStats.value[0].value = 'error'
    localStats.value[1].value = 'error'
    localStats.value[2].value = 'error'
    return // Keeps the default '-' values
  }

  // 3. Assign the values to all three slots
  localStats.value[0].value = data.name
  localStats.value[1].value = data.calories
  localStats.value[2].value = getTimeAgo(data.created_at) // Passes the timestamp to the helper
}

onMounted(() => {
  loadMostRecentMeal()
})


</script>

<template>
  <div class="overview-card">
    <div v-for="(stat, index) in localStats"
         :key="index"
         class="overview-item"
    >
      <p class="label">{{ stat.label }}</p>
      <p class="value"> {{stat.value}}</p>
      <span class="change" :class="stat.arrow">
        <span class="arrow"></span>
        {{ stat.change }}
      </span>
    </div>
  </div>
</template>








<style scoped>



.overview-card{
  display: flex;
  align-items: center;
}

.overview-item{
  padding: 0 20px;
  border-right: 3px solid rgba(255, 255, 255, 0.1);;
}

.overview-item:first-child { padding-left: 0; }
.overview-item:last-child  { border-right: none; }

.label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 6px;
}

.value {
  font-size: 26px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
}

.change {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 6px;
}

.change.up {
  background: rgba(29, 158, 117, 0.2);
  color: #5dcaa5;
}

.change.down {
  background: rgba(226, 75, 74, 0.2);
  color: #f09595;
}

.change.up .arrow::before   { content: "▲"; font-size: 9px; }
.change.down .arrow::before { content: "▼"; font-size: 9px; }
</style>

