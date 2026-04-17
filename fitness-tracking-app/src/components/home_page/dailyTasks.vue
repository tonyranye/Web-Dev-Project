<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from "@/lib/supabase.js"

const tasks = ref([])
const loading = ref(true)
const openMenuId = ref(null)
const editingTask = ref(null)
const editTitle = ref('')
const editPriority = ref('')
const editIsDone = ref(false)
const editIsRepeating = ref(false)

// Snackbar state
const snackbar = ref(null)
let snackbarTimer = null
let undoSnapshot = null

async function loadDailyTasks() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Build a date range for today in UTC (Supabase stores timestamps in UTC)
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const { data, error } = await supabase
      .from('tasks')
      .select('task_id, title, is_done, priority, is_repeating, created_at')
      .eq('user_id', user.id)
      .or(
          // Tasks created today
          `and(created_at.gte.${todayStart.toISOString()},created_at.lte.${todayEnd.toISOString()}),` +
          // Repeating tasks from any day
          `is_repeating.eq.true`
      )
      .order('created_at', { ascending: true })
      .limit(20)

  if (error) { console.error(error.message); return }

  // For repeating tasks created on a previous day, reset is_done to false locally
  // so they appear as incomplete at the start of each new day
  const todayStartMs = todayStart.getTime()
  tasks.value = data.map(task => {
    if (task.is_repeating && new Date(task.created_at).getTime() < todayStartMs) {
      return { ...task, is_done: false }
    }
    return task
  })

  loading.value = false
}

function toggleMenu(taskId) {
  openMenuId.value = openMenuId.value === taskId ? null : taskId
}
function closeMenu() { openMenuId.value = null }

function openEdit(task) {
  editingTask.value = task
  editTitle.value = task.title
  editPriority.value = task.priority
  editIsDone.value = task.is_done
  editIsRepeating.value = task.is_repeating ?? false
  closeMenu()
}
function closeEdit() { editingTask.value = null }

async function syncTaskDone(task, isDone) {
  const { error } = await supabase
      .from('tasks')
      .update({ is_done: isDone })
      .eq('task_id', task.task_id)
  if (error) { task.is_done = !isDone; console.error(error.message) }
}

function showSnackbar(task) {
  if (snackbarTimer) clearTimeout(snackbarTimer)
  undoSnapshot = { task, previousState: !task.is_done }
  snackbar.value = task.title
  snackbarTimer = setTimeout(() => { snackbar.value = null }, 4000)
}

async function toggleDone(task) {
  task.is_done = !task.is_done
  if (task.is_done) showSnackbar(task)
  else snackbar.value = null
  await syncTaskDone(task, task.is_done)
}

async function markAsDone(task) {
  if (task.is_done) { closeMenu(); return }
  task.is_done = true
  showSnackbar(task)
  closeMenu()
  await syncTaskDone(task, true)
}

async function undoComplete() {
  if (!undoSnapshot) return
  const { task } = undoSnapshot
  task.is_done = false
  snackbar.value = null
  clearTimeout(snackbarTimer)
  await syncTaskDone(task, false)
  undoSnapshot = null
}

const isCreatingTask = ref(false)

// Function triggered by the new button
function openCreateModal() {
  // Clear out variables for a fresh task
  editTitle.value = ''
  editPriority.value = 'medium'
  editIsDone.value = false
  editIsRepeating.value = false

  // Open your modal (you'll need to add a v-if="isCreatingTask" modal to your template)
  isCreatingTask.value = true
}

function closeCreateModal() {
  isCreatingTask.value = false
}

async function createNewTask() {
  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // 2. Prepare the task data
  const newTaskData = {
    user_id: user.id,
    title: editTitle.value,
    priority: editPriority.value,
    is_done: editIsDone.value,
    is_repeating: editIsRepeating.value
  }

  // 3. Close the modal right away so the UI feels snappy
  closeCreateModal()

  // 4. Send to Supabase
  const { data, error } = await supabase
      .from('tasks')
      .insert(newTaskData)
      .select()
      .single()

  if (error) {
    console.error("Error creating task:", error.message)
    return
  }

  // 5. Add the newly created task to your local array so it shows up on screen
  if (data) {
    tasks.value.push(data)
  }
}

async function saveEdit() {
  const task = editingTask.value
  const original = {
    title: task.title,
    priority: task.priority,
    is_done: task.is_done,
    is_repeating: task.is_repeating
  }
  task.title = editTitle.value
  task.priority = editPriority.value
  task.is_done = editIsDone.value
  task.is_repeating = editIsRepeating.value
  closeEdit()
  const { error } = await supabase
      .from('tasks')
      .update({
        title: editTitle.value,
        priority: editPriority.value,
        is_done: editIsDone.value,
        is_repeating: editIsRepeating.value
      })
      .eq('task_id', task.task_id)
  if (error) { Object.assign(task, original); console.error(error.message) }
}

onMounted(() => loadDailyTasks())
</script>

