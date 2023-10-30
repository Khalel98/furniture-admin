<template>
  <v-btn :loading="loader" class="workshop__order cancel" @click="confirmation">Отменить</v-btn>
</template>

<script>
import axios from '@/axios.js'

export default {
  emits: ['updateOrder'],
  props: {
    id: String,
    position: String
  },
  data() {
    return {
      loader: false
    }
  },
  methods: {
    confirmation() {
      if (confirm('Вы уверены что хотите отменить заказ?')) {
        this.cancelOrder()
      } else {
        console.log('Отмена')
      }
    },
    async cancelOrder() {
      this.loader = true

      try {
        const response = await axios.post('factory/cancel/order', {
          id: this.id,
          position: this.position
        })
        console.log(response.data)
        this.$emit('updateOrder')
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.loader = false
      }
    }
  }
}
</script>

<style></style>
