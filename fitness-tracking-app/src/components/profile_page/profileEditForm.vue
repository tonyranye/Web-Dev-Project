<template>
  <div class="edit-card">
    <h2>Edit Profile</h2>

    <form @submit.prevent="submitForm">
      <div class="form-row">
        <label>Name</label>
        <input v-model="form.full_name" type="text" />
      </div>

      <div class="form-row">
        <label>Age</label>
        <input v-model.number="form.age" type="number" />
      </div>

      <div class="form-row">
        <label>Height (cm)</label>
        <input v-model.number="form.height" type="number" />
      </div>

      <div class="form-row">
        <label>Weight (kg)</label>
        <input v-model.number="form.weight" type="number" />
      </div>

      <div class="buttons">
        <button type="submit" class="save">Save</button>
        <button type="button" class="cancel" @click="$emit('cancel')">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})

// Local editable copy
const form = reactive({ ...props.profile })

function submitForm() {
  // Emit updated data to parent
  emit('save', { ...form })
}

const emit = defineEmits(['save', 'cancel'])
</script>

<style scoped>
.edit-card {
  background: #474747;
  border-radius: 12px;
  border: 2px solid #929292;
  padding: 20px 23px;
  color: white;
  width: 100%;
  max-width: 500px;
}

.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

label {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 4px;
}

input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #929292;
  background: #ffffff;
  color: black;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.save {
  background: #2e8b57;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  color: white;
  cursor: pointer;
}

.cancel {
  background: #444;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  color: white;
  cursor: pointer;
}
</style>
