<template>
  <div>

    <section class="home-content">
      <h2>Profile Page</h2>
      <p>Paragraph.</p>

      <!-- Logout button -->
      <button class="logout-btn" @click="logout">
        Logout
      </button>
    </section>

    <img src="../assets/profile-pic-placeholder.png" alt="Profile Picture" class="profile-pic">
    <h1>Random name</h1>
    <h3>Random Username</h3>

    <table>
      <tr>
        <th>Attribute</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Age</td>
        <td>25</td>
      </tr>
      <tr>
        <td>Height</td>
        <td>180 cm</td>
      </tr>
      <tr>
        <td>Weight</td>
        <td>75 kg</td>
      </tr>
      <tr>
        <td>Calories Burned</td>
        <td>2000</td>
      </tr>
      <tr>
        <td>Fitness Goal</td>
        <td>Lose weight</td>
      </tr>
    </table>

  </div>
</template>

<script>
import { supabase } from '@/lib/supabase'

export default {
  methods: {
    async logout() {
      await supabase.auth.signOut()
      this.$router.push('/login')
    }
  }
}
</script>

<style>
.logout-btn {
  background: #cc0000;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}

.logout-btn:hover {
  background: #aa0000;
}
</style>
