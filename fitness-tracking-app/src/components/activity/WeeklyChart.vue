<template>
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Weekly overview</span>
      <div class="tog-group">
        <button :class="['tog', metric === 'duration' ? 'on' : '']" @click="metric = 'duration'">Duration</button>
        <button :class="['tog', metric === 'calories' ? 'on' : '']" @click="metric = 'calories'">Calories</button>
      </div>
    </div>
    <svg ref="svgEl" class="chart-svg"></svg>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  weeklyData: { type: Array, default: () => [] }
})

const svgEl = ref(null)
const metric = ref('duration')

function draw() {
  if (!svgEl.value || !props.weeklyData.length) return

  const el = svgEl.value
  const W = el.parentElement.clientWidth || 400
  const H = 130
  const marginLeft = 36
  const marginBottom = 20
  const marginTop = 8
  const innerW = W - marginLeft
  const innerH = H - marginBottom - marginTop

  d3.select(el).selectAll('*').remove()

  const svg = d3.select(el)
    .attr('width', W)
    .attr('height', H)

  const data = props.weeklyData
  const values = data.map(d => d[metric.value])
  const maxVal = d3.max(values) || 1

  // y axis
  const yScale = d3.scaleLinear().domain([0, maxVal * 1.15]).range([innerH, 0])
  const yTicks = yScale.ticks(3)

  const g = svg.append('g').attr('transform', `translate(${marginLeft}, ${marginTop})`)

  // gridlines
  g.selectAll('.grid')
    .data(yTicks)
    .enter().append('line')
    .attr('class', 'grid')
    .attr('x1', 0).attr('x2', innerW)
    .attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
    .attr('stroke', '#1a3a1a').attr('stroke-width', 0.5)

  // y tick labels
  g.selectAll('.ytick')
    .data(yTicks)
    .enter().append('text')
    .attr('class', 'ytick')
    .attr('x', -6)
    .attr('y', d => yScale(d) + 4)
    .attr('text-anchor', 'end')
    .attr('fill', '#999')
    .attr('font-size', 10)
    .text(d => metric.value === 'duration' ? `${d}m` : d)

  // bars
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, innerW])
    .padding(0.25)

  g.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.label))
    .attr('y', d => yScale(d[metric.value]))
    .attr('width', xScale.bandwidth())
    .attr('height', d => innerH - yScale(d[metric.value]))
    .attr('rx', 3)
    .attr('fill', d => d.isToday ? '#4ade80' : '#999')

  // today highlight outline
  g.selectAll('.bar-outline')
    .data(data.filter(d => d.isToday))
    .enter().append('rect')
    .attr('x', d => xScale(d.label))
    .attr('y', d => yScale(d[metric.value]))
    .attr('width', xScale.bandwidth())
    .attr('height', d => innerH - yScale(d[metric.value]))
    .attr('rx', 3)
    .attr('fill', 'none')
    .attr('stroke', '#166534')
    .attr('stroke-width', 1)

  // x labels for graph
  g.selectAll('.xlabel')
    .data(data)
    .enter().append('text')
    .attr('class', 'xlabel')
    .attr('x', d => xScale(d.label) + xScale.bandwidth() / 2)
    .attr('y', innerH + 14)
    .attr('text-anchor', 'middle')
    .attr('fill', d => d.isToday ? '#4ade80' : '#555')
    .attr('font-size', 10)
    .attr('font-weight', d => d.isToday ? 500 : 400)
    .text(d => d.label)
}

watch([() => props.weeklyData, metric], () => nextTick(draw))
onMounted(() => nextTick(draw))
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
.tog-group { display: flex; gap: 4px; }
.tog {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid #4ade80;
  background: transparent;
  color: #666;
  cursor: pointer;
  font-family: inherit;
}
.tog.on {
  background: #444;
  color: #4ade80;
  border-color: #2a5a2a;
}
.chart-svg { display: block; width: 100%; }
</style>
