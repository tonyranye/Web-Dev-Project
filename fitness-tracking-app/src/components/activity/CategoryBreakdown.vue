<template>
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Category breakdown</span>
    </div>
    <div v-if="breakdown.length === 0" class="empty">
      No activities logged yet today.
    </div>
    <div v-else class="prog-list">
      <div v-for="item in breakdown" :key="item.name" class="prog-item">
        <div class="prog-lbl">
          <span>{{ item.name }}</span>
          <span :style="{ color: colorFor(item.name) }">{{ item.percent }}%</span>
        </div>
        <div class="prog-bg">
          <div class="prog-fill" :style="{ width: item.percent + '%', background: colorFor(item.name) }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  breakdown: { type: Array, default: () => [] }
})

const COLORS = {
  Cardio: '#4ade80',
  Strength: '#60a5fa',
  'Flexibility / Stretch': '#f59e0b',
  Sports: '#f472b6',
  Other: '#a78bfa'
}

function colorFor(name) {
  return COLORS[name] || '#888'
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
.empty { font-size: 12px; color: #555; }
.prog-list { display: flex; flex-direction: column; gap: 12px; }
.prog-item {}
.prog-lbl {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #aaa;
  margin-bottom: 5px;
}
.prog-bg {
  height: 5px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
}
.prog-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}
</style>
