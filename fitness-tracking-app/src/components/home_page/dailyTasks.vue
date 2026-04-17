<script setup>
import { ref, onMounted } from 'vue'
import {supabase} from "@/lib/supabase.js";

const tasks = ref([])
const loading = ref(true)

async function loadDailyTasks(){
  const { data: { user } } = await supabase.auth.getUser()
  console.log('user id:', user.id)  // ✅ add this
  if (!user){
    console.log("Tasks not found")
    return
  }
  const {data, error } = await supabase
      .from('tasks')
      .select('title, is_done, priority, created_at, task_id')
      .eq('user_id', user.id)
      .order('created_at', {ascending: true})
      .limit(5)

  if (error){
    console.log(error.message);
    console.log("Could NOT LOAD TASKS")
    return
  }
  console.log('tasks data:', data)  // ✅ add this


  tasks.value = data
  loading.value = false
}

onMounted(() => loadDailyTasks())

</script>


<template>
  <div v-if="loading" class="loading-state">
    <span>Loading tasks...</span>
  </div>

  <ul class="tasks" v-else>
    <li v-for="task in tasks" :key="task.task_id" :class="{ 'is-done': task.is_done }">
      <div class="task-main">
        <span class="status-icon">{{ task.is_done ? '✅' : '☐' }}</span>
        <span class="task-title">{{ task.title }}</span>
      </div>

      <span :class="['priority-tag', task.priority]">
        {{ task.priority }}
      </span>
    </li>
  </ul>
</template>
<style scoped>
.tasks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tasks li {
  display: flex;
  justify-content: space-between; /* Pushes priority to the right */
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

.task-title {
  color: #e5e7eb;
  font-size: 0.95rem;
}

/* Priority Badge Styling */
.priority-tag {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

/* Priority Color Mapping */
.priority-tag.high {
  background: rgba(239, 68, 68, 0.15); /* Red */
  color: #ef4444;
}

.priority-tag.medium {
  background: rgba(245, 158, 11, 0.15); /* Orange */
  color: #f59e0b;
}

.priority-tag.low {
  background: rgba(59, 130, 246, 0.15); /* Blue */
  color: #3b82f6;
}

/* Completed State */
.tasks li.is-done {
  opacity: 0.5;
}
.is-done .task-title {
  text-decoration: line-through;
}
.is-done .priority-tag {
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
}
</style>