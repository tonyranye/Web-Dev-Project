<script setup>

</script>

<template>
  <div class="user-data">
    <h2> {{profile.full_name}} </h2>
    <router-link to="/profile">View Profile</router-link>
    <br>
    <p>Age: <span> {{ profile.age }}  </span>   </p>
    <p>Height: <span> {{ profile.height }} cm </span></p>
    <p>Weight: <span> {{ profile.weight }} lbs</span></p>
  </div>
</template>

<script>
import { ProfileService } from '@/lib/profileService.js';

export default {
  data() {
    return {
      profile: {}
    }
  },

  async mounted() {
    this.profile = await ProfileService()
  },
}
</script>

<style scoped>

.user-data h2{
  font-weight: bolder;
  color: #f2f2f2;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
}

.user-data p{
  font-weight: bold;;
}

</style>