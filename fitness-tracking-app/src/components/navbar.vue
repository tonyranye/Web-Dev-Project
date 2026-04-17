<template>
  <aside class="sidebar">
    <div class="logo"><router-link to="/">🏋️‍♂️</router-link></div>

    <nav class="menu">
      <router-link class="menu-item" to="/">
        <i class="fa-solid fa-house"></i>
        <span>Home</span>
      </router-link>

      <router-link class="menu-item" to="/workouts">
        <i class="fa-solid fa-dumbbell"></i>
        <span>Workouts</span>
      </router-link>

      <router-link class="menu-item" to="/food_tracker">
        <i class="fa-solid fa-chart-line"></i>
        <span>Food Tracker</span>
      </router-link>

      <router-link class="menu-item" to="/profile">
        <i class="fa-solid fa-user"></i>
        <span>Profile</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>

.sidebar{
  min-width: 150px;
  min-height: 100vh;

  background: #222222;
  border-radius: 8px 8px 8px 8px;
  padding: 0 8px 12px 12px;
  display: flex;
  flex-direction: column;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item:hover{
  background: #333333;
  border-radius: 6px;
}

.menu-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: #1a2e1a;
  border-radius: 4px;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}


</style>
