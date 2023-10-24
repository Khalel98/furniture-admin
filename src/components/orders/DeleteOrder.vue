<template>
  <v-icon size="small" @click="dialog = !dialog"> mdi-delete </v-icon>
  <v-dialog v-model="dialog" max-width="500px">
    <div class="section__modal">
      <div class="section__modal__title">Удалить заказ</div>
      <div class="section__modal__title">Вы точно уверены что хотите удалить заказ?</div>
      <div class="section__modal__action">
        <v-btn class="section__modal__btn cancel" @click="this.closeModal"> Отменить </v-btn>
        <v-btn class="section__modal__btn aprove" @click="this.deleteData">Удалить</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import axios from '@/axios.js'

export default {
  emits: ['save'],
  props: {
    dataDefault: Object
  },
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    async deleteData() {
      try {
        const url = '/api/v1/orders/destroy'
        await axios.delete(url, {
          data: {
            id: `${this.dataDefault.id}`
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.getters.activeToken}`
          }
        })
        this.closeModal()
        this.$emit('save')
      } catch (error) {
        console.error('Error deleting data:', error)
        alert('Что-то пошло не так')
      }
    },

    closeModal() {
      this.dialog = false
      console.log('close')
    }
  }
}
</script>
