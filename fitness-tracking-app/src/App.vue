<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabase'
import Navbar from './components/navbar.vue'
const isAuthenticated = ref(false)

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  isAuthenticated.value = !!session
 
  supabase.auth.onAuthStateChange((_event, session) => {
    isAuthenticated.value = !!session
  })
})
</script>

<template>
  <div class="app-layout">
    <Navbar v-if="isAuthenticated"/>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>


<style scoped>
.app-layout{
  display: flex;
}

.main-content{
  flex: 1;
  padding: 20px;
}
</style>
