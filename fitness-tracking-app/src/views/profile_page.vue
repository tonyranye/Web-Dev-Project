<template>
  <div>
    <ProfileHeader
      :fullName="profile.full_name"
      :username="profile.username"
      @logout="logout"
    />

    <ProfileDetails :profile="profile" />
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase'
import { ProfileService } from '@/lib/profileService'
import ProfileHeader from '@/components/profile_page/profileHeader.vue'
import ProfileDetails from '@/components/profile_page/profileDetails.vue'

export default {
  components: {
    ProfileHeader,
    ProfileDetails
  },

  data() {
    return {
      profile: {}
    }
  },

  // instead, just call function and assign it directly to the variable
  async mounted() {
    this.profile = await ProfileService()
  },

  methods: {
    async logout() {
      await supabase.auth.signOut()
      this.$router.push('/login')
    }
  }
}
</script>
