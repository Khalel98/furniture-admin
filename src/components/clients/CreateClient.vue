<template>
  <v-form ref="form">
    <div class="section__modal__title">Создать Клиента</div>

    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          :rules="[
            (v) => !!v || 'Введите ИИН',
            (v) => (v.length > 11 && v.length < 13) || 'ИИН должен состоять из 12ти цифр',
            (v) => /^\d+$/.test(v) || 'ИИН состоит только из цифр'
          ]"
          :counter="12"
          variant="outlined"
          v-model="newClient.iin"
          label="ИИН"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          :rules="[
            (v) => !!v || 'Введите Почту',
            (v) => /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v) || 'Почта введена некоректно'
          ]"
          variant="outlined"
          v-model="newClient.email"
          label="Почта"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          :rules="[
            (v) => !!v || 'Введите Имя',
            (v) => /^[А-Яа-яЁё]+$/.test(v) || 'Введите только кириллические символы'
          ]"
          variant="outlined"
          v-model="newClient.name"
          label="Имя"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          :rules="[
            (v) => !!v || 'Введите Фамилию',
            (v) => /^[А-Яа-яЁё]+$/.test(v) || 'Введите только кириллические символы'
          ]"
          variant="outlined"
          v-model="newClient.surname"
          label="Фамилия"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          :rules="[
            (v) => !!v || 'Введите Отчество',
            (v) => /^[А-Яа-яЁё]+$/.test(v) || 'Введите только кириллические символы'
          ]"
          variant="outlined"
          v-model="newClient.lastname"
          label="Отчество"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          :rules="[
            (v) => !!v || 'Введите Телефон',
            (v) => (v.length > 10 && v.length < 12) || 'Телефон должен состоять из 11ти цифр',
            (v) => /^\d+$/.test(v) || 'Телефон состоит только из цифр'
          ]"
          :counter="11"
          variant="outlined"
          v-model="newClient.phone"
          label="Телефон"
        ></v-text-field>
      </v-col>
    </v-row>

    <div class="section__modal__action">
      <v-btn class="section__modal__btn cancel" @click="this.closeModal">Отменить</v-btn>
      <v-btn class="section__modal__btn aprove" @click="this.validateForm">Создать</v-btn>
    </div>
  </v-form>
</template>

<script>
import axios from '@/axios.js'

export default {
  emits: ['closeModal', 'checkUserPresent'],

  data() {
    return {
      newClient: {
        iin: '',
        email: '',
        name: '',
        surname: '',
        lastname: '',
        phone: ''
      }
    }
  },
  methods: {
    async validateForm() {
      const { valid } = await this.$refs.form.validate()

      if (valid) {
        this.createClient()
      }
    },
    async createClient() {
      const data = {
        iin: this.newClient.iin,
        email: this.newClient.email,
        name: this.newClient.name,
        surname: this.newClient.surname,
        lastname: this.newClient.lastname,
        phone: this.newClient.phone
      }
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.$store.getters.activeToken}`
      }
      try {
        const response = await axios.get('/api/v1/clients/create', {
          headers,
          params: data
        })
        console.log('Response:', response.data)
        this.$emit('checkUserPresent', true, 3, response.data)
      } catch (error) {
        console.error('Error:', error)
        alert(error.response.data.message || 'Что-то пошло не так')
        this.$emit('checkUserPresent', false, 1, null)
      }
    },
    closeModal() {
      this.$emit('closeModal')
    }
  }
}
</script>

<style></style>
