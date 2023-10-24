<template>
  <button @click="dialog = !dialog" class="order__create orderBtn">Создать заказ</button>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <div class="section__modal">
        <div class="check" v-if="step == 1">
          <CheckClient @closeModal="closeModal" @checkUserPresent="checkUserPresent" />
        </div>

        <div class="createClient" v-if="this.step == 2">
          <CreateClient @closeModal="closeModal" @checkUserPresent="checkUserPresent" />
        </div>

        <div class="create" v-if="this.step == 3">
          <ClientOrder :clientData="this.clientData" @closeModal="closeModal" @save="save" />
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import CheckClient from '@/components/clients/CheckClient.vue'
import CreateClient from '@/components/clients/CreateClient.vue'
import ClientOrder from '@/components/clients/ClientOrder.vue'
export default {
  emits: ['save'],
  components: {
    CheckClient,
    ClientOrder,
    CreateClient
  },
  data() {
    return {
      dialog: false,
      clientData: null,
      step: 1
    }
  },
  methods: {
    async save() {
      this.$emit('save')
    },

    checkUserPresent(isPresent, step, clientData) {
      if (isPresent) {
        this.step = step
        this.clientData = clientData
      } else {
        this.step = step
      }
    },

    closeModal() {
      this.dialog = false
      setTimeout(this.stepOne, 500)
    },

    stepOne() {
      this.step = 1
    }
  }
}
</script>
