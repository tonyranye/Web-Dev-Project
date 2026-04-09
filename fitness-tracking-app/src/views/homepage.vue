<template>
  <div>
    <Navbar />

    <section class="home-content">
      <h2>Welcome to your Fitness Tracker</h2>
      <p>Track workouts, monitor progress, and stay motivated.</p>
    </section>
  </div>
</template>

<script>
import Navbar from '../components/navbar.vue'

export default {
  name: "HomeView",
  components: {
    Navbar
  }
}
</script>
