<template>
  <div class="user-data">
    <img
        :src="profile.profile_picture_url || placeholder"
        alt="Profile Picture"
        class="profile-pic"
    />
    <router-link id="link" to="/profile">View Profile</router-link>
    <br>
    <p>Age: <span> {{ profile.age }}  </span>   </p>
    <p>Height: <span> {{ profile.height }} cm </span></p>
    <p>Weight: <span> {{ profile.weight }} lbs</span></p>
  </div>
</template>

<script>
import { ProfileService } from '@/lib/profileService.js';
import placeholder from "@/assets/placeholder_pfp_blue.avif";

export default {
  data() {
    return {
      profile: {},
      placeholder,
    }
  },

  async mounted() {
    this.profile = await ProfileService('profiles')
  },
}
</script>

<style scoped>

.user-data{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}


#link {
  padding-bottom: 12px;
  border-bottom: 3px solid rgba(255, 255, 255, 0.1);
}

.user-data p{
  font-weight: bold;;
}

.profile-pic {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #296b29;
}

</style>