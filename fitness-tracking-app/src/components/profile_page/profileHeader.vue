<template>
  <header class="profile-header">
    <div class="left">
      <img
        src="@/assets/placeholder_profile_picture.webp"
        alt="Profile Picture"
        class="profile-pic"
      />

      <div class="info">
        <h1>{{ fullName }}</h1>
        <h3>@{{ username }}</h3>
      </div>
    </div>

    <button class="logout-btn" @click="$emit('logout')">
      Logout
    </button>
  </header>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-pic {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #296b29;
}

.info h1 {
  margin: 0;
  font-size: 22px;
  color: white;
}

.info h3 {
  margin: 0;
  font-size: 14px;
  color: rgba(255,255,255,0.6);
}

.logout-btn {
  background: #cc0000;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #aa0000;
}
</style>
