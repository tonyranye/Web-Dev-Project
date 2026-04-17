<template>
  <header class="profile-header">
    <div class="left">
      <img
        :src="profile.profile_picture_url || placeholder"
        alt="Profile Picture"
        class="profile-pic"
      />

      <div class="info">
        <h1>{{ profile.full_name }}</h1>
        <h3>@{{ profile.user_id }}</h3>
      </div>
    </div>

    <button class="logout-btn" @click="emit('logout')">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
</svg>
    </button>
  </header>
</template>

<script setup>
import placeholder from '@/assets/placeholder_pfp_blue.avif'

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['logout'])
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
