<template>
  <div class="section__comments" v-if="comments">
    <div class="section__comments__title">Комментарии:</div>
    <AddComment :order_id="order_id" @getComment="getComment" />
    <div class="section__comments__item" v-for="comment in comments" :key="comment.id">
      <div class="section__comments__item__header">
        <div class="section__comments__item__header__user">
          <div class="section__comments__item__position">{{ comment.position }}:</div>
          <div class="section__comments__item__name">{{ comment.name }}</div>
        </div>
        <div class="section__comments__item__time">
          {{ new Date(comment.created_at).toLocaleString('ru-RU') }}
        </div>
      </div>

      <div class="section__comments__item__comment">
        <div class="section__comments__item__comment__text">{{ comment.comment }}</div>
        <div
          class="section__comments__item__comment__close"
          v-if="currentUserId == comment.user_id"
        >
          <v-icon size="small" color="red" @click="confirmDeletion(comment.id)"> mdi-close </v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios.js'
import AddComment from '@/components/comment/AddComment.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    AddComment
  },
  props: {
    order_id: String
  },
  data() {
    return {
      comments: null
    }
  },
  methods: {
    async getComment() {
      try {
        const response = await axios.get('order/comment', {
          params: {
            order_id: this.order_id
          }
        })

        console.log(response.data)

        this.comments = response.data.reverse()
      } catch (error) {
        console.error(error)
      }
    },

    confirmDeletion(id) {
      if (confirm('Вы уверены, что хотите удалить?')) {
        this.deleteComment(id)
      } else {
        console.log('Отмена')
      }
    },
    async deleteComment(id) {
      try {
        axios.delete(`order/comment/${id}`)
        this.getComment()
      } catch (error) {
        console.error(error)
        alert(error.response.data.message || 'Что-то пошло не так!')
      }
    }
  },
  mounted() {
    this.getComment()
    console.log('test')
  },
  computed: {
    ...mapGetters(['currentUserId'])
  }
}
</script>

<style></style>
