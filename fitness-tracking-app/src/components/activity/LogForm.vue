<template>
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Log activity</span>
    </div>

    <div v-if="formError" class="error-msg">{{ formError }}</div>
    <div v-if="success" class="success-msg">Activity logged!</div>

    <div class="form-col">
      <div>
        <label class="f-label">Activity name</label>
        <input
          v-model="form.name"
          class="f-input"
          :class="{ 'f-input-err': fieldErrors.name }"
          type="text"
          placeholder="e.g. Morning run"
          maxlength="100"
          @blur="validateField('name')"
        />
        <span v-if="fieldErrors.name" class="field-err">{{ fieldErrors.name }}</span>
      </div>

      <div>
        <label class="f-label">Category</label>
        <select
          v-model="form.category"
          class="f-input"
          :class="{ 'f-input-err': fieldErrors.category }"
          @blur="validateField('category')"
        >
          <option value="" disabled>Select a category</option>
          <option>Cardio</option>
          <option>Strength</option>
          <option>Flexibility / Stretch</option>
          <option>Sports</option>
          <option>Other</option>
        </select>
        <span v-if="fieldErrors.category" class="field-err">{{ fieldErrors.category }}</span>
      </div>

      <div class="f-row">
        <div>
          <label class="f-label">Duration (min)</label>
          <input
            v-model="form.duration"
            class="f-input"
            :class="{ 'f-input-err': fieldErrors.duration }"
            type="number"
            placeholder="45"
            min="1"
            max="1440"
            @blur="validateField('duration')"
          />
          <span v-if="fieldErrors.duration" class="field-err">{{ fieldErrors.duration }}</span>
        </div>
        <div>
          <label class="f-label">Calories (kcal)</label>
          <input
            v-model="form.calories"
            class="f-input"
            :class="{ 'f-input-err': fieldErrors.calories }"
            type="number"
            placeholder="320"
            min="0"
            @blur="validateField('calories')"
          />
          <span v-if="fieldErrors.calories" class="field-err">{{ fieldErrors.calories }}</span>
        </div>
      </div>

      <div>
        <label class="f-label">Notes (optional)</label>
        <input
          v-model="form.notes"
          class="f-input"
          type="text"
          placeholder="How did it feel?"
          maxlength="300"
        />
        <span class="char-count">{{ form.notes.length }}/300</span>
      </div>

      <button class="f-btn" :disabled="submitting" @click="handleSubmit">
        {{ submitting ? 'Saving...' : '+ Log activity' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['submitted'])

const submitting = ref(false)
const formError  = ref(null)
const success    = ref(false)

const form = reactive({ name: '', category: '', duration: '', calories: '', notes: '' })
const fieldErrors = reactive({ name: '', category: '', duration: '', calories: '' })

function validateField(field) {
  fieldErrors[field] = ''
  if (field === 'name') {
    if (!form.name.trim()) fieldErrors.name = 'Required.'
    else if (form.name.trim().length > 100) fieldErrors.name = 'Max 100 characters.'
  }
  if (field === 'category') {
    if (!form.category) fieldErrors.category = 'Required.'
  }
  if (field === 'duration') {
    if (!form.duration) fieldErrors.duration = 'Required.'
    else if (isNaN(form.duration) || parseInt(form.duration) <= 0) fieldErrors.duration = 'Must be a positive number.'
    else if (parseInt(form.duration) > 1440) fieldErrors.duration = 'Max 1440 minutes.'
  }
  if (field === 'calories') {
    if (form.calories && parseInt(form.calories) < 0) fieldErrors.calories = 'Cannot be negative.'
    if (form.calories && parseInt(form.calories) > 10000) fieldErrors.calories = 'Value seems too high.'
  }
}

async function handleSubmit() {
  // Run all validations before submitting
  ;['name', 'category', 'duration', 'calories'].forEach(validateField)
  if (Object.values(fieldErrors).some(e => e)) return

  formError.value = null
  success.value = false
  submitting.value = true

  const ok = await emit('submitted', { ...form })

  submitting.value = false

  if (ok !== false) {
    success.value = true
    Object.assign(form, { name: '', category: '', duration: '', calories: '', notes: '' })
    Object.assign(fieldErrors, { name: '', category: '', duration: '', calories: '' })
    setTimeout(() => (success.value = false), 3000)
  }
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
.form-col { display: flex; flex-direction: column; gap: 10px; }
.f-label { font-size: 11px; color: #efd9d9; margin-bottom: 3px; display: block; }
.f-input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid #4ade80;
  border-radius: 6px;
  font-size: 12px;
  background: #1a1a1a;
  color: #ccc;
  font-family: inherit;
  box-sizing: border-box;
}
.f-input::placeholder { color: #3a3a3a; }
.f-input:focus { outline: none; border-color: #4ade80; }
.f-input-err { border-color: #ef4444 !important; }
.f-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.f-btn {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  background: #166534;
  color: #4ade80;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #1a5c34;
  cursor: pointer;
  font-family: inherit;
  margin-top: 2px;
  transition: opacity 0.2s;
}
.f-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.f-btn:not(:disabled):hover { background: #15803d; }
.field-err { font-size: 11px; color: #ef4444; margin-top: 3px; display: block; }
.char-count { font-size: 11px; color: #efd9d9; display: block; text-align: right; margin-top: 2px; }
.error-msg {
  font-size: 12px;
  color: #ef4444;
  background: #2a0d0d;
  border: 1px solid #3a1a1a;
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 10px;
}
.success-msg {
  font-size: 12px;
  color: #4ade80;
  background: #2a2a2a;
  border: 1px solid #4ade80;
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 10px;
}
</style>
