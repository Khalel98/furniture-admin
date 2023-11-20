<template>
  <button @click="dialog = !dialog" class="order__create orderBtn">Добавить</button>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <div class="section__modal">
        <v-form ref="form">
          <div class="section__modal__title">Добавить роль</div>

          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                :rules="
                  ([(v) => !!v || 'Введите позицию'],
                  [(v) => /^[a-zA-Z]+$/.test(v) || 'Введите позицию только латинскими буквами'])
                "
                variant="outlined"
                v-model="position"
                label="Позиция"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field
                :rules="
                  ([(v) => !!v || 'Введите название позиции'],
                  [(v) => /^[а-яА-ЯёЁ]+$/.test(v) || 'Введите название только кириллицей'])
                "
                variant="outlined"
                v-model="name"
                label="Название"
              ></v-text-field>
            </v-col>
          </v-row>

          <div class="section__modal__action">
            <v-btn class="section__modal__btn cancel" @click="dialog = !dialog">Отменить</v-btn>
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
  emit: ['getPositions'],
  data() {
    return {
      dialog: false,
      position: null,
      name: null
    }
  },
  methods: {
    async validateForm() {
      const { valid } = await this.$refs.form.validate()

      if (valid) {
        this.addRole()
      }
    },
    async addRole() {
      try {
        const response = await axios.post('factory/position', {
          position: this.position,
          name: this.name
        })
        console.log('Response:', response.data)
        this.dialog = false
        this.$emit('getPositions')
      } catch (error) {
        console.error('Error:', error)
        alert(error.response.data.message || 'Что-то пошло не так')
      }
    }
  }
}
</script>

<style></style>
