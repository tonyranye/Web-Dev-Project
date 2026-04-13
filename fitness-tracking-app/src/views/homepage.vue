<template>
  <div>

    <section class="home-content">
      <h2>Overview</h2>
      <p>General stats the user sees when they login</p>

    </section>

    <section class="overview">
      <overview-card />
    </section>
  </div>
</template>

<script>
import Navbar from '../components/navbar.vue'
import OverviewCard from "@/components/overviewCard.vue";

export default {
  name: 'Homepage',
  components: {
    OverviewCard,
    Navbar,
  },
}
</script>
