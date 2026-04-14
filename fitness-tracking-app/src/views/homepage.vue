<template>
  <div class="page">

    <!--    The header card styling-->
    <div class="home-Header">
      <h2>Overview</h2>
      <p>General stats the user sees when they login</p>
    </div>

    <div class="content-wrapper">

      <div class="main-content">

        <section class="overview">
          <overview-card />
        </section>

        <section class="Graph">
          <graph-component />
        </section>

        <section class="tasks">
          <daily-tasks />
        </section>
      </div>

      <base-card class="card">
        <h2>USER DATA </h2>
        <br>
        <p>link to profile page</p>
        <p>Age: 20 </p>
        <p>Height: 1.60cm</p>
        <p>Weight: 170 lbs</p>

      </base-card>

    </div>

  </div>
</template>

<script>
import OverviewCard from "@/components/overviewCard.vue";
import GraphComponent  from "@/components/graphComponent.vue";
import DailyTasks from "@/components/dailyTasks.vue";
import BaseCard from "@/components/baseCard.vue";

export default {
  name: 'Homepage',
  components: {
    DailyTasks,
    OverviewCard,
    GraphComponent,
    BaseCard,
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

.main-content{
  display: flex;
  flex-direction: column;
  gap: 24px;
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