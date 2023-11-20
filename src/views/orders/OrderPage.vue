<template>
  <div class="order">
    <div class="back__action" @click="goBack">&#8592; Назад</div>

    <div class="order__title">Заказ</div>
    <div
      class="section__row"
      style="justify-content: space-between"
      v-if="currentRole.includes('foreman')"
    >
      <CreateCard v-if="this.orderStatus == 1" :orderId="this.orderId" @updateOrder="getData" />

      <v-btn
        v-if="this.orderStatus == 1"
        class="addCard bgBlue"
        style="margin-bottom: 20px"
        @click="directorAprove(this.send)"
        >Принять</v-btn
      >

      <div v-if="this.orderStatus == 2"></div>
      <v-btn
        v-if="this.orderStatus == 2"
        class="addCard bgOrange"
        style="margin-bottom: 20px"
        @click="directorAprove(this.completed)"
        >Завершить</v-btn
      >
    </div>
    <div class="section__row">
      <div class="order__item" v-for="item in data" :key="item.id">
        <DeleteCard
          :cardId="item.id"
          @updateOrder="getData"
          v-if="
            item.position != 'design' &&
            item.position != 'technologists' &&
            item.position != 'metrings' &&
            currentRole.includes('foreman')
          "
        />
        <div class="order__item__position">
          {{ item.position_name }}
        </div>
        <div class="order__item__text">
          <strong>Дата создания: </strong>{{ new Date(item.created_at).toLocaleString('ru-RU') }}
        </div>
        <div class="order__item__text"><strong>Дата принятия:</strong> {{ item.take_date }}</div>
        <div class="order__item__text">
          <strong>Дата завершения:</strong> {{ item.passed_date }}
        </div>
        <div
          class="order__item__text"
          v-if="
            item.position == 'design' ||
            item.position == 'technologists' ||
            item.position == 'metrings'
          "
        >
          <strong>Файл:</strong>

          <!-- <router-link v-if="item.file" :to="this.orderId + '/' + item.position"
            >Перейти</router-link
          > -->
          <router-link
            v-if="item.file"
            style="color: #2176ff; text-decoration: none"
            :to="{ name: 'files', params: { id: this.orderId, position: item.position } }"
          >
            Открыть</router-link
          >
          <span v-if="!item.file">Отсутствует</span>
        </div>

        <br />

        <div v-if="currentRole.includes(item.position)">
          <TakeCard
            :cardId="item.id"
            :position="item.position"
            @updateOrder="getData"
            v-if="
              item.status == 0 &&
              (item.position == 'design' ||
                item.position == 'technologists' ||
                item.position == 'metrings')
            "
          />
          <DropCard
            :cardId="item.id"
            :position="item.position"
            @updateOrder="getData"
            v-if="
              item.status == 1 &&
              (item.position == 'design' ||
                item.position == 'technologists' ||
                item.position == 'metrings')
            "
          />
        </div>

        <div class="order__item__role">
          <img
            v-if="item.position == 'design'"
            class="order__item__icon"
            src="@/assets/jobs/design.png"
            alt=""
          />
          <img
            v-if="item.position == 'technologists'"
            class="order__item__icon"
            src="@/assets/jobs/technologists.png"
            alt=""
          />
          <img
            v-if="item.position == 'metrings'"
            class="order__item__icon"
            src="@/assets/jobs/metrings.png"
            alt=""
          />
          <img
            v-if="item.position == 'sawyer'"
            class="order__item__icon"
            src="@/assets/jobs/sawyer.png"
            alt=""
          />

          <div class="order__item__role__name">{{ item.user_name }}</div>
        </div>

        <div
          class="order__item__actions"
          v-if="
            item.status > 0 &&
            (item.position == 'design' ||
              item.position == 'technologists' ||
              item.position == 'metrings') &&
            currentRole.includes(item.position)
          "
        >
          <v-icon
            size="small"
            class="me-2"
            v-if="!item.file"
            @click="setPostion(item.position, 'save')"
          >
            mdi mdi-content-save-outline
          </v-icon>
        </div>
      </div>
    </div>

    <ShowComment :order_id="orderId" />
  </div>

  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="500px">
      <div class="section__modal">
        <div class="section__modal__title">Загрузите файл</div>
        <v-file-input chips multiple v-model="selectedFiles" label="Файл"></v-file-input>

        <div class="section__modal__action">
          <v-btn class="section__modal__btn cancel" @click="close"> Отмена </v-btn>
          <v-btn class="section__modal__btn aprove" @click="save" v-if="this.type == 'save'">
            Сохранить
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from '@/axios.js'
import CreateCard from '@/components/cards/CreateCard.vue'
import DropCard from '@/components/cards/DropCard.vue'
import TakeCard from '@/components/cards/TakeCard.vue'
import DeleteCard from '@/components/cards/DeleteCard.vue'
import ShowComment from '@/components/comment/ShowComment.vue'

export default {
  name: 'PageDetail',
  components: {
    CreateCard,
    DropCard,
    TakeCard,
    DeleteCard,
    ShowComment
  },
  data() {
    return {
      data: null,
      dialog: false,
      selectedFiles: [],
      position: null,
      type: null,
      order: null,
      orderStatus: null,
      send: 'send',
      completed: 'completed'
    }
  },
  methods: {
    async getData() {
      const data = {
        id: this.orderId
      }
      try {
        const response = await axios.get('order/list/cards', {
          params: data
        })
        console.log('Response:', response.data)
        this.data = response.data
      } catch (error) {
        console.error('Error:', error)
        alert('Что-то пошло не так')
      }
    },

    async getOrder() {
      const data = {
        id: this.orderId
      }

      try {
        const response = await axios.get('orders/show', {
          params: data
        })
        console.log('Response:', response.data)
        this.order = response.data
        this.orderStatus = response.data.order.status
        console.log()
      } catch (error) {
        console.error('Error:', error)
        alert('Что-то пошло не так')
      }
    },

    async directorAprove(action) {
      try {
        const response = await axios.get(`order/${action}/${this.orderId}`)
        console.log('Response:', response.data)
        this.getData()
        this.getOrder()
      } catch (error) {
        console.error('Error:', error)
        alert('Что-то пошло не так')
      }
    },

    setPostion(position, type) {
      this.dialog = true
      this.position = position
      if (type == 'edit') {
        this.type = 'edit'
      } else {
        this.type = 'save'
      }
    },

    async save() {
      const formData = new FormData()
      this.selectedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file)
      })

      // Add technologists values to the FormData
      formData.append('order_id', this.orderId) // Use the value from the 'technologists' object
      formData.append('position', this.position) // Use the value from the 'technologists' object

      try {
        const response = await axios.post('file/save', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        console.log('Files uploaded successfully:', response)
        this.close()
      } catch (error) {
        console.error('File upload failed:', error)
        this.close()
      }
    },

    close() {
      ;(this.position = null), (this.dialog = false)
      this.selectedFiles = null
      this.getData()
    },
    goBack() {
      this.$router.go(-1) // Перейти на один шаг назад в истории маршрута
    }
  },
  computed: {
    orderId() {
      return this.$route.params.id
    },
    currentRole() {
      return this.$store.getters.currentRole.map((item) => item.to.replace('/', ''))
    }
  },
  mounted() {
    this.getData()
    this.getOrder()
  }
}
</script>
