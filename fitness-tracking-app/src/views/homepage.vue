<template>
  <div class="page">

    <!--    The header card styling-->
    <div class="home-Header">
      <h2>Overview</h2>
    </div>

    <div class="content-wrapper">

      <div class="main-content">

        <section class="card" id="overview">
          <overview-card />
        </section>

        <section class="card" id="Graph">
          <graph-component />
        </section>

        <section class="card" id="tasks">
          <daily-tasks />
        </section>

      </div>

      <div class="right-content">

        <section class="card">
          <QuickData/>
        </section>

      </div>

    </div>

  </div>
</template>

<script>
import OverviewCard from "@/components/home_page/overviewCard.vue";
import GraphComponent  from "@/components/home_page/graphComponent.vue";
import DailyTasks from "@/components/home_page/dailyTasks.vue";
import QuickData from "@/components/home_page/quickData.vue";
export default {
  name: 'Homepage',
  components: {
    DailyTasks,
    OverviewCard,
    GraphComponent,
    QuickData
  },
}
</script>

<style scoped>

.page{
  padding: 5px;
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

.card{
  background: #1a2e1a;
  border-radius: 12px;
  border: #296b29 2px solid;
  padding: 20px;
}

</style>
