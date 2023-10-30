<template>
  <UpdateClient :clientData="this.clientData" @save="saveUpdateClient" />
  <div class="section__modal__title">Создать заказ</div>

  <v-form ref="form">
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          variant="outlined"
          v-model="dataDefault.address"
          label="Адрес"
          :rules="[(v) => !!v || 'Введите Адрес']"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6" class="dataPicker">
        <VueDatePicker
          v-model="dataDefault.date_end"
          locale="ru"
          auto-apply
          placeholder="Срок"
          :min-date="new Date()"
          @open="this.successStatus"
          @cleared="this.errorStatus"
          format="dd/MM/yyyy HH:mm"
        />
        <v-text-field
          id="test"
          variant="outlined"
          v-model="dataDefault.date_end"
          label="Срок"
          :rules="[(v) => !!v || 'Введите Срок']"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          variant="outlined"
          v-model="dataDefault.type"
          label="Тип"
          :rules="[(v) => !!v || 'Введите Тип']"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          variant="outlined"
          v-model="dataDefault.sum"
          label="Сумма"
          :rules="[(v) => !!v || 'Введите Сумму', (v) => /^\d+$/.test(v) || 'Введите только цифры']"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <v-text-field
          variant="outlined"
          v-model="dataDefault.comment"
          label="Комментарий"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-form>
  <div class="section__modal__action">
    <v-btn class="section__modal__btn cancel" @click="this.closeModal"> Отменить </v-btn>
    <v-btn class="section__modal__btn aprove" :loading="loader" @click="this.validateForm"
      >Создать</v-btn
    >
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import axios from '@/axios.js'
import UpdateClient from '@/components/clients/UpdateClient.vue'

export default {
  emits: ['closeModal', 'save'],
  components: {
    UpdateClient,
    VueDatePicker
  },

  props: {
    clientData: Object
  },
  data() {
    return {
      dataDefault: {
        client_id: this.clientData.id,
        address: '',
        date_end: null,
        type: '',
        sum: '',
        comment: ''
      },
      loader: false
    }
  },
  methods: {
    toggleDatePickerState() {
      this.datePickerState = !this.datePickerState
    },
    async validateForm() {
      const { valid } = await this.$refs.form.validate()

      if (this.dataDefault.date_end == null) {
        this.errorStatus()
      } else {
        this.successStatus()
      }

      if (valid) {
        this.loader = true
        this.save()
      }
    },
    saveUpdateClient() {
      this.$emit('save')
    },

    async save() {
      const data = {
        client_id: this.dataDefault.client_id,
        address: this.dataDefault.address,
        date_end: this.dataDefault.date_end,
        type: this.dataDefault.type,
        sum: this.dataDefault.sum,
        comment: this.dataDefault.comment
      }

      try {
        const response = await axios.get('orders/create', {
          params: data
        })
        console.log('Response:', response.data)
        this.closeModal()
        this.$emit('save')
      } catch (error) {
        console.error('Error:', error)
        alert('Что-то пошло не так')
      } finally {
        this.loader = false
      }
    },

    closeModal() {
      this.$emit('closeModal')
      console.log('close')
    },

    successStatus() {
      document.getElementsByClassName('dp__input')[0].style.border = '1px solid #ababab'
    },
    errorStatus() {
      document.getElementsByClassName('dp__input')[0].style.border = '1px solid #b00020'
    }
  }
}
</script>

<style>
:root {
  /*General*/
  --dp-font-family: 'Roboto', sans-serif;
  --dp-input-padding: 15px 30px 15px 12px; /*Padding in the input*/
}
.dp__theme_light {
  --dp-border-color: #ababab;
}

.dataPicker .v-input__control {
  display: none;
}
</style>
