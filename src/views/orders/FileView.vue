<template>
  <div class="section__file">
    <div class="section__file__back">
      <div class="back__action" @click="goBack">&#8592; Назад</div>

      <v-btn class="section__file__all" :loading="loading" @click="downloadAll">
        Скачать все
      </v-btn>
    </div>
    <div class="section__file__doc__title">Загрузить</div>

    <div class="section__file__save">
      <div class="section__file__save__input">
        <v-file-input
          variant="outlined"
          chips
          multiple
          v-model="selectedFiles"
          label="Файл"
        ></v-file-input>
      </div>
      <div class="section__file__save__action">
        <v-btn class="section__file__save__action__btn" @click="save"> Сохранить </v-btn>
      </div>
    </div>
    <div class="section__file__doc__title" v-if="files.img.length">Фотографии</div>

    <div class="section__file__images">
      <Fancybox
        :options="{
          Carousel: {
            infinite: false
          }
        }"
      >
        <a
          class="section__file__images__link"
          data-fancybox="gallery"
          v-for="img in files.img"
          :key="img.id"
          :href="img.link"
        >
          <div class="delete__icon" @click="this.confirmDeleteFile(img.position, img.id)">
            <v-icon size="large" color="#eb5757" icon="mdi mdi-close"></v-icon>
          </div>
          <img :src="img.link" />
        </a>
      </Fancybox>
    </div>

    <a :href="img.link" v-for="img in files.img" :key="img.id" style="display: none">
      <img :src="img.link" width="200" height="150" />
    </a>
    <div class="section__file__doc__title" v-if="files.doc.length">Файлы</div>
    <div class="section__file__row">
      <div class="section__file__doc" v-for="file in files.doc" :key="file.id">
        <div class="section__file__doc__item">
          <img
            v-if="file.extension == 'docx'"
            src="@/assets/files/docx.svg"
            alt=""
            class="section__file__doc__item__img"
          />
          <img
            v-else-if="file.extension == 'pdf'"
            src="@/assets/files/pdf.png"
            alt=""
            class="section__file__doc__item__img"
          />
          <img
            v-else-if="file.extension == 'xlsx'"
            src="@/assets/files/excel.svg"
            alt=""
            class="section__file__doc__item__img"
          />
          <img v-else src="@/assets/files/file.svg" alt="" class="section__file__doc__item__img" />
          <div class="section__file__doc__item__content">
            <div class="section__file__doc__item__content__title">
              {{ file.file_name.substring(0, 20) }}
            </div>
            <div class="section__file__doc__item__content__action">
              <a :href="file.link" target="_blank" :download="file.file_name">
                <v-icon size="large" color="green-darken-2" icon="mdi mdi-open-in-new"></v-icon>
              </a>
              <v-icon
                @click="this.confirmDeleteFile(file.position, file.id)"
                size="large"
                color="#eb5757"
                icon="mdi mdi-delete-empty"
              ></v-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios.js'
import Fancybox from '@/components/file__manager/Fancybox.vue'

export default {
  components: {
    Fancybox
  },
  data() {
    return {
      selectedFiles: null,
      loading: false,
      files: {
        img: [],
        doc: []
      }
    }
  },
  methods: {
    async save() {
      const formData = new FormData()
      this.selectedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file)
      })

      // Add technologists values to the FormData
      formData.append('position', this.position) // Use the value from the 'technologists' object
      formData.append('order_id', this.orderId) // Use the value from the 'technologists' object

      try {
        const response = await axios.post('file/save', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        console.log('Files uploaded successfully:', response.data)
        this.showFiles()
        this.selectedFiles = null
      } catch (error) {
        console.error('File upload failed:', error)
        alert('Что-то пошло не так')
      }
    },
    async showFiles() {
      try {
        const response = await axios.get('file/list', {
          params: {
            position: this.position,
            order_id: this.orderId
          }
        })

        this.files = response.data
      } catch (error) {
        console.error(error)
        alert(error.response.data.message || 'Что-то пошло не так!')
      }
    },

    async downloadAll() {
      this.loading = true
      try {
        const response = await axios.get('file/download', {
          params: {
            position: this.position,
            order_id: this.orderId
          }
        })

        const link = document.createElement('a')
        link.href = response.data.link
        link.target = '_blank'
        link.download = ''

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.loading = false
      } catch (error) {
        console.error(error)
        alert(error.response.data.message || 'Что-то пошло не так!')
      }
    },
    async deleteFile(position, id) {
      try {
        const response = await axios.get('file/deleted', {
          params: {
            position: position,
            file_id: id
          }
        })
        console.log(response.data)
        this.showFiles()
      } catch (error) {
        console.error(error)
      }
    },
    confirmDeleteFile(position, id) {
      if (confirm('Уверены что хотите удалить?')) {
        this.deleteFile(position, id)
      } else {
        console.log('Отмена')
      }
    },
    goBack() {
      this.$router.go(-1) // Перейти на один шаг назад в истории маршрута
    }
  },
  computed: {
    orderId() {
      return this.$route.params.id
    },
    position() {
      return this.$route.params.position
    }
  },
  mounted() {
    this.showFiles()
  }
}
</script>

<style></style>
