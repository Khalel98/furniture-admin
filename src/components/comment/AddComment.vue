<template>
  <div class="section__comments__add">
    <div class="section__comments__add__input">
      <v-form ref="form">
        <v-textarea v-model="comment" clearable label="Текст" variant="outlined"></v-textarea>
      </v-form>
    </div>

    <v-btn
      class="section__comments__add__action"
      :loading="loadingAprove"
      @click="this.validateForm"
      >Отправить</v-btn
    >
  </div>
</template>

<script>
import axios from '@/axios.js'

export default {
  emit: ['getComment'],
  props: {
    order_id: String
  },
  data() {
    return {
      comment: null,
      loadingAprove: false
    }
  },
  methods: {
    async validateForm() {
      this.loadingAprove = true
      const { valid } = await this.$refs.form.validate()

      if (valid) {
        this.addComment()
      }
    },

    async addComment() {
      try {
        const response = await axios.get('order/comment/create', {
          params: {
            comment: this.comment,
            order_id: this.order_id
          }
        })
        console.log(response.data)
        this.$emit('getComment')
        this.comment = null
      } catch (error) {
        console.error(error)
      } finally {
        this.loadingAprove = false
      }
    }
  }
}
</script>

<style></style>
