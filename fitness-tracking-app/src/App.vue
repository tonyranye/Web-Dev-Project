<script setup>
import Navbar from './components/navbar.vue'
</script>

<template>
  <div class="app-layout">
    <Navbar />
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
