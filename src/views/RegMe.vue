<template>
  <div class="section__video">
    <div class="section__video__title" v-if="this.entranceStatus.date_entrance">
      Время входа: {{ this.entranceStatus.date_entrance }}
    </div>
    <div class="section__video__title" v-if="this.entranceStatus.date_exit">
      Время выхода: {{ this.entranceStatus.date_exit }}
    </div>

    <div class="section__video__title" v-if="this.entranceStatus.message">
      {{ this.entranceStatus.message }}
    </div>
    <div class="section__video__stream">
      <div v-if="status == 0" class="wrapper">
        <!-- <v-skeleton-loader type="card"></v-skeleton-loader> -->
      </div>
      <video v-show="status == 1" ref="video" @canplay="initCanvas">Video</video>
      <img v-if="status == 2" :src="temp" alt="" />

      <div v-if="status == 3" class="wrapper entrance">
        <div class="wrapper__item">
          <div class="wrapper__icon">
            <v-icon color="#f79824" size="large" @click="dialog = !dialog"> mdi-check </v-icon>
          </div>
          <div class="wrapper__title">Вы успешно зашли!</div>
        </div>
      </div>

      <div v-if="status == 4" class="wrapper exit">
        <div class="wrapper__item">
          <div class="wrapper__icon">
            <v-icon color="#f79824" size="large" @click="dialog = !dialog"> mdi-check </v-icon>
          </div>
          <div class="wrapper__title">Вы успешно вышли!</div>
        </div>
      </div>
    </div>
    <canvas ref="canvas" style="display: none" />
    <div class="section__video__actions">
      <v-btn
        :loading="markLoader"
        class="section__video__actions__btn aprove"
        v-if="status == 0"
        @click="startCapture()"
        >Отметится</v-btn
      >
      <v-btn class="section__video__actions__btn aprove" v-if="status == 1" @click="takePicture()"
        >Снять</v-btn
      >
      <v-btn class="section__video__actions__btn check" v-if="status == 2" @click="status = 0"
        >Переснять</v-btn
      >

      <v-btn
        class="section__video__actions__btn finish"
        v-if="status == 2"
        @click="this.save(this.formData)"
        >Зарегистрировать</v-btn
      >
    </div>
  </div>
</template>

<script>
import axios from '@/axios.js'

export default {
  data() {
    return {
      video: null,
      temp: null,
      formData: null,
      mediaStream: null,
      status: 0,
      markLoader: false,
      entranceStatus: {
        date_exit: null,
        date_entrance: null,
        message: null
      }
    }
  },
  methods: {
    startCapture() {
      this.status = 0
      this.markLoader = true
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          this.mediaStream = stream // Store the media stream
          this.video.srcObject = stream
          this.video.play()
          setTimeout(() => {
            this.status = 1
            this.markLoader = false
          }, 1500) // Delay for 500 milliseconds (adjust as needed)
        })
        .catch((error) => {
          console.log(error)
          this.markLoader = false
        })
    },

    takePicture() {
      let context = this.canvas.getContext('2d')
      context.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight)
      this.temp = this.canvas.toDataURL('image/png')
      this.status = 2
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((track) => track.stop())
      }

      this.canvas.toBlob((blob) => {
        // Create a FormData object and append the Blob as a file
        this.formData = new FormData()
        this.formData.append('file', new File([blob], 'captured_image.png', { type: 'image/png' }))
      }, 'image/png')
    },
    async save(formData) {
      try {
        const response = await axios.post('regmy/registration', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        console.log('Files uploaded successfully:', response.data.action)
        if (response.data.action == 'entrance') {
          this.status = 3
          setTimeout(() => {
            this.status = 0
          }, 2000)
        } else if (response.data.action == 'exit') {
          this.status = 4
          setTimeout(() => {
            this.status = 0
          }, 2000)
        }
        this.checkStatus()
      } catch (error) {
        console.error('File upload failed:', error)
        alert(error.response.data.message || 'Что-то пошло не так!')
        location.reload()
      }
    },
    initCanvas() {
      this.canvas.setAttribute('width', this.video.videoWidth)
      this.canvas.setAttribute('height', this.video.videoHeight)
    },
    async checkStatus() {
      try {
        const url = 'regmy/check'
        const response = await axios.get(url)
        console.log(response.data)
        this.entranceStatus = response.data
      } catch (error) {
        console.error('Error deleting data:', error)
        alert('Что-то пошло не так')
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      setTimeout(() => {
        next()
      }, 500) // Delay for 500 milliseconds (adjust as needed)
    } else {
      next()
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas
    this.video = this.$refs.video
    this.checkStatus()
  }
}
</script>

<style lang="scss"></style>
