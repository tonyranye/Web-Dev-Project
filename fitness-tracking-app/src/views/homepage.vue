<template>
  <div class="page">

    <!--    The header card styling-->
    <div class="home-Header">
      <h2>Overview</h2>
      <p>General stats the user sees when they login</p>
    </div>

    <div class="content-wrapper">

      <div class="main-content">

        <section class="card" id="overview">
          <overview-card />
        </section>

        <section class="card" id="Graph">
          <graph-component />
        </section>

        <section class="tasks" id="tasks">
          <daily-tasks />

        </section>
      </div>

      <div class="user-data">
        <base-card class="card" id="quick-stats">
          <h2> {{profile.full_name}} </h2>
          <router-link to="/profile">View Profile</router-link>
          <br>
          <p>Age: <span> {{ profile.age }} </span>   </p>
          <p>Height: <span> {{ profile.height }} </span></p>
          <p>Weight: <span> {{ profile.weight }} lbs</span></p>
        </base-card>
      </div>

    </div>

  </div>
</template>

<script>
import OverviewCard from "@/components/overviewCard.vue";
import GraphComponent  from "@/components/graphComponent.vue";
import DailyTasks from "@/components/dailyTasks.vue";
import BaseCard from "@/components/baseCard.vue";
import { ProfileService } from '@/lib/profileService.js';

export default {
  name: 'Homepage',
  components: {
    DailyTasks,
    OverviewCard,
    GraphComponent,
    BaseCard,
  },
  data() {
    return {
      profile: {}
    }
  },

  async mounted() {
    this.profile = await ProfileService()
  },
}
</script>

<style scoped>

.page{
  padding: 15px;
}

.home-Header{
  margin-bottom: 12px;
}

.content-wrapper{
  display: flex;
  gap: 20px;
}

.card{
  background: #1a2e1a;
  border-radius: 12px;
  border: #296b29 2px solid;
  padding: 20px;
}

.main-content{
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.user-data h2{
  font-weight: bolder;
  color: #f2f2f2;
}

.user-data p{
  font-weight: bold;;
}

.Graph{
  background: #1a2e1a;
  border-radius: 12px;
  border: #296b29 2px solid;
  padding: 20px;

}

.tasks{
  background: #1a2e1a;
  border-radius: 12px;
  border: #296b29 2px solid;
  padding: 20px;
}






</style>


<!--.side-content{
  width: 280px;
  background: #1a2e1a;
  border-radius: 12px;
  border: #296b29 2px solid;
  padding: 20px;
}-->