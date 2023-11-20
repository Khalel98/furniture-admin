<template>
  <div v-if="monthVisibity">
    <div class="charts__title">Заявки за месяц</div>
    <apexchart
      type="line"
      height="350"
      :options="month_chartOptions"
      :series="month_series"
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
      monthVisibity: false,
      month_series: [
        {
          name: 'Поступившие',
          data: [
            28, 29, 33, 36, 32, 32, 33, 3, 33, 34, 4, 3, 3, 3, 34, 12, 2, 28, 29, 33, 36, 32, 32,
            33, 3, 33, 34, 33, 34, 233
          ]
        }
      ],
      month_chartOptions: {
        chart: {
          height: 350,
          type: 'line'
        },
        colors: ['#26a0fc', '#26e7a6'],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'smooth'
        },

        xaxis: {
          categories: []
        },
        yaxis: {
          min: 0,
          max: 10
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      }
    }
  },
  mounted() {
    this.generateXAxisCategories()
    this.getMonthStat()
  },
  methods: {
    generateXAxisCategories() {
      const today = new Date()
      const xAxisCategories = []

      for (let i = 30; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        const formattedDate = date.toLocaleDateString()
        xAxisCategories.push(formattedDate)
      }

      this.month_chartOptions.xaxis.categories = xAxisCategories
    },

    async getMonthStat() {
      try {
        const config = {
          headers: {
            'X-Auth-Token': `${this.$store.getters.activeToken}`
          }
        }

        const response = await axios.get(`statistic/graphic/month`, config)
        this.month_series[0].data = response.data.count

        this.monthVisibity = true
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }
}
</script>

<style></style>
