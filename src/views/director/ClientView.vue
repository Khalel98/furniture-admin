<template>
  <div class="section__row">
    <SearchComponent :value="search" @update:value="search = $event" />
  </div>

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

    <template v-slot:[`item.created_at`]="{ item }">
      <span>{{ new Date(item.created_at).toLocaleString('ru-RU') }}</span>
    </template>

    <template v-slot:[`item.updated_at`]="{ item }">
      <span>{{ new Date(item.updated_at).toLocaleString('ru-RU') }}</span>
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
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import SearchComponent from '@/components/SearchComponent.vue'
import axios from '@/axios.js'
import { useRouter } from 'vue-router'

export default {
  components: {
    SearchComponent
  },
  props: ['value'],
  setup(props) {
    const position = props.value

    const router = useRouter()
    // Define a ref to store the response data
    const responseData = ref(null)
    // Data properties using ref
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
        key: 'user_number',
        sortable: false,
        title: '№'
      },
      { title: 'ФИО', key: 'fulname', sortable: false },
      { title: 'ИИН', key: 'iin', sortable: false },
      { title: 'Телефон', key: 'phone', sortable: false },
      { title: 'Дата создания', key: 'created_at', sortable: false },
      { title: 'Дата изменения', key: 'updated_at', sortable: false }
    ]

    // Computed property to calculate the page count
    const pageCount = computed(() => {
      return Math.ceil(total.value / itemsPerPage.value)
    })

    // Function to make the API request
    const receivedDataOrders = async () => {
      try {
        const response = await axios.get('clients', {
          params: {
            search: search.value,
            sort: '',
            asc: asc.value,
            count: itemsPerPage.value,
            page: page.value

            // search: '',
            // status: '2', // 1/2/3...
            // sort: '', // name column sort
            // asc: '1', // 1/0
            // count: '5',
            // page: 1
          }
        })
        total.value = response.data.total
        responseData.value = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    }

    // Function to make the API request
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
        console.log(asc.value)
      } else {
        asc.value = 1
        console.log(asc.value)
      }

      loadData()
    }

    // Make the API request on component mount
    onMounted(() => {
      loadData()
    })

    watch(search, () => {
      page.value = 1
      loadData()
    })

    watch(selectStatus, () => {
      loadData()
    })

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
      position
    }
  }
}
</script>
