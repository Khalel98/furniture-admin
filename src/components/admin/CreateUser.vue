<template>
  <v-btn class="addCard" @click="dialog = !dialog">Добавить</v-btn>

  <v-dialog v-model="dialog" persistent width="500px">
    <v-card>
      <div class="section__modal">
        <v-form ref="form">
          <div class="section__modal__title">Добавить сотрудника</div>

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
                :rules="[(v) => !!v || 'Введите Имя']"
                variant="outlined"
                v-model="newClient.name"
                label="ФИО"
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
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'Введите Адрес']"
                variant="outlined"
                v-model="newClient.address"
                label="Адрес"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-select
                v-model="newClient.position"
                :items="positionItems"
                :rules="[(v) => !!v || 'Выберите позицию']"
                item-title="name"
                item-value="position"
                label="Позиция"
                variant="outlined"
                :loading="isLoadingPositions"
                :disabled="isSelectDisabledPositions"
                return-object
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field
                :rules="[
                  (v) => !!v || 'Введите Почту',
                  (v) =>
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(v) ||
                    'Почта введена некорректно'
                ]"
                variant="outlined"
                v-model="newClient.email"
                label="Почта"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field
                :rules="[
                  (v) => !!v || 'Введите Зарплату',
                  (v) => /^\d+$/.test(v) || 'Зарплата состоит только из цифр'
                ]"
                variant="outlined"
                v-model="newClient.salary"
                label="Зарплата"
              ></v-text-field>
            </v-col>
          </v-row>

          <div class="section__modal__action">
            <v-btn class="section__modal__btn cancel" @click="this.closeModal">Отменить</v-btn>
            <v-btn class="section__modal__btn aprove" @click="this.validateForm">Создать</v-btn>
          </div>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from '@/axios.js'

export default {
  emits: ['save'],

  data() {
    return {
      dialog: false,
      newClient: {
        iin: '',
        name: '',
        phone: '',
        address: '',
        position: null,
        email: '',
        salary: ''
      },

      positionItems: null,
      isLoadingPositions: true,
      isSelectDisabledPositions: true
    }
  },
  methods: {
    async getPositions() {
      const data = {
        type: '' // factory or empty
      }
      try {
        const response = await axios.get('factory/position', {
          params: data
        })
        console.log('Response:', response.data)
        this.positionItems = response.data
        this.isLoadingPositions = false
        this.isSelectDisabledPositions = false
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async validateForm() {
      const { valid } = await this.$refs.form.validate()

      if (valid) {
        this.createClient()
      }
    },
    async createClient() {
      try {
        const response = await axios.post('admin/users', {
          iin: this.newClient.iin,
          name: this.newClient.name,
          phone: this.newClient.phone,
          address: this.newClient.address,
          position: this.newClient.position.position,
          position_name: this.newClient.position.name,
          email: this.newClient.email,
          salary: this.newClient.salary
        })
        this.$emit('save')
        this.closeModal()
        console.log('Response:', response.data)
      } catch (error) {
        console.error('Error:', error)
        alert(error.response.data.message || 'Что-то пошло не так')
      }
    },
    closeModal() {
      this.dialog = false
    }
  },
  mounted() {
    this.getPositions()
  }
}
</script>

<style></style>
