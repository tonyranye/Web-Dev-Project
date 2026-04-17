<template>
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Today's log</span>
      <span class="entry-count">{{ activities.length }} {{ activities.length === 1 ? 'entry' : 'entries' }}</span>
    </div>

    <div v-if="activities.length === 0" class="empty">
      No activities logged yet. Start by adding one!
    </div>

    <div v-else class="log-list">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="log-item"
      >
        <div class="log-dot" :style="{ background: colorFor(activity.category) }"></div>
        <div class="log-info">
          <div class="log-top">
            <span class="log-name">{{ activity.name }}</span>
            <span class="badge" :class="badgeClass(activity.category)">{{ activity.category }}</span>
          </div>
          <span class="log-meta">{{ formatTime(activity.logged_at) }} · {{ activity.duration_minutes }} min</span>
        </div>
        <div class="log-right">
          <span v-if="activity.calories" class="log-kcal">{{ activity.calories }} kcal</span>
          <button class="del-btn" :disabled="deleting === activity.id" @click="handleDelete(activity.id)">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  activities: { type: Array, default: () => [] }
})
const emit = defineEmits(['delete'])

const deleting = ref(null)

async function handleDelete(id) {
  deleting.value = id
  await emit('delete', id)
  deleting.value = null
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })
}

const COLORS = {
  Cardio: '#4ade80',
  Strength: '#60a5fa',
  'Flexibility / Stretch': '#f59e0b',
  Sports: '#f472b6',
  Other: '#a78bfa'
}

function colorFor(cat) { return COLORS[cat] || '#888' }

function badgeClass(cat) {
  const map = {
    Cardio: 'b-cardio',
    Strength: 'b-strength',
    'Flexibility / Stretch': 'b-stretch',
    Sports: 'b-sports',
    Other: 'b-other'
  }
  return map[cat] || 'b-other'
}
</script>

<style scoped>
.card {
  background: #2a2a2a;
  border: 1px solid #4ade80;
  border-radius: 8px;
  padding: 16px;
}
.card-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.card-title {
  font-size: 11px;
  color: #4ade80;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.entry-count { font-size: 11px; color: #ab8b8b; }
.empty { font-size: 12px; color: #efd9d9; }
.log-list { display: flex; flex-direction: column; gap: 7px; }
.log-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  background: #1a1a1a;
  border: 1px solid #4ade80;
  border-radius: 6px;
}
.log-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.log-info { flex: 1; min-width: 0; }
.log-top { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.log-name { font-size: 12px; font-weight: 500; color: #ddd; }
.log-meta { font-size: 11px; color: #efd9d9; }
.log-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.log-kcal { font-size: 11px; color: #4ade80; }
.del-btn {
  background: transparent;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 3px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.del-btn:hover { color: #ef4444; }
.del-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.badge { font-size: 10px; padding: 2px 7px; border-radius: 20px; }
.b-cardio   { background: #2a2a2a; color: #4ade80; border: 1px solid #4ade80; }
.b-strength { background: #0d1a2a; color: #60a5fa; border: 1px solid #1a2a3a; }
.b-stretch  { background: #2a1f0a; color: #f59e0b; border: 1px solid #3a2a0a; }
.b-sports   { background: #2a0d1f; color: #f472b6; border: 1px solid #3a1a2a; }
.b-other    { background: #1a1a2a; color: #a78bfa; border: 1px solid #2a2a3a; }
</style>
