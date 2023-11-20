<template>
  <span @click="loadData">Открыть</span>

  <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="#333a48">
        <v-toolbar-title>Файлы</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn variant="text" @click="dialog = false"> Закрыть </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <pre>{{ this.files }}</pre>
      <div>
        <Fancybox
          :options="{
            Carousel: {
              infinite: false
            }
          }"
        >
          <a data-fancybox="gallery" href="https://lipsum.app/id/60/1600x1200">
            <img src="https://lipsum.app/id/60/200x150" width="200" height="150" />
          </a>
          <a data-fancybox="gallery" href="https://lipsum.app/id/61/1600x1200">
            <img src="https://lipsum.app/id/61/200x150" width="200" height="150" />
          </a>
          <a data-fancybox="gallery" href="https://lipsum.app/id/62/1600x1200">
            <img src="https://lipsum.app/id/62/200x150" width="200" height="150" />
          </a>
          <a data-fancybox="gallery" href="https://lipsum.app/id/63/1600x1200">
            <img src="https://lipsum.app/id/63/200x150" width="200" height="150" />
          </a>
          <a data-fancybox="gallery" href="https://lipsum.app/id/64/1600x1200">
            <img src="https://lipsum.app/id/64/200x150" width="200" height="150" />
          </a>
        </Fancybox>
      </div>

      <div class="fileManager">
        <div class="fileManager__row">
          <div class="fileManager__item" v-for="file in files" :key="file.id">
            <div
              class="fileManager__item__img"
              v-if="(file.extension = 'jpg' || 'jpeg' || 'png' || 'gif')"
            >
              <img :src="file.link" alt="" />
            </div>
          </div>
        </div>
      </div>

      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from '@/axios.js'
import Fancybox from '@/components/file__manager/Fancybox.vue'

export default {
  components: {
    Fancybox
  },
  props: {
    position: {
      type: String
    },
    orderId: {
      type: String
    }
  },
  data() {
    return {
      dialog: false,
      files: []
    }
  },
  methods: {
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
    loadData() {
      this.dialog = true
      this.showFiles()
    }
  },

  mounted() {}
}
</script>

<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>
