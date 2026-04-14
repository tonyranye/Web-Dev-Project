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

  async mounted() {
    const { data: { user } } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    this.profile = data
  },

  methods: {
    async logout() {
      await supabase.auth.signOut()
      this.$router.push('/login')
    }
  }
}
</script>
