<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { supabase } from '@/lib/supabase'
import Chart from 'chart.js/auto'

const mode = ref('calories')
const chartInstance = ref(null)
const bigNum = ref('0')
const trendLabel = ref('')
const canvasRef = ref(null)
const isLoading = ref(false)

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

async function fetchData(type) {
  const { data: { user } } = await supabase.auth.getUser()
  const today = new Date()
  const weekAgo = new Date(today - 7 * 86400000)
  const twoWeeksAgo = new Date(today - 14 * 86400000)

  if (type === 'calories') {
    const { data: current } = await supabase.from('meals')
      .select('created_at, calories')
      .eq('user_id', user.id)
      .gte('created_at', weekAgo.toISOString())
      .order('created_at')

    const { data: previous } = await supabase.from('meals')
      .select('created_at, calories')
      .eq('user_id', user.id)
      .gte('created_at', twoWeeksAgo.toISOString())
      .lt('created_at', weekAgo.toISOString())
      .order('created_at')

    return { current: current ?? [], previous: previous ?? [] }

  } else {
    const { data: current } = await supabase.from('activities')
      .select('created_at, activity_id')
      .eq('user_id', user.id)
      .gte('created_at', weekAgo.toISOString())
      .order('created_at')

    const { data: previous } = await supabase.from('activities')
      .select('created_at, activity_id')
      .eq('user_id', user.id)
      .gte('created_at', twoWeeksAgo.toISOString())
      .lt('created_at', weekAgo.toISOString())
      .order('created_at')

    return { current: current ?? [], previous: previous ?? [] }
  }
}

function groupByDay(rows, type) {
  const result = Array(7).fill(0)
  rows?.forEach(row => {
    const day = new Date(row.created_at).getDay()
    const i = day === 0 ? 6 : day - 1
    result[i] += type === 'calories' ? (row.calories ?? 0) : 1
  })
  return result
}

function calcTrend(current, previous) {
  const currTotal = current.reduce((a, b) => a + b, 0)
  const prevTotal = previous.reduce((a, b) => a + b, 0)
  if (prevTotal === 0) return { total: currTotal, pct: null }
  const pct = (((currTotal - prevTotal) / prevTotal) * 100).toFixed(1)
  return { total: currTotal, pct }
}

function buildGradient(ctx, color) {
  const g = ctx.createLinearGradient(0, 0, 0, 220)
  g.addColorStop(0, color + '55')
  g.addColorStop(1, color + '00')
  return g
}

async function initChart() {
  isLoading.value = true
  const { current, previous } = await fetchData(mode.value)
  const currentVals = groupByDay(current, mode.value)
  const previousVals = groupByDay(previous, mode.value)
  const { total, pct } = calcTrend(currentVals, previousVals)

  bigNum.value = mode.value === 'calories'
    ? total.toLocaleString() + ' kcal' : total + ' activities'
  trendLabel.value = pct !== null
    ? `${pct > 0 ? '+' : ''}${pct}% vs last week` : 'No previous data'

  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }

  const ctx = canvasRef.value.getContext('2d')
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        {
          label: 'This week', data: currentVals,
          borderColor: '#22c55e', borderWidth: 2.5,
          pointBackgroundColor: '#22c55e',
          pointRadius: currentVals.map((v, i, arr) => v === Math.max(...arr) ? 5 : 0),
          pointHoverRadius: 5, fill: true,
          backgroundColor: (ctx) => buildGradient(ctx.chart.ctx, '#22c55e'),
          tension: 0.45,
        },
        {
          label: 'Last week', data: previousVals,
          borderColor: '#ef4444', borderWidth: 1.5,
          pointRadius: 0, pointHoverRadius: 4, fill: true,
          backgroundColor: (ctx) => buildGradient(ctx.chart.ctx, '#ef4444'),
          tension: 0.45,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1c1f27', borderColor: '#2d3139',
          borderWidth: 1, titleColor: '#9ca3af', bodyColor: '#fff', padding: 10,
        },
      },
      scales: {
        x: { grid: { color: '#1e2228' }, ticks: { color: '#9ca3af', font: { size: 11 } }, border: { display: false } },
        y: { grid: { color: '#1e2228' }, ticks: { color: '#9ca3af', font: { size: 11 }, maxTicksLimit: 5 }, border: { display: false } },
      },
    },
  })
  isLoading.value = false
}

watch(mode, () => initChart())

onMounted(initChart)
onBeforeUnmount(() => chartInstance.value?.destroy())
</script>

<template>
  <div class="graph-inner">
    <div class="graph-header">
      <div>
        <div class="graph-label">Weekly trend</div>
        <div class="big-num">{{ bigNum }}</div>
        <div class="trend-badge"><span class="trend-dot" />{{ trendLabel }}</div>
      </div>
      <div class="toggle-group">
        <button :class="['toggle-btn', mode === 'calories' ? 'active' : '']" @click="mode = 'calories'">Calories</button>
        <button :class="['toggle-btn', mode === 'activities' ? 'active' : '']" @click="mode = 'activities'">Activities</button>
      </div>
    </div>
    <div class="chart-wrap">
      <canvas ref="canvasRef" aria-label="Weekly trend chart" role="img" />
    </div>
    <div class="legend">
      <span class="legend-item"><span class="legend-dot green" />This week</span>
      <span class="legend-item"><span class="legend-dot red" />Last week</span>
    </div>
  </div>
</template>

<style scoped>
.graph-inner { display: flex; flex-direction: column; gap: 12px;}
.graph-header { display: flex; justify-content: space-between; align-items: flex-start; }
.graph-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
.big-num { font-size: 32px; font-weight: 500; color: #fff; margin: 4px 0 2px; }
.trend-badge { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #22c55e; }
.trend-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }
.toggle-group { display: flex; gap: 4px; background: #0f1a0f; border-radius: 8px; padding: 3px; }
.toggle-btn { font-size: 12px; padding: 4px 12px; border-radius: 6px; border: none; cursor: pointer; color: #6b7280; background: transparent; transition: all 0.2s; }
.toggle-btn.active { background: #22c55e; color: #0a0f0d; font-weight: 500; }
.chart-wrap { position: relative; min-height: 150px; width: 100%; }
.legend { display: flex; gap: 16px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #9ca3af; }
.legend-dot { width: 10px; height: 10px; border-radius: 2px; }
.legend-dot.green { background: #22c55e; }
.legend-dot.red { background: #ef4444; }
</style>