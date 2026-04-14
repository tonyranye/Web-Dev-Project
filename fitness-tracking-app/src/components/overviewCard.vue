<script setup>

defineProps({
  stats: {
    type: Array,
    default: () => [
      {label: 'Steps', value: 100, change: '+12%', arrow: 'up'},
      {label: 'Heart Rate', value: 75, change: '-5%', arrow: 'down'},
      {label: 'Sleep', value: 8, change: '+10%', arrow: 'up'}
    ]
  }
})

</script>

<template>
  <div class="card">
    <div v-for="(stat, index) in stats"
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

