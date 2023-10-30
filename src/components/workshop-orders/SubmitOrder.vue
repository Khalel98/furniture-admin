<template>
  <v-btn :loading="loader" class="workshop__order submit" @click="confirmation">Закончить</v-btn>
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
      if (confirm('Вы уверены что хотите закончить заказ?')) {
        this.submitOrder()
      } else {
        console.log('Отмена')
      }
    },
    async submitOrder() {
      this.loader = true

      try {
        const response = await axios.post('factory/submitted/order', {
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
