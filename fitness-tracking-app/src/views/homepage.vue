<template>
  <div>
    <Navbar />

    <section class="home-content">
      <h2>Header</h2>
      <p>Paragraph.</p>
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
