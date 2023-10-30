<template>
  <v-btn :loading="loader" class="workshop__order take" @click="takeOrder">Начать</v-btn>
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
    async takeOrder() {
      this.loader = true
      try {
        const response = await axios.post('office/take/order', {
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
