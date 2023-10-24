<template>
  <div class="section__row">
    <SearchComponent :value="search" @update:value="search = $event" />

    <CreateOrder @save="saveData" />
  </div>
  <div class="search__filter">
    <v-select
      v-model="selectStatus"
      :items="status"
      item-title="title"
      item-value="status"
      label="Select"
      variant="outlined"
      return-object
      single-line
      hide-details="none"
    ></v-select>
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

    <template v-slot:[`item.order_num`]="{ item }">
      <a :href="'/page/' + item.id" target="_blank">{{ item.order_num }}</a>
    </template>

    <template v-slot:[`item.created_at`]="{ item }">
      <span>{{ new Date(item.created_at).toLocaleString('ru-RU') }}</span>
    </template>

    <template v-slot:[`item.date_end`]="{ item }">
      <span>{{ new Date(item.date_end).toLocaleString('ru-RU') }}</span>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <UpdateOrder :dataDefault="item" @save="saveData" />
      <DeleteOrder :dataDefault="item" @save="saveData" />
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
import CreateOrder from '@/components/orders/CreateOrder.vue'
import UpdateOrder from '@/components/orders/UpdateOrder.vue'
import DeleteOrder from '@/components/orders/DeleteOrder.vue'
import axios from '@/axios.js'

export default {
  components: {
    SearchComponent,
    CreateOrder,
    UpdateOrder,
    DeleteOrder
  },
  props: ['value'],
  setup(props, { emit }) {
    // eslint-disable-next-line no-unused-vars
    const emitValue = () => {
      emit('update:value', inputValue.value)
    }
    // Define a ref to store the response data
    const responseData = ref(null)
    // Data properties using ref
    const inputValue = ref(props.value)
    const page = ref(1)
    const search = ref('')
    const itemsPerPage = ref(10)
    const total = ref(null)
    const isActive = ref(false)
    const asc = ref(0)
    const selectStatus = ref({ title: 'Поступившие', status: '0' })
    const status = [
      { title: 'Поступившие', status: '0' },
      { title: 'Принятые', status: '1' },
      { title: 'Завершенные', status: '2' }
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
      { title: 'Статус', key: 'status', sortable: false },
      { title: 'Адресс', key: 'address', sortable: false },
      { title: 'Type', key: 'type', sortable: false },
      { title: 'Действия', key: 'actions', sortable: false }
    ]

    // Computed property to calculate the page count
    const pageCount = computed(() => {
      return Math.ceil(total.value / itemsPerPage.value)
    })
    // Function to make the API request
    const getData = async () => {
      try {
        const response = await axios.post('/api/v1/orders/index', {
          search: search.value,
          status: selectStatus.value.status,
          page: page.value,
          sort: '',
          asc: asc.value,
          count: itemsPerPage.value,
          position: '',
          position_status: '',
          user_id: ''
        })
        total.value = response.data.total
        responseData.value = response.data.data
      } catch (error) {
        console.error('Error:', error)
      }
    }
    const handleChange = () => {
      loadData()
      page.value = 1
    }

    const loadData = () => {
      getData()
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const saveData = () => {
      getData()
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

      getData()
    }

    // Make the API request on component mount
    onMounted(() => {
      getData()
    })

    watch(search, () => {
      page.value = 1
      getData()
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
      saveData,
      selectStatus,
      status,
      handleChange,
      isActive,
      asc,
      toggleSorting
    }
  }
}
</script>
