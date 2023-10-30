<template>
  <div class="order__delete">
    <!-- <v-btn class="takeOrder" :loading="loader" style="background: #eb5757" @click="dropCard"
      >Отменить</v-btn
    > -->
    <v-icon size="small" class="me-2" @click="deleteItem"> mdi-close </v-icon>
  </div>
</template>

<script>
import axios from '@/axios.js'

export default {
  emits: ['updateOrder'],
  props: {
    cardId: Number
  },

  methods: {
    async deleteItem() {
      await axios
        .delete(`factory/card/${this.cardId}`)
        .then((response) => {
          console.log('Item deleted successfully', response)
          this.$emit('updateOrder')
        })
        .catch((error) => {
          console.error('Error deleting item', error)
          alert(error.response.data.message)
        })
    }
  }
}
</script>

<style></style>
