<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase.js'

// State
const meals       = ref([])
const loading     = ref(true)
const calorieGoal = ref(2000)          // default; user can edit inline
const editingGoal = ref(false)
const goalInput   = ref(2000)

// Derived
const totalCalories = computed(() =>
  meals.value.reduce((sum, m) => sum + (m.calories ?? 0), 0)
)

const progressPct = computed(() =>
  Math.min((totalCalories.value / calorieGoal.value) * 100, 100)
)

const remaining = computed(() =>
  Math.max(calorieGoal.value - totalCalories.value, 0)
)

const overGoal = computed(() => totalCalories.value > calorieGoal.value)

// Bar colour shifts: green -> amber -> red
const barColor = computed(() => {
  const pct = progressPct.value
  if (pct < 70)  return '#22c55e'
  if (pct < 90)  return '#f59e0b'
  return '#22C55EFF'
})

// Data fetching
async function loadTodayMeals() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const todayEnd   = new Date(); todayEnd.setHours(23, 59, 59, 999)

  const { data, error } = await supabase
    .from('meals')
    .select('meal_id, name, calories, mealtime, created_at')
    .eq('user_id', user.id)
    .gte('created_at', todayStart.toISOString())
    .lte('created_at', todayEnd.toISOString())
    .order('created_at', { ascending: true })

  if (error) { console.error(error.message); return }
  meals.value = data ?? []
  loading.value = false
}

// Goal editing
function openGoalEdit() {
  goalInput.value = calorieGoal.value
  editingGoal.value = true
}

function saveGoal() {
  const val = parseInt(goalInput.value)
  if (!isNaN(val) && val > 0) calorieGoal.value = val
  editingGoal.value = false
}

function cancelGoal() { editingGoal.value = false }

// Meal type label map
const mealTypeLabel = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }

onMounted(() => loadTodayMeals())
</script>

