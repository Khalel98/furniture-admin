<template>
  <div v-if="weekVisibity" style="margin-bottom: 30px" class="section__charts__item">
    <div class="charts__title">Заявки за неделю</div>
    <apexchart
      type="bar"
      height="350"
      :options="appeal_chartOptions"
      :series="appeal_series"
    ></apexchart>
  </div>
</template>

<script>
import axios from '@/axios.js'
import VueApexCharts from 'vue3-apexcharts'

export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      weekVisibity: false,
      appeal_series: [
        {
          name: 'Поступившие заявки',
          data: [44, 55, 57, 12, 75, 58, 63]
        }
      ],
      appeal_chartOptions: {
        xaxis: {
          categories: [
            this.getPreviousDay(6),
            this.getPreviousDay(5),
            this.getPreviousDay(4),
            this.getPreviousDay(3),
            this.getPreviousDay(2),
            this.getPreviousDay(1),
            this.getCurrentDay()
          ]
        }
      }
    }
  },
  methods: {
    getCurrentDay() {
      const date = new Date()
      const day = date.toLocaleString('default', { weekday: 'short' })
      return day
    },
    getPreviousDay(offset) {
      const date = new Date()
      date.setDate(date.getDate() - offset)
      const day = date.toLocaleString('default', { weekday: 'short' })
      return day
    },
    async getWeekStat() {
      try {
        const config = {
          headers: {
            'X-Auth-Token': `${this.$store.getters.activeToken}`
          }
        }

        const response = await axios.get(`statistic/graphic/week`, config)
        this.appeal_series[0].data = response.data.count

        this.weekVisibity = true
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  },
  mounted() {
    this.getWeekStat()
  }
}
</script>

<style></style>
