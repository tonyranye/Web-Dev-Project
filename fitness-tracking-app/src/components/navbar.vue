<template>
  <aside class="sidebar">
    <div class="logo">🏋️‍♂️</div>

    <nav class="menu">
      <a class="menu-item" href="/">
        <i class="fa-solid fa-house"></i>
        <span>Home</span>
      </a>

      <a class="menu-item" href="/workouts">
        <i class="fa-solid fa-dumbbell"></i>
        <span>Workouts</span>
      </a>

      <a class="menu-item" href="/progress">
        <i class="fa-solid fa-chart-line"></i>
        <span>Progress</span>
      </a>

      <a class="menu-item" href="/profile">
        <i class="fa-solid fa-user"></i>
        <span>Profile</span>
      </a>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Navbar',
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  height: 100vh;
  background: #1e1e1e;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  position: fixed;
  left: 0;
  top: 0;
}

.logo {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #333;
}

.menu-item i {
  font-size: 1.4rem;
}
</style>
