<template>
  <v-btn class="takeOrder" :loading="loader" style="background: #2176ff" @click="takeOrder"
    >Взять заказ</v-btn
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
    async takeOrder() {
      this.loader = true
      try {
        const response = await axios.post('office/take/order', {
          id: this.cardId,
          position: this.position
        })
        console.log(response)
        this.$emit('updateOrder')
      } catch (error) {
        console.error('Error:', error.response.data.message)
        alert(error.response.data.message)
      } finally {
        this.loader = false
      }
    }
  }
}
</script>

<style></style>
