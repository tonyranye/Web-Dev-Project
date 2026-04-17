<template>
  <aside class="sidebar">
    <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    
      <rect x="2" y="10" width="5" height="12" rx="2" fill="white"/>
      <rect x="25" y="10" width="5" height="12" rx="2" fill="white"/>

      <rect x="21" y="12" width="4" height="8" rx="1.5" fill="white"/>
      <rect x="7" y="12" width="4" height="8" rx="1.5" fill="white"/>
      
      <rect x="11" y="14.5" width="15" height="3" rx="1.5" fill="white"/>
      
      
      
      
</svg>
    </div>

    <nav class="menu">
      <router-link class="menu-item" to="/">
        <i class="fa-solid fa-house"></i>
        <span>Home</span>
      </router-link>
      
      <router-link class="menu-item" to="/activity">
        <i class="fa-solid fa-person-running"></i>
        <span>Activities</span>
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
