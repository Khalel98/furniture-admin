<template>
  <v-btn class="takeOrder" :loading="loader" style="background: #eb5757" @click="dropCard"
    >Отменить</v-btn
  >
</template>

<script>
import axios from '@/axios.js'

export default {
  emits: ['updateOrder'],

  props: {
    cardId: Number,
    position: String
  },
  data() {
    return {
      loader: false
    }
  },
  methods: {
    async dropCard() {
      this.loader = true
      try {
        const dataToUpdate = {
          position: this.position
        }

        const response = await axios.patch(`factory/card/${this.cardId}`, dataToUpdate)

        // Handle the response, e.g., update your component's data with the new data
        console.log('Response from PATCH request:', response.data)
        this.$emit('updateOrder')
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error updating resource:', error)
      } finally {
        this.loader = false
      }
    }
  }
}
</script>

<style></style>
