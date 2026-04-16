<template>
<div class="padding"></div>
  <div class="details-card">
    <button class="edit-btn" @click="$emit('edit')">Edit</button>
    
    <h2 class="title">Profile Details</h2>

    <div class="detail-row">
      <span class="label">Name</span>
      <span class="value">{{ profile.full_name }}</span>
    </div>

    <div class="detail-row">
      <span class="label">Age</span>
      <span class="value">{{ profile.age }}</span>
    </div>

    <div class="detail-row">
      <span class="label">Height</span>
      <span class="value">{{ profile.height }} cm</span>
    </div>

    <div class="detail-row">
      <span class="label">Weight</span>
      <span class="value">{{ profile.weight }} kg</span>
    </div>
  </div>
</template>


<script setup>
import { defineProps } from 'vue'

const emit = defineEmits(['edit'])

// Prop to receive profile data from parent component
const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.padding {
  height: 20px;
}

.details-card {
  background: #474747;
  border-radius: 12px;
  border: 2px solid #929292;
  padding: 20px 23px;
  color: white;
  width: 100%;
  max-width: 500px;
}

.title {
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: 600;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  color: rgba(255,255,255,0.6);
  font-size: 14px;
}

.value {
  font-size: 16px;
  font-weight: 500;
}
</style>
