<template>
  <aside class="sidebar">
    <div class="logo">🏋️‍♂️</div>

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
