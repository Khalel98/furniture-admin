<template>
  <v-icon size="small" @click="openModal"> mdi-pencil </v-icon>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <div class="section__modal">
        <div class="circle__body" v-if="!userData.iin">
          <v-progress-circular :size="150" color="#2176ff" indeterminate></v-progress-circular>
        </div>
        <div v-if="!userData.iin" style="height: 300px"></div>
        <v-form ref="form" v-if="userData.iin">
          <div class="section__modal__title">Редактировать пользователя</div>

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
                v-model="userData.iin"
                label="ИИН"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'Введите Имя']"
                variant="outlined"
                v-model="userData.name"
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
                v-model="userData.phone"
                label="Телефон"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'Введите Адрес']"
                variant="outlined"
                v-model="userData.address"
                label="Адрес"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field
                :rules="[(v) => !!v || 'Введите Почту']"
                variant="outlined"
                v-model="userData.email"
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
                v-model="userData.salary"
                label="Зарплата"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="12">
              <div class="section__modal__header" style="margin-bottom: 15px">
                <div class="section__modal__title">Позиции</div>
                <v-btn
                  class="section__modal__btn create"
                  v-if="!showPosition"
                  @click="this.switchPosition"
                  >Добавить позицию
                </v-btn>
                <v-btn
                  class="section__modal__btn aprove"
                  v-if="showPosition"
                  @click="this.addPosition"
                  >Сохранить
                </v-btn>
              </div>
              <v-form ref="form2">
                <v-select
                  v-if="showPosition"
                  v-model="selectPosition"
                  :items="positionItems"
                  :rules="[(v) => !!v || 'Выберите позицию']"
                  item-title="name"
                  item-value="position"
                  label="Позиция"
                  variant="outlined"
                  :loading="isLoadingPositions"
                  :disabled="isSelectDisabledPositions"
                  hide-details="none"
                  return-object
                ></v-select>
              </v-form>
              <div class="position__chip">
                <span
                  class="position__chip__item"
                  v-for="position in userData.positions"
                  :key="position.id"
                  @click="confirmDeletion(position.id, userData.positions)"
                >
                  {{ position.name }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-form>
        <div class="section__modal__action">
          <v-btn class="section__modal__btn cancel" @click="this.closeModal"> Отменить </v-btn>
          <v-btn class="section__modal__btn aprove" style="width: 150px" @click="this.validateForm"
            >Сохранить</v-btn
          >
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from '@/axios.js'

export default {
  emits: ['save'],
  props: {
    id: Number
  },
  data() {
    return {
      showPosition: false,
      dialog: false,
      userData: {
        iin: null,
        name: null,
        phone: null,
        address: null,
        email: null,
        salary: null
      },
      selectPosition: null,
      isLoadingPositions: true,
      isSelectDisabledPositions: true,
      positionItems: []
    }
  },
  methods: {
    switchPosition() {
      this.showPosition = true
      this.getPositions()
    },
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
    async getUser() {
      try {
        const response = await axios.get(`admin/users/${this.id}`)
        console.log(response.data)
        this.userData = response.data
      } catch (error) {
        console.error('Error deleting data:', error)
        alert(error.response.data.message || 'Что-то пошло не так!')
      }
    },

    async validateForm() {
      const { valid } = await this.$refs.form.validate()

      if (valid) {
        this.updateUser()
      }
    },

    async updateUser() {
      try {
        const dataToUpdate = {
          iin: this.userData.iin,
          name: this.userData.name,
          phone: this.userData.phone,
          address: this.userData.address,
          email: this.userData.email,
          salary: this.userData.salary
        }
        const response = await axios.patch(`admin/users/${this.id}`, dataToUpdate)
        console.log('Response from PATCH request:', response.data)
        this.$emit('save')
        this.closeModal()
      } catch (error) {
        console.error('Error updating resource:', error)
        alert(error.response.data.message || 'Что-то пошло не так!')
      }
    },

    async addPosition() {
      const data = {
        user_id: this.id,
        position: this.selectPosition.position,
        position_name: this.selectPosition.name
      }
      try {
        const response = await axios.get('admin/positions/create', {
          params: data
        })
        console.log('Response:', response.data)
        this.getUser()
      } catch (error) {
        console.error('Error:', error)
        alert(error.response.data.message || 'Что-то пошло не так!')
      } finally {
        this.showPosition = false
        this.selectPosition = null
      }
    },

    async deletePosition(position_id, positions) {
      if (positions.length > 1) {
        try {
          await axios.delete(`admin/positions/${position_id}`)
          this.getUser()
          this.$emit('save')
        } catch (error) {
          console.error('Error deleting data:', error)
          alert(error.response.data.message || 'Что-то пошло не так!')
        }
      } else {
        alert('Нельзя удалить единственную роль!')
      }
    },

    confirmDeletion(position_id, positions) {
      var result = confirm('Удалить элемент?')

      if (result) {
        this.deletePosition(position_id, positions)
      }
    },

    closeModal() {
      this.dialog = false
      this.showPosition = false
      this.selectPosition = null
      this.$emit('save')
    },
    openModal() {
      this.dialog = true
      this.getUser()
    }
  },
  mounted() {}
}
</script>
