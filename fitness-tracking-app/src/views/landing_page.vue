<template>
  <div class="landing">
    <svg class="bg-svg" ref="svgRef" />
    <div class="grid-overlay" />
    <div class="content">
      <div class="logo-mark">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6" />
          <circle cx="18" cy="18" r="6" fill="#22c55e" opacity="0.9" />
          <line x1="18" y1="2" x2="18" y2="12" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" />
          <line x1="18" y1="24" x2="18" y2="34" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" />
          <line x1="2" y1="18" x2="12" y2="18" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" />
          <line x1="24" y1="18" x2="34" y2="18" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
      <h1 class="title">Fitness<span class="accent">Tracker</span></h1>
      <p class="slogan">insert slogan here</p>
      <div class="divider" />
      <div class="auth-section">
        <p class="auth-prompt">Have an account?</p>
        <button class="btn btn-primary" @click="goTo('login')">Sign In</button>
        <p class="auth-prompt new">New?</p>
        <button class="btn btn-outline" @click="goTo('signup')">Create an Account</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'

const NODE_COUNT = 28
const PULSE_INTERVAL = 1800

export default {
  name: 'LandingPage',

  data() {
    return {
      simulation: null,
      pulseTimer: null,
    }
  },

  mounted() {
    this.initD3()
    window.addEventListener('resize', this.onResize)
  },

  beforeUnmount() {
    if (this.simulation) this.simulation.stop()
    if (this.pulseTimer) clearInterval(this.pulseTimer)
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    goTo(mode) {
      this.$router.push({ path: '/login', query: { mode } })
    },

    onResize() {
      const svg = this.$refs.svgRef
      if (!svg) return
      d3.select(svg).selectAll('*').remove()
      this.initD3()
    },

    initD3() {
      const svg = this.$refs.svgRef
      if (!svg) return

      const W = window.innerWidth
      const H = window.innerHeight

      const root = d3.select(svg)
        .attr('width', W)
        .attr('height', H)

      // D3
      const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
        id: i,
        r: i < 4 ? 6 : i < 10 ? 3.5 : 2,
        x: Math.random() * W,
        y: Math.random() * H,
      }))

      const links = []
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return
          const dx = a.x - b.x
          const dy = a.y - b.y
          if (Math.sqrt(dx * dx + dy * dy) < W * 0.22) {
            links.push({ source: i, target: j })
          }
        })
      })

      this.simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(d => 90 + Math.random() * 60).strength(0.3))
        .force('charge', d3.forceManyBody().strength(-60))
        .force('center', d3.forceCenter(W / 2, H / 2).strength(0.05))
        .force('collide', d3.forceCollide(d => d.r + 18))
        .alphaDecay(0.012)

      // SVG (connected to d3 data)
      const linkSel = root.append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', 'rgba(34,197,94,0.10)')
        .attr('stroke-width', 0.8)

      const nodeSel = root.append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', d => d.r)
        .attr('fill', d => d.r > 5 ? '#22c55e' : d.r > 3 ? 'rgba(34,197,94,0.6)' : 'rgba(34,197,94,0.35)')
        .attr('stroke', d => d.r > 5 ? 'rgba(34,197,94,0.4)' : 'none')
        .attr('stroke-width', 6)

      this.simulation.on('tick', () => {
        linkSel
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)

        nodeSel
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
      })
      const hubNodes = nodes.filter(n => n.r > 5)

      const doPulse = () => {
        const target = hubNodes[Math.floor(Math.random() * hubNodes.length)]

        // ripple ring
        root.append('circle')
          .attr('cx', target.x)
          .attr('cy', target.y)
          .attr('r', target.r)
          .attr('fill', 'none')
          .attr('stroke', '#22c55e')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.9)
          .transition()
          .duration(1200)
          .ease(d3.easeCubicOut)
          .attr('r', target.r + 40)
          .attr('opacity', 0)
          .remove()

        // light up connected edges
        linkSel
          .filter(d => d.source.id === target.id || d.target.id === target.id)
          .transition()
          .duration(300)
          .attr('stroke', 'rgba(34,197,94,0.55)')
          .attr('stroke-width', 1.5)
          .transition()
          .duration(900)
          .attr('stroke', 'rgba(34,197,94,0.10)')
          .attr('stroke-width', 0.8)
      }

      // stagger first pulse slightly so it doesn't fire instantly
      setTimeout(() => {
        doPulse()
        this.pulseTimer = setInterval(doPulse, PULSE_INTERVAL)
      }, 600)
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@300;400;500&display=swap');

.landing {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #060d06;
  font-family: 'Inter', sans-serif;
}

/* D3 SVG sits behind everything */
.bg-svg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 255, 100, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 100, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  z-index: 1;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 40px 32px;
  background: rgba(6, 18, 6, 0.72);
  border: 1px solid rgba(0, 255, 100, 0.14);
  border-radius: 24px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  max-width: 420px;
  width: 90%;
  animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.logo-mark {
  animation: spin 18s linear infinite;
  opacity: 0.85;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.title {
  font-family: 'Syne', sans-serif;
  font-size: 48px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.accent {
  color: #22c55e;
  display: block;
}

.slogan {
  font-size: 14px;
  color: #5a7a5a;
  line-height: 1.6;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.03em;
}

.divider {
  width: 48px;
  height: 1px;
  background: rgba(34, 197, 94, 0.3);
  margin: 8px 0;
}

.auth-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.auth-prompt {
  font-size: 13px;
  color: #3d5c3d;
  margin: 4px 0 0;
}

.auth-prompt.new {
  margin-top: 12px;
}

.btn {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background: #22c55e;
  color: #030a03;
  border: none;
  font-weight: 500;
}

.btn-primary:hover {
  background: #16a34a;
  box-shadow: 0 0 18px rgba(34, 197, 94, 0.3);
}

.btn-outline {
  background: transparent;
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.btn-outline:hover {
  background: rgba(34, 197, 94, 0.06);
  border-color: rgba(34, 197, 94, 0.5);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>