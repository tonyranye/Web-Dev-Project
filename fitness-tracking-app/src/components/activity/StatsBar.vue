<template>
  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-label">Activities</div>
      <div class="stat-val">{{ todayActivities.length }}</div>
      <div class="stat-sub">logged today</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Duration</div>
      <div class="stat-val">{{ formattedDuration }}</div>
      <div class="stat-sub">of {{ goalMinutes }}m goal</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Calories</div>
      <div class="stat-val">{{ totalCalories }}</div>
      <div class="stat-sub">kcal burned</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Streak</div>
      <div class="stat-val">{{ streak }} days</div>
      <div class="stat-sub">keep it up</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  todayActivities: { type: Array, default: () => [] },
  totalDuration:   { type: Number, default: 0 },
  totalCalories:   { type: Number, default: 0 },
  streak:          { type: Number, default: 0 },
  goalMinutes:     { type: Number, default: 120 }
})

const formattedDuration = computed(() => {
  const h = Math.floor(props.totalDuration / 60)
  const m = props.totalDuration % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
})
</script>

<style scoped>
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}
.stat-card {
  background: #2a2a2a;
  border: 1px solid #4ade80;
  border-radius: 8px;
  padding: 14px 16px;
}
.stat-label {
  font-size: 11px;
  color: #4ade80;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.stat-val {
  font-size: 22px;
  font-weight: 500;
  color: #fff;
  line-height: 1;
}
.stat-sub {
  font-size: 11px;
  color: #cec7c7;
  margin-top: 4px;
}
</style>
