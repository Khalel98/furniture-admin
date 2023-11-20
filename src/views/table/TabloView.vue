<template>
  <div class="section__tablo">
    <audio ref="audioRef" id="notification">
      <source src="@/assets/signal.mp3" type="audio/mp3" />
    </audio>
    <v-data-table
      v-if="responseData"
      :headers="headers"
      :items="responseData"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:[`column.created_at`]="{ column }">
        <div class="sorting__container" :class="{ active: isActive }" @click="toggleSorting">
          <p>{{ column.title }}</p>
          <span class="mdi mdi-arrow-down-thin"></span>
        </div>
      </template>

      <template v-slot:[`item.order_num`]="{ item }">
        <a class="order__link" :href="'/page/' + item.id">{{ item.order_num }}</a>
      </template>

      <template v-slot:[`item.created_at`]="{ item }">
        <span>{{ new Date(item.created_at).toLocaleString('ru-RU') }}</span>
      </template>

      <template v-slot:[`item.date_end`]="{ item }">
        <span>{{ new Date(item.date_end).toLocaleString('ru-RU') }}</span>
      </template>

      <template v-slot:bottom>
        <div v-if="total">
          <div class="section__bottom">
            <div class="section__bottom__params">
              <label for="">Кол-во: </label>
              <select class="selectCount" v-model="itemsPerPage" @change="handleChange">
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </select>

              <strong>Всего: {{ total }}</strong>
            </div>
          </div>
          <div style="padding-bottom: 1px">
            <v-pagination
              v-model="page"
              class="my-4"
              :length="pageCount"
              @click="loadData"
            ></v-pagination>
          </div>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { ref, computed, watch, onMounted } from 'vue'
import axios from '@/axios.js'
import { useRouter } from 'vue-router'
import isEqual from 'lodash/isEqual'

export default {
  setup() {
    const position = 'foreman'

    const router = useRouter()

    const responseData = ref(null)
    const page = ref(1)
    const search = ref('')
    const itemsPerPage = ref(10)
    const total = ref(null)
    const isActive = ref(false)
    const asc = ref(0)
    const selectStatus = ref({ title: 'Поступившие', status: '1' })
    const status = [
      { title: 'Поступившие', status: '1' },
      { title: 'Принятые', status: '2' },
      { title: 'Завершенные', status: '3' }
    ]
    const headers = [
      {
        align: 'start',
        key: 'order_number',
        sortable: false,
        title: '№'
      },
      { title: 'Заказ', key: 'order_num', sortable: false },
      { title: 'ФИО', key: 'full_name', sortable: false },
      { title: 'Дата', key: 'created_at', sortable: false },
      { title: 'Срок', key: 'date_end', sortable: false },
      { title: 'Адресс', key: 'address', sortable: false },
      { title: 'Тип', key: 'type', sortable: false }
    ]

    const pageCount = computed(() => {
      return Math.ceil(total.value / itemsPerPage.value)
    })

    const lastData = ref(null)

    const checkAndUpdateData = async () => {
      try {
        const response = await axios.post('order/list', {
          search: search.value,
          status: '',
          page: page.value,
          sort: '',
          asc: asc.value,
          count: itemsPerPage.value
        })

        if (!isEqual(response.data.data, lastData.value)) {
          playAudio()
          receivedDataOrders()
        }

        lastData.value = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    }

    const startDataUpdates = () => {
      setInterval(() => {
        checkAndUpdateData()
      }, 5000)
    }

    const receivedDataOrders = async () => {
      try {
        const response = await axios.post('order/list', {
          search: search.value,
          status: '',
          page: page.value,
          sort: '',
          asc: asc.value,
          count: itemsPerPage.value
        })
        total.value = response.data.total
        responseData.value = response.data.data
        lastData.value = response.data.data // Initialize lastData with the initial data
      } catch (error) {
        console.error('Error:', error)
      }
    }

    const takeOrder = (status, order_id) => {
      if (status == 0) {
        router.push(`page/${order_id}`)
      } else {
        alert('Заказ уже взят')
      }
    }

    const handleChange = () => {
      loadData()
      page.value = 1
    }

    const loadData = () => {
      receivedDataOrders()
    }

    const toggleSorting = () => {
      isActive.value = !isActive.value
      if (asc.value == 1) {
        asc.value = 0
      } else {
        asc.value = 1
      }

      loadData()
    }

    onMounted(() => {
      loadData()
      startDataUpdates()
      playAudio()
    })

    watch(selectStatus, () => {
      loadData()
    })

    const playAudio = async () => {
      document.getElementById('notification').play()
    }

    return {
      page,
      search,
      itemsPerPage,
      headers,
      pageCount,
      total,
      responseData,
      loadData,
      selectStatus,
      status,
      handleChange,
      isActive,
      asc,
      toggleSorting,
      receivedDataOrders,
      takeOrder,
      position,
      playAudio
    }
  }
}
</script>
