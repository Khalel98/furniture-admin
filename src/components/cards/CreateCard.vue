<template>
  <v-btn class="addCard" style="margin-bottom: 20px" @click="dialog = true"
    >Добавить карточку</v-btn
  >

  <v-dialog v-model="dialog" persistent width="600px">
    <v-card>
      <div class="section__modal">
        <v-form ref="form" style="display: flex; margin-bottom: 20px" class="">
          <div style="width: 400px; margin-right: 20px">
            <v-select
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
          </div>

          <div style="width: 400px; margin-right: 20px">
            <v-select
              v-model="selectUser"
              :items="filteredSchools"
              :rules="[(v) => !!v || 'Выберите работника']"
              item-title="name"
              item-value="position"
              label="Работники"
              variant="outlined"
              :loading="isLoadingUsers"
              :disabled="isSelectDisabledUsers"
              hide-details="none"
              return-object
            ></v-select>
          </div>
          <!-- <v-btn class="addCard" @click="validateForm">Добавить</v-btn> -->
        </v-form>

        <div class="section__modal__action">
          <v-btn class="section__modal__btn cancel" @click="dialog = false">Отменить </v-btn>
          <v-btn class="section__modal__btn aprove" @click="validateForm">Создать</v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from '@/axios.js'

export default {
  emits: ['updateOrder'],

  props: {
    orderId: String
  },
  data() {
    return {
      selectPosition: null,
      isLoadingPositions: true,
      isSelectDisabledPositions: true,
      positionItems: [],
      selectUser: null,
      isLoadingUsers: true,
      isSelectDisabledUsers: true,
      userItems: [],
      dialog: false
    }
  },

  methods: {
    async validateForm() {
      const { valid } = await this.$refs.form.validate()

      if (valid) {
        this.loader = true
        this.addCard()
      }
    },
    async getPositions() {
      const data = {
        type: 'factory' // factory or empty
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

    async getUsers() {
      try {
        const response = await axios.get('factory/users/list')
        console.log('Response:', response.data)
        this.userItems = response.data
        this.isLoadingUsers = false
        this.isSelectDisabledUsers = false
      } catch (error) {
        console.error('Error:', error)
      }
    },

    async addCard() {
      try {
        const response = await axios.post('factory/card', {
          user_id: this.selectUser.id,
          order_id: this.orderId,
          position: this.selectPosition.position,
          position_name: this.selectPosition.name
        })
        console.log(response.data)
        this.selectPosition = null
        this.$emit('updateOrder'), (this.dialog = false)
      } catch (error) {
        console.error('Error:', error)
      }
    }
  },

  computed: {
    filteredSchools() {
      if (this.selectPosition && this.selectPosition.position) {
        return this.userItems.filter((user) => user.position === this.selectPosition.position)
      } else {
        return this.userItems
      }
    }
  },

  watch: {
    selectPosition() {
      this.selectUser = null
    }
  },

  mounted() {
    this.getPositions()
    this.getUsers()
  }
}
</script>
