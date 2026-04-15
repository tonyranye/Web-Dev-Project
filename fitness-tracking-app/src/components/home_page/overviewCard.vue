<script setup>

// Importing and implementation of supabase db
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase.js'


// Importing and implementation of supabase db
// Props
const props = defineProps({
  stats: {
    type: Array,
    default: () => [
      { label: 'Name', value: '-' },
      { label: 'Calories', value: '-' , change: '-5%', arrow: 'down' },
    ]
  }
})

// Local reactive copy of stats (so we can modify it)
const localStats = ref([...props.stats])

const meal = ref(null)
const errorMessage = ref(null)






async function loadMostRecentMeal() {
  // get logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user)

  if (!user) {
    localStats.value[0].value = '-'
    localStats.value[1].value = '-'
    return
  }

  // fetch most recent meal
  const { data, error } = await supabase
    .from('meals')
    .select('name, calories, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    localStats.value[0].value = 'error'
    localStats.value[1].value = 'error'
    return
  } 

  localStats.value[0].value = data.name
  localStats.value[1].value = data.calories
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

.card{
  background: #1a2e1a;
  border-radius: 12px;
  border: #296b29 2px solid;
  padding: 20px 23px;
  display: flex;
  gap: 0;
}

.overview-item{
  flex: 1;
  padding: 0 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);;

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

