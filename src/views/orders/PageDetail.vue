<template>
  <div class="order">
    <div class="order__title">Заказ</div>

    <div class="section__row">
      <div class="order__item" v-for="item in data" :key="item.id">
        <div class="order__item__position">
          {{ item.position_name }}
        </div>
        <div class="order__item__text">
          <strong>Дата создания: </strong>{{ new Date(item.created_at).toLocaleString('ru-RU') }}
        </div>
        <div class="order__item__text"><strong>Дата принятия:</strong> {{ item.take_date }}</div>
        <div class="order__item__text">
          <strong>Файл:</strong>
          <a v-if="item.file" :href="item.file">{{ item.file.slice(-20) }}</a>
          <span v-if="!item.file">Отсутствует</span>
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

        <div class="order__item__actions">
          <v-icon
            size="small"
            class="me-2"
            v-if="item.file"
            @click="setPostion(item.position, 'edit')"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            size="small"
            class="me-2"
            v-if="!item.file"
            @click="setPostion(item.position, 'save')"
          >
            mdi mdi-content-save-outline
          </v-icon>
          <v-icon size="small" class="me-2" v-if="item.file" @click="this.delete(item.position)">
            mdi-delete
          </v-icon>
        </div>
      </div>
    </div>
  </div>

  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="500px">
      <div class="section__modal">
        <div class="section__modal__title">Загрузите файл</div>
        <v-file-input chips multiple v-model="selectedFiles" label="Файл"></v-file-input>

        <div class="section__modal__action">
          <v-btn color="green-darken-1" variant="text" @click="close"> Отмена </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="save" v-if="this.type == 'save'">
            Сохранить
          </v-btn>

          <v-btn color="green-darken-1" variant="text" @click="update" v-if="this.type == 'edit'">
            Редактировать
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from '@/axios.js'

export default {
  name: 'PageDetail',
  data() {
    return {
      data: null,
      dialog: false,
      selectedFiles: [],
      position: null,
      type: null
    }
  },
  methods: {
    async getData() {
      const data = {
        id: this.orderId
      }

      try {
        const response = await axios.get('/api/v1/orders/positions', {
          params: data
        })
        console.log('Response:', response.data)
        this.data = response.data
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
      formData.append('dir', this.position) // Use the value from the 'technologists' object
      formData.append('id', this.orderId) // Use the value from the 'technologists' object

      try {
        const response = await axios.post('/api/v1/file/save', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        console.log('Files uploaded successfully:', response.data)
        this.close()
      } catch (error) {
        console.error('File upload failed:', error)
        this.close()
      }
    },
    async update() {
      const formData = new FormData()
      this.selectedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file)
      })

      // Add technologists values to the FormData
      formData.append('dir', this.position) // Use the value from the 'technologists' object
      formData.append('id', this.orderId) // Use the value from the 'technologists' object

      try {
        const response = await axios.post('/api/v1/file/update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        console.log('Files uploaded successfully:', response.data)
        this.close()
      } catch (error) {
        console.error('File upload failed:', error)
        alert('Что-то пошло не так')
      }
    },
    close() {
      ;(this.position = null), (this.dialog = false)
      this.selectedFiles = null
      this.getData()
    },

    async delete(position) {
      const data = {
        dir: position,
        id: this.orderId
      }
      try {
        const response = await axios.get('/api/v1/file/deleted', {
          params: data
        })
        console.log('Response:', response.data)
        this.getData()
      } catch (error) {
        console.error('Error:', error)
        alert(error.response.data.message || 'Что-то пошло не так')
        this.getData()
      }
    }
  },
  computed: {
    orderId() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style>
.my-custom-class {
  padding-top: 10px !important;
}
</style>
