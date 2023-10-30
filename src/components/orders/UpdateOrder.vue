<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-icon size="small" class="me-2" @click="dialog = !dialog"> mdi-pencil </v-icon>
  <v-dialog v-model="dialog" max-width="500px">
    <div class="section__modal">
      <div class="section__modal__title">Редактировать заказ</div>

      <v-form ref="form">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              variant="outlined"
              v-model="dataToEdit.address"
              label="Адрес"
              :rules="[(v) => !!v || 'Введите Адрес']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6" class="dataPicker">
            <VueDatePicker
              v-model="dataToEdit.date_end"
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
              v-model="dataToEdit.date_end"
              label="Срок"
              :rules="[(v) => !!v || 'Введите Срок']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              variant="outlined"
              v-model="dataToEdit.type"
              label="Тип"
              :rules="[(v) => !!v || 'Введите Тип']"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              variant="outlined"
              v-model="dataToEdit.sum"
              label="Сумма"
              :rules="[
                (v) => !!v || 'Введите Сумму',
                (v) => /^\d+$/.test(v) || 'Введите только цифры'
              ]"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-text-field
              variant="outlined"
              v-model="dataToEdit.comment"
              label="Комментарий"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>

      <div class="section__modal__action">
        <v-btn class="section__modal__btn cancel" @click="this.closeModal"> Отменить </v-btn>
        <v-btn class="section__modal__btn aprove" :loading="loader" @click="this.validateForm"
          >Сохранить</v-btn
        >
      </div>
    </div>
  </v-dialog>
</template>

<script>
import axios from '@/axios.js'
import VueDatePicker from '@vuepic/vue-datepicker'
export default {
  emits: ['save'],
  components: {
    VueDatePicker
  },
  props: {
    dataDefault: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dataToEdit: { ...this.dataDefault },
      dialog: false,
      loader: false
    }
  },
  methods: {
    async validateForm() {
      const { valid } = await this.$refs.form.validate()

      if (this.dataToEdit.date_end == null) {
        this.errorStatus()
      } else {
        this.successStatus()
      }

      if (valid) {
        this.loader = true
        this.save()
      }
    },
    async save() {
      const data = {
        id: this.dataToEdit.id,
        address: this.dataToEdit.address,
        date_end: this.dataToEdit.date_end,
        type: this.dataToEdit.type,
        sum: this.dataToEdit.sum
      }

      try {
        const response = await axios.patch('orders/update', data)
        console.log('Response:', response.data)
        this.closeModal()
        this.$emit('save')
      } catch (error) {
        console.error('Error:', error)
        alert('что то пошло не так')
      } finally {
        this.loader = false
      }
    },

    successStatus() {
      document.getElementsByClassName('dp__input')[0].style.border = '1px solid #ababab'
    },
    errorStatus() {
      document.getElementsByClassName('dp__input')[0].style.border = '1px solid #b00020'
    },

    closeModal() {
      this.dialog = false
      this.dataToEdit = { ...this.dataDefault }
    }
  }
}
</script>
