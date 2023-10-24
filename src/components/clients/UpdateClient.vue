<template>
  <div class="section__modal__editHeader">
    <div class="section__modal__title">
      Клиент:
      <strong>{{
        this.originalData.surname + ' ' + this.originalData.name + ' ' + this.originalData.lastname
      }}</strong>
    </div>
    <v-icon size="small" @click="open"> mdi-pencil </v-icon>
  </div>

  <div class="client__info">
    <div class="client__info__text">
      ИИН: <strong>{{ this.originalData.iin }}</strong>
    </div>
    <div class="client__info__text">
      Телефон: <strong>{{ this.originalData.phone }}</strong>
    </div>
    <div class="client__info__text">
      Почта: <strong>{{ this.originalData.email }}</strong>
    </div>
    <div class="client__info__text">
      Создан: <strong>{{ new Date(this.originalData.created_at).toLocaleString('ru-RU') }}</strong>
    </div>
  </div>

  <v-form ref="form" v-if="formShow">
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          :rules="[
            (v) => !!v || 'Введите Имя',
            (v) => /^[А-Яа-яЁё]+$/.test(v) || 'Введите только кириллические символы'
          ]"
          variant="outlined"
          v-model="editClient.name"
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
          v-model="editClient.surname"
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
          v-model="editClient.lastname"
          label="Отчество"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          :rules="[
            (v) => !!v || 'Введите ИИН',
            (v) => (v.length > 11 && v.length < 13) || 'ИИН должен состоять из 12ти цифр',
            (v) => /^\d+$/.test(v) || 'ИИН состоит только из цифр'
          ]"
          :counter="12"
          variant="outlined"
          v-model="editClient.iin"
          label="ИИН"
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
          v-model="editClient.phone"
          label="Телефон"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          :rules="[
            (v) => !!v || 'Введите Почту',
            (v) => /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v) || 'Почта введена некоректно'
          ]"
          variant="outlined"
          v-model="editClient.email"
          label="Почта"
        ></v-text-field>
      </v-col>
    </v-row>

    <div class="section__modal__action">
      <v-btn class="section__modal__btn cancel" @click="this.closeForm">Отменить</v-btn>
      <v-btn class="section__modal__btn aprove" @click="this.validateForm" :loading="loader"
        >Создать</v-btn
      >
    </div>
  </v-form>
</template>

<script>
import axios from '@/axios.js'
export default {
  emits: ['save'],

  props: {
    clientData: Object
  },

  data() {
    return {
      loader: false,
      formShow: false,
      originalData: { ...this.clientData },
      editClient: { ...this.clientData }
    }
  },

  methods: {
    async validateForm() {
      const { valid } = await this.$refs.form.validate()

      if (valid) {
        this.updateClient()
        this.loader = true
      }
    },
    closeForm() {
      this.formShow = false
      this.editClient = { ...this.clientData }
    },
    open() {
      this.formShow = true
    },
    async updateClient() {
      try {
        const response = await axios.patch('/api/v1/clients/update', this.editClient)
        console.log('Response:', response.data)
        this.originalData = { ...this.editClient }
        this.formShow = false
        this.$emit('save')
      } catch (error) {
        console.error('Error:', error)
        alert('Что-то пошло не так')
      } finally {
        this.loader = false
      }
    }
  }
}
</script>

<style></style>
