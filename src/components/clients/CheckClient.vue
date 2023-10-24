<template>
  <div class="section__modal__header">
    <div class="section__modal__title">Проверка клиентa</div>
    <v-btn class="section__modal__btn create" @click="this.createClient">Создать клиента </v-btn>
  </div>

  <div class="section__modal__error" v-if="alert">
    {{ this.errorMsg }}
  </div>
  <v-form ref="form">
    <v-text-field
      class="section__modal__input"
      variant="outlined"
      v-model="iin"
      label="ИИН"
      :rules="iinRules"
      :counter="12"
    ></v-text-field>

    <v-text-field
      class="section__modal__input"
      variant="outlined"
      v-model="phone"
      label="Телефон"
      :rules="phoneRules"
      :counter="11"
    ></v-text-field>

    <div class="section__modal__action">
      <v-btn class="section__modal__btn cancel" @click="this.closeModal">Отменить </v-btn>
      <v-btn class="section__modal__btn check" :loading="loadingAprove" @click="this.validateForm"
        >Проверить</v-btn
      >
    </div>
  </v-form>
</template>

<script>
import axios from '@/axios.js'

export default {
  emits: ['closeModal', 'checkUserPresent'],

  data() {
    return {
      iin: '981130350514',
      phone: '',
      step: null,
      loadingAprove: false,
      alert: false,
      errorMsg: '',
      iinRules: [
        (v) => v.length == 0 || v.length == 12 || 'ИИН должен состоять из 12ти цифр',
        (v) => /^\d+$/.test(v) || v.length == 0 || 'ИИН состоит только из цифр'
      ],
      phoneRules: [
        (v) => v.length == 0 || v.length == 11 || 'Телефон должен состоять из 11ти цифр',
        (v) => /^\d+$/.test(v) || v.length == 0 || 'Телефон состоит только из цифр'
      ]
    }
  },
  methods: {
    async validateForm() {
      this.alert = false
      const { valid } = await this.$refs.form.validate()

      if (valid && (this.iin || this.phone)) {
        this.checkUser()
      } else if (!this.iin && !this.phone) {
        this.errorMsg = 'Заполните одно из полей'
        this.alert = true
      }
    },
    async checkUser() {
      this.loadingAprove = true
      const data = {
        iin: this.iin,
        phone: this.phone
      }

      try {
        const response = await axios.get('/api/v1/clients/show', {
          params: data
        })
        console.log('Response:', response.data)
        this.$emit('checkUserPresent', true, 3, response.data)
      } catch (error) {
        console.error('Error:', error)
        console.log(error.response.data.message)
        this.alert = true
        this.errorMsg = error.response.data.message
      } finally {
        this.loadingAprove = false
      }
    },
    closeModal() {
      this.$emit('closeModal')
      console.log('close')
    },
    createClient() {
      this.$emit('checkUserPresent', false, 2, null)
    }
  }
}
</script>

<style>
.my-text-field {
  margin-bottom: 50px;
}
</style>
