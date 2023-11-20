<template>
  <TotalStat />

  <div class="section__charts">
    <DayStat />
    <WeekStat />
  </div>
  <MonthStat />

  <AktauMap />
</template>

<script>
import TotalStat from '@/components/statistics/TotalStat.vue'
import DayStat from '@/components/statistics/DayStat.vue'
import WeekStat from '@/components/statistics/WeekStat.vue'
import MonthStat from '@/components/statistics/MonthStat.vue'
import AktauMap from '@/components/statistics/AktauMap.vue'
export default {
  components: {
    TotalStat,
    AktauMap,
    DayStat,
    WeekStat,
    MonthStat
  },
  data() {
    return {}
  }
}
</script>