<template>

  <div @click="closeMenu">


    <div class="header-container">
      <div class="header">Daily Tasks</div>
      <button class="btn-add" @click="openCreateModal">+ New Task</button>
    </div>

    <div v-if="loading" class="loading-state">
      <span>Loading tasks...</span>
    </div>

    <div v-else-if="tasks.length === 0" class="empty-state">
      No tasks created for today
    </div>

    <ul class="tasks" v-else>
      <li v-for="task in tasks" :key="task.task_id" :class="{ 'is-done': task.is_done }">
        <div class="task-main">
          <span class="status-icon" @click.stop="toggleDone(task)">
            {{ task.is_done ? '✅' : '☐' }}
          </span>
          <span class="task-title">{{ task.title }}</span>
          <span v-if="task.is_repeating" class="repeat-badge" title="Repeats daily">🔁</span>
        </div>

        <div class="task-right">
          <span :class="['priority-tag', task.priority]">{{ task.priority }}</span>
          <div class="menu-wrap" @click.stop>
            <button class="dots-btn" @click="toggleMenu(task.task_id)">⋯</button>
            <div v-if="openMenuId === task.task_id" class="dropdown">
              <button @click="markAsDone(task)">Mark as done</button>
              <button @click="openEdit(task)">Edit task</button>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Edit Modal -->
    <div v-if="editingTask" class="modal-overlay" @click.self="closeEdit">
      <div class="modal">
        <h3>Edit Task</h3>
        <label>Task name</label>
        <input v-model="editTitle" type="text" />
        <label>Priority</label>
        <select v-model="editPriority">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <label class="checkbox-label">
          <input type="checkbox" v-model="editIsDone" />
          Mark as completed
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="editIsRepeating" />
          Repeat daily
        </label>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeEdit">Cancel</button>
          <button class="btn-save" @click="saveEdit">Save</button>
        </div>
      </div>
    </div>

    <div v-if="isCreatingTask" class="modal-overlay" @click.self="closeCreateModal">
      <div class="modal">
        <h3>Create New Task</h3>
        <label>Task name</label>
        <input v-model="editTitle" type="text" placeholder="What needs to be done?" />

        <label>Priority</label>
        <select v-model="editPriority">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <label class="checkbox-label">
          <input type="checkbox" v-model="editIsDone" />
          Mark as already completed
        </label>

        <label class="checkbox-label">
          <input type="checkbox" v-model="editIsRepeating" />
          Repeat daily
        </label>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeCreateModal">Cancel</button>
          <button class="btn-save" @click="createNewTask">Create Task</button>
        </div>
      </div>
    </div>

    <!-- Snackbar -->
    <Transition name="snack">
      <div v-if="snackbar" class="snackbar">
        <span>✅ <strong>{{ snackbar }}</strong> completed</span>
        <button class="undo-btn" @click="undoComplete">Undo</button>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.header {
  font-size: 1rem;
  font-weight: 600;
  color: #e5e7eb;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.btn-add {
  background: #296b29;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: background 0.15s ease-in-out;
}

.btn-add:hover {
  background: #22c55e;
  color: #111;
}

.loading-state,
.empty-state {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  padding: 16px 0;
  text-align: center;
}

.tasks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  max-height: 180px; /* You can adjust this height to fit your layout perfectly */
  overflow-y: auto;
  padding-right: 6px; /* Gives the scrollbar a little room */
}

.tasks li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(41, 107, 41, 0.2);
  padding: 12px 16px;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}

.tasks li:hover {
  background: rgba(41, 107, 41, 0.08);
  border-color: #22c55e;
}

.task-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-icon {
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.15s;
  user-select: none;
}
.status-icon:hover { transform: scale(1.2); }

.task-title { color: #e5e7eb; font-size: 0.95rem; }

.repeat-badge {
  font-size: 0.75rem;
  opacity: 0.6;
  cursor: default;
}

.priority-tag {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}
.priority-tag.high { background: rgba(239,68,68,0.15); color: #ef4444; }
.priority-tag.medium { background: rgba(245,158,11,0.15); color: #f59e0b; }
.priority-tag.low { background: rgba(59,130,246,0.15); color: #3b82f6; }

.tasks li.is-done { opacity: 0.5; }
.is-done .task-title { text-decoration: line-through; }
.is-done .priority-tag { background: rgba(156,163,175,0.1); color: #9ca3af; }

.menu-wrap { position: relative; }
.dots-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
  transition: color 0.15s, background 0.15s;
}
.dots-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }

.dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background: #1e3a1e;
  border: 1px solid #296b29;
  border-radius: 8px;
  overflow: hidden;
  z-index: 10;
  min-width: 140px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.dropdown button {
  display: block;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  color: #e5e7eb;
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}
.dropdown button:hover { background: rgba(41,107,41,0.25); }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #1a2e1a;
  border: 1px solid #296b29;
  border-radius: 14px;
  padding: 24px;
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal h3 { margin: 0 0 6px; color: #e5e7eb; font-size: 1rem; }
.modal label { font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-bottom: 2px; }
.modal input[type="text"],
.modal select {
  background: rgba(255,255,255,0.05);
  border: 1px solid #296b29;
  border-radius: 8px;
  padding: 8px 12px;
  color: #e5e7eb;
  font-size: 0.9rem;
  width: 100%;
  box-sizing: border-box;
}
.modal select option { background: white; color: black; }
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #e5e7eb;
  cursor: pointer;
}
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
.btn-cancel {
  background: none;
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.5);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
}
.btn-cancel:hover { border-color: rgba(255,255,255,0.3); }
.btn-save {
  background: #296b29;
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
}
.btn-save:hover { background: #22c55e; color: #111; }

/* Snackbar */
.snackbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e3a1e;
  border: 1px solid #296b29;
  border-radius: 10px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #e5e7eb;
  font-size: 0.875rem;
  z-index: 200;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  white-space: nowrap;
}

.undo-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  color: #22c55e;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.15s;
}
.undo-btn:hover { background: rgba(34,197,94,0.1); }

/* Snackbar transition */
.snack-enter-active, .snack-leave-active { transition: all 0.3s ease; }
.snack-enter-from, .snack-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }
</style>