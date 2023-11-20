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
      <div
        v-if="status == 0"
        class="wrapper"
        style="display: flex; justify-content: center; align-items: center"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 197 197"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M196.609 13.1875V43.0469C196.609 44.1782 196.16 45.2632 195.36 46.0631C194.56 46.8631 193.475 47.3125 192.344 47.3125C191.212 47.3125 190.127 46.8631 189.327 46.0631C188.528 45.2632 188.078 44.1782 188.078 43.0469V13.1875C188.078 12.0562 187.629 10.9712 186.829 10.1712C186.029 9.3713 184.944 8.9219 183.812 8.9219H153.953C152.822 8.9219 151.737 8.4725 150.937 7.6725C150.137 6.8725 149.688 5.7876 149.688 4.6562C149.688 3.5249 150.137 2.44 150.937 1.64C151.737 0.839996 152.822 0.390594 153.953 0.390594H183.812C187.206 0.390594 190.461 1.73889 192.861 4.13869C195.261 6.53859 196.609 9.7936 196.609 13.1875ZM192.344 149.688C191.212 149.688 190.127 150.137 189.327 150.937C188.528 151.737 188.078 152.822 188.078 153.953V183.812C188.078 184.944 187.629 186.029 186.829 186.829C186.029 187.629 184.944 188.078 183.812 188.078H153.953C152.822 188.078 151.737 188.528 150.937 189.327C150.137 190.127 149.688 191.212 149.688 192.344C149.688 193.475 150.137 194.56 150.937 195.36C151.737 196.16 152.822 196.609 153.953 196.609H183.812C187.206 196.609 190.461 195.261 192.861 192.861C195.261 190.461 196.609 187.206 196.609 183.812V153.953C196.609 152.822 196.16 151.737 195.36 150.937C194.56 150.137 193.475 149.688 192.344 149.688ZM43.0469 188.078H13.1875C12.0562 188.078 10.9712 187.629 10.1712 186.829C9.3713 186.029 8.9219 184.944 8.9219 183.812V153.953C8.9219 152.822 8.4725 151.737 7.6725 150.937C6.8725 150.137 5.7876 149.688 4.6562 149.688C3.5249 149.688 2.44 150.137 1.64 150.937C0.839996 151.737 0.390594 152.822 0.390594 153.953V183.812C0.390594 187.206 1.73889 190.461 4.13869 192.861C6.53859 195.261 9.7936 196.609 13.1875 196.609H43.0469C44.1782 196.609 45.2632 196.16 46.0631 195.36C46.8631 194.56 47.3125 193.475 47.3125 192.344C47.3125 191.212 46.8631 190.127 46.0631 189.327C45.2632 188.528 44.1782 188.078 43.0469 188.078ZM4.6562 47.3125C5.7876 47.3125 6.8725 46.8631 7.6725 46.0631C8.4725 45.2632 8.9219 44.1782 8.9219 43.0469V13.1875C8.9219 12.0562 9.3713 10.9712 10.1712 10.1712C10.9712 9.3713 12.0562 8.9219 13.1875 8.9219H43.0469C44.1782 8.9219 45.2632 8.4725 46.0631 7.6725C46.8631 6.8725 47.3125 5.7876 47.3125 4.6562C47.3125 3.5249 46.8631 2.44 46.0631 1.64C45.2632 0.839996 44.1782 0.390594 43.0469 0.390594H13.1875C9.7936 0.390594 6.53859 1.73889 4.13869 4.13869C1.73889 6.53859 0.390594 9.7936 0.390594 13.1875V43.0469C0.390594 44.1782 0.839996 45.2632 1.64 46.0631C2.44 46.8631 3.5249 47.3125 4.6562 47.3125ZM149.688 145.422C149.025 145.422 148.372 145.268 147.78 144.972C147.188 144.675 146.672 144.245 146.275 143.716C140.712 136.299 133.499 130.279 125.207 126.133C116.915 121.987 107.771 119.828 98.5 119.828C89.229 119.828 80.085 121.987 71.793 126.133C63.501 130.279 56.2876 136.299 50.725 143.716C50.0462 144.621 49.0357 145.219 47.9158 145.379C46.7958 145.539 45.6582 145.248 44.7531 144.569C43.8481 143.89 43.2497 142.879 43.0897 141.76C42.9298 140.64 43.2212 139.502 43.9 138.597C52.557 126.985 64.702 118.446 78.558 114.229C71.4 109.878 65.862 103.305 62.788 95.513C59.7137 87.72 59.2728 79.136 61.5322 71.07C63.792 63.004 68.627 55.8975 75.302 50.8356C81.976 45.7738 90.123 43.0339 98.5 43.0339C106.877 43.0339 115.024 45.7738 121.698 50.8356C128.373 55.8975 133.208 63.004 135.468 71.07C137.727 79.136 137.286 87.72 134.212 95.513C131.138 103.305 125.6 109.878 118.442 114.229C132.298 118.446 144.443 126.985 153.1 138.597C153.575 139.231 153.865 139.984 153.936 140.773C154.007 141.562 153.857 142.355 153.503 143.064C153.149 143.772 152.604 144.368 151.93 144.785C151.256 145.201 150.48 145.422 149.688 145.422ZM98.5 111.297C104.406 111.297 110.179 109.546 115.089 106.265C119.999 102.984 123.826 98.32 126.086 92.864C128.346 87.408 128.938 81.404 127.786 75.612C126.634 69.82 123.79 64.5 119.614 60.3237C115.438 56.1478 110.117 53.304 104.325 52.1519C98.533 50.9997 92.529 51.591 87.073 53.851C81.617 56.111 76.954 59.9382 73.673 64.849C70.392 69.759 68.641 75.532 68.641 81.438C68.641 89.357 71.787 96.952 77.386 102.551C82.986 108.151 90.581 111.297 98.5 111.297Z"
            fill="grey"
          />
        </svg>
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
