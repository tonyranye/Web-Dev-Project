<template>
  <nav class="navbar">
    <h1 class="logo">Fitness Tracker</h1>

    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/workouts">Workouts</a></li>
      <li><a href="/progress">Progress</a></li>
      <li><a href="/profile">Profile</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Navbar"
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #222;
  color: white;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}
</style>
