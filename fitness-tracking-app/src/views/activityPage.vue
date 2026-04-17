<template>
  <div class="page">
    <div class="page-hd">
      <div>
        <h1 class="page-title">Activity Tracker</h1>
        <p class="page-sub">Log and track your daily physical activity</p>
      </div>
      <div class="range-toggle">
        <button
          v-for="r in ranges"
          :key="r.value"
          :class="['range-btn', range === r.value ? 'on' : '']"
          @click="switchRange(r.value)"
        >
          {{ r.label }}
        </button>
      </div>
    </div>

    <div v-if="error" class="global-error">{{ error }}</div>
    <div v-if="loading" class="loading">Loading activities...</div>

    <template v-else>
      <StatsBar
        :today-activities="todayActivities"
        :total-duration="totalDuration"
        :total-calories="totalCalories"
        :streak="streak"
      />

      <div class="main-row">
        <div class="left-col">
          <WeeklyChart :weekly-data="weeklyData" />
          <CategoryBreakdown :breakdown="categoryBreakdown" />
        </div>
        <div class="right-col">
          <LogForm @submitted="handleSubmit" />
          <ActivityLog
            :activities="todayActivities"
            @delete="handleDelete"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useActivity } from '@/composables/useActivity'
import StatsBar from '@/components/activity/StatsBar.vue'
import WeeklyChart from '@/components/activity/WeeklyChart.vue'
import CategoryBreakdown from '@/components/activity/CategoryBreakdown.vue'
import LogForm from '@/components/activity/LogForm.vue'
import ActivityLog from '@/components/activity/ActivityLog.vue'

const {
  loading, error,
  todayActivities, totalDuration, totalCalories,
  categoryBreakdown, weeklyData,
  fetchActivities, logActivity, deleteActivity
} = useActivity()

const range = ref('daily')
const streak = ref(0)

const ranges = [
  { label: 'Daily',   value: 'daily'   },
  { label: 'Weekly',  value: 'weekly'  },
  { label: 'Monthly', value: 'monthly' }
]

async function switchRange(val) {
  range.value = val
  await fetchActivities(val)
}

async function handleSubmit(form) {
  return await logActivity(form)
}

async function handleDelete(id) {
  await deleteActivity(id)
}

onMounted(() => fetchActivities('daily'))
</script>

<style scoped>
.page {
  padding: 28px;
  min-height: 100vh;
  background: #1a1a1a;
  color: #fff;
  box-sizing: border-box;
}
.page-hd {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-title { font-size: 22px; font-weight: 600; color: #4ade80; margin-bottom: 4px; }
.page-sub { font-size: 13px; color: #efd9d9; }
.range-toggle { display: flex; gap: 6px; }
.range-btn {
  font-size: 13px;
  padding: 6px 16px;
  border-radius: 6px;
  border: 1px solid #2a2a2a;
  background: #2a2a2a;
  color: #aaa;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.range-btn.on {
  background: #4ade80;
  color: #111;
  border-color: #4ade80;
  font-weight: 600;
}
.global-error {
  font-size: 13px;
  color: #ef4444;
  background: #2a0d0d;
  border: 1px solid #4a1a1a;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 16px;
}
.loading { font-size: 13px; color: #555; padding: 20px 0; }
.main-row {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
}
.left-col { display: flex; flex-direction: column; gap: 16px; }
.right-col { display: flex; flex-direction: column; gap: 16px; }
</style>