<template>
  <div class="ct-root">
    <!-- Header -->
    <div class="ct-header">
      <span class="ct-title">Calorie Tracker</span>
      <span class="ct-date">{{ new Date().toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' }) }}</span>
    </div>

    <div v-if="loading" class="ct-loading">Loading meals…</div>

    <template v-else>
      <!-- Progress ring + numbers -->
      <div class="ct-summary">
        <!-- Circular progress -->
        <div class="ct-ring-wrap">
          <svg class="ct-ring" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <!-- track -->
            <circle cx="60" cy="60" r="50"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              stroke-width="10" />
            <!-- fill -->
            <circle cx="60" cy="60" r="50"
              fill="none"
              :stroke="barColor"
              stroke-width="10"
              stroke-linecap="round"
              stroke-dasharray="314.16"
              :stroke-dashoffset="314.16 - (314.16 * progressPct / 100)"
              transform="rotate(-90 60 60)"
              class="ct-arc" />
          </svg>
          <div class="ct-ring-center">
            <span class="ct-ring-pct">{{ Math.round(progressPct) }}<small>%</small></span>
          </div>
        </div>

        <!-- Stats -->
        <div class="ct-stats">
          <div class="ct-stat">
            <span class="ct-stat-val" :style="{ color: barColor }">{{ totalCalories.toLocaleString() }}</span>
            <span class="ct-stat-lbl">consumed</span>
          </div>
          <div class="ct-divider"></div>
          <div class="ct-stat">
            <span class="ct-stat-val">
              <template v-if="overGoal">
                <span class="over-tag">+{{ (totalCalories - calorieGoal).toLocaleString() }}</span>
              </template>
              <template v-else>{{ remaining.toLocaleString() }}</template>
            </span>
            <span class="ct-stat-lbl">{{ overGoal ? 'over goal' : 'remaining' }}</span>
          </div>
          <div class="ct-divider"></div>
          <div class="ct-stat ct-stat--goal" @click="openGoalEdit">
            <template v-if="editingGoal">
              <input
                class="ct-goal-input"
                type="number"
                v-model="goalInput"
                min="1"
                @keyup.enter="saveGoal"
                @keyup.escape="cancelGoal"
                @click.stop
                autofocus
              />
              <div class="ct-goal-actions">
                <button class="ct-goal-save" @click.stop="saveGoal">✓</button>
                <button class="ct-goal-cancel" @click.stop="cancelGoal">✕</button>
              </div>
            </template>
            <template v-else>
              <span class="ct-stat-val">{{ calorieGoal.toLocaleString() }}</span>
              <span class="ct-stat-lbl">goal <span class="ct-edit-hint">✎</span></span>
            </template>
          </div>
        </div>
      </div>

      <!-- Bar -->
      <div class="ct-bar-wrap">
        <div class="ct-bar-track">
          <div
            class="ct-bar-fill"
            :style="{ width: progressPct + '%', background: barColor }"
          ></div>
        </div>
        <span class="ct-bar-label" :style="{ color: barColor }">
          {{ progressPct.toFixed(1) }}% of daily goal
        </span>
      </div>

      <!-- Meal list -->
      <div class="ct-meals">
        <div v-if="meals.length === 0" class="ct-empty">
          No meals logged for today
        </div>
        <div
          v-for="meal in meals"
          :key="meal.meal_id"
          class="ct-meal-row"
        >
          <span class="ct-meal-icon">{{ mealTypeLabel[meal.mealtime] ?? '🍽️' }}</span>
          <span class="ct-meal-name">{{ meal.name }}</span>
          <span class="ct-meal-type">{{ meal.mealtime }}</span>
          <span class="ct-meal-cals">{{ (meal.calories ?? 0).toLocaleString() }} kcal</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Root  */
.ct-root {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(41, 107, 41, 0.25);
  border-radius: 16px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  color: #e5e7eb;
  font-family: inherit;
}

/* Header  */
.ct-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ct-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e5e7eb;
  letter-spacing: 0.01em;
}
.ct-date {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
}

/*Loading*/
.ct-loading {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
  text-align: center;
  padding: 20px 0;
}

/*  Summary row (ring + stats)  */
.ct-summary {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Ring */
.ct-ring-wrap {
  position: relative;
  flex-shrink: 0;
  width: 88px;
  height: 88px;
}
.ct-ring {
  width: 100%;
  height: 100%;
}
.ct-arc {
  transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              stroke 0.4s ease;
}
.ct-ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ct-ring-pct {
  font-size: 1.2rem;
  font-weight: 700;
  color: #e5e7eb;
  line-height: 1;
}
.ct-ring-pct small {
  font-size: 0.65rem;
  font-weight: 400;
  color: rgba(255,255,255,0.4);
}

/* Stats */
.ct-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  flex-wrap: wrap;
}
.ct-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}
.ct-stat--goal {
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}
.ct-stat--goal:hover { background: rgba(41,107,41,0.15); }
.ct-stat-val {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e5e7eb;
  line-height: 1;
  transition: color 0.3s;
}
.ct-stat-lbl {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.ct-edit-hint {
  font-size: 0.6rem;
  color: rgba(34, 197, 94, 0.5);
  margin-left: 2px;
}
.ct-divider {
  width: 1px;
  height: 32px;
  background: rgba(255,255,255,0.08);
  flex-shrink: 0;
}
.over-tag {
  color: #ef4444;
}

/* Goal inline edit */
.ct-goal-input {
  width: 80px;
  background: rgba(255,255,255,0.05);
  border: 1px solid #296b29;
  border-radius: 6px;
  color: #e5e7eb;
  font-size: 0.9rem;
  padding: 4px 8px;
  outline: none;
}
.ct-goal-input:focus { border-color: #22c55e; }
.ct-goal-actions {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}
.ct-goal-save,
.ct-goal-cancel {
  background: none;
  border: 1px solid rgba(255,255,255,0.15);
  color: #e5e7eb;
  border-radius: 4px;
  padding: 2px 7px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.15s;
}
.ct-goal-save:hover  { background: rgba(34,197,94,0.15); border-color: #22c55e; color: #22c55e; }
.ct-goal-cancel:hover { background: rgba(239,68,68,0.1); border-color: #ef4444; color: #ef4444; }

/*  Progress bar */
.ct-bar-wrap { display: flex; flex-direction: column; gap: 6px; }
.ct-bar-track {
  width: 100%;
  height: 7px;
  background: rgba(255,255,255,0.06);
  border-radius: 99px;
  overflow: hidden;
}
.ct-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease;
}
.ct-bar-label {
  font-size: 0.72rem;
  transition: color 0.3s;
}

/*  Meal rows  */
.ct-meals {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(41,107,41,0.4) transparent;
}
.ct-empty {
  color: rgba(255,255,255,0.35);
  font-size: 0.85rem;
  text-align: center;
  padding: 10px 0;
}
.ct-meal-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(41,107,41,0.12);
  border-radius: 8px;
  transition: background 0.15s;
}
.ct-meal-row:hover { background: rgba(41,107,41,0.06); }
.ct-meal-icon { font-size: 0.9rem; flex-shrink: 0; }
.ct-meal-name {
  flex: 1;
  font-size: 0.88rem;
  color: #e5e7eb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ct-meal-type {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.3);
  text-transform: capitalize;
  flex-shrink: 0;
}
.ct-meal-cals {
  font-size: 0.82rem;
  font-weight: 600;
  color: #22c55e;
  flex-shrink: 0;
}
</style>
