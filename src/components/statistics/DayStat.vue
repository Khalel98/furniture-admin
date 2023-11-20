<template>
  <div v-if="dayVisibity" style="margin-bottom: 30px" class="section__charts__item">
    <div class="charts__title">Статистика за день</div>
    <apexchart
      type="donut"
      height="350"
      width="600"
      :options="pie_chartOptions"
      :series="pie_series"
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
      dayVisibity: false,
      pie_series: [0, 0],
      pie_chartOptions: {
        chart: {
          type: 'donut'
        },
        labels: ['Поступившие'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    async getDayStat() {
      try {
        const config = {
          headers: {
            'X-Auth-Token': `${this.$store.getters.activeToken}`
          }
        }

        const response = await axios.get(`statistic/graphic/day`, config)

        this.pie_series = [response.data.count]
        if (this.pie_series[0] == 0) {
          this.pie_series[0] = 1
        }
        this.dayVisibity = true
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  },
  mounted() {
    this.getDayStat()
  }
}
</script>

<style></style>
