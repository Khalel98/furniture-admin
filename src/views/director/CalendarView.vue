<template>
  <Qalendar
    :selected-date="this.today"
    :events="events"
    :config="config"
    @updated-period="handleUpdate"
    @updated-mode="handleUpdateMode"
    :is-loading="loader"
  />
</template>

<script>
import { Qalendar } from 'qalendar'
import axios from '@/axios.js'

export default {
  components: {
    Qalendar
  },

  data() {
    return {
      date: null,
      loader: false,
      today: new Date(),
      events: [],
      config: {
        // see configuration section
        defaultMode: 'month'
      }
    }
  },
  methods: {
    handleUpdate(payload) {
      this.date = payload
      this.getData(this.date.start, this.date.end)
    },
    handleUpdateMode(payload) {
      this.date = payload.period
      this.getData(this.date.start, this.date.end)
    },
    async getData(start, end) {
      this.loader = true
      try {
        const response = await axios.get('order/calendar', {
          params: {
            date_start: start,
            date_end: end
          }
        })
        console.log(response.data)
        this.events = response.data
      } catch (error) {
        console.error(error)
        alert(error.response.data.message || 'Что-то пошло не так!')
      } finally {
        this.loader = false
      }
    }
  },

  mounted() {
    this.getData(this.currentDate.start, this.currentDate.end)
  },

  computed: {
    currentDate() {
      const currentDate = new Date()

      // Adjust the first day to be 2 days earlier
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      firstDay.setDate(firstDay.getDate() - 4)

      // Adjust the last day to be 2 days later
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      lastDay.setDate(lastDay.getDate() + 4)

      return {
        start: firstDay.toISOString().split('T')[0],
        end: lastDay.toISOString().split('T')[0]
      }
    }
  }
}
</script>

<style>
@import 'qalendar/dist/style.css';
</style>
