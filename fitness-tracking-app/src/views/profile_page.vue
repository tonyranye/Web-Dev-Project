<template>
  <div>
    <!-- Profile Header --> 
    <ProfileHeader
      :profile="profile"
      @logout="logout"
    />

    <!-- View profile details if not editing --> 
    <ProfileDetails
      v-if="!editing"
      :profile="profile"
      @edit="editing = true"
    />

    <!-- View profile edit form if editing --> 
    <ProfileEditForm
      v-else
      :profile="profile"
      @save="updateProfile"
      @cancel="editing = false"
    />
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase'
import { ProfileService } from '@/lib/profileService'
import ProfileHeader from '@/components/profile_page/profileHeader.vue'
import ProfileDetails from '@/components/profile_page/profileDetails.vue'
import ProfileEditForm from '@/components/profile_page/profileEditForm.vue'

export default {
  components: {
    ProfileHeader,
    ProfileDetails,
    ProfileEditForm
  },

  data() {
    return {
      profile: {},
      editing: false
    }
  },

  // instead, just call function and assign it directly to the variable
  async mounted() {
    this.profile = await ProfileService('profiles')
  },

  methods: {
    async updateProfile(updated) {
      const { data: { user } } = await supabase.auth.getUser()

      await supabase
        .from('profiles')
        .update(updated)
        .eq('user_id', user.id)

      this.profile = await ProfileService('profiles')
      this.editing = false
    },

    async logout() {
      await supabase.auth.signOut()
      this.$router.push('/')
    }
  }
}
</script>
