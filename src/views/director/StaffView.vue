<template>
  <div class="section__row">
    <SearchComponent :value="search" @update:value="search = $event" />
  </div>
  <div class="search__filter" style="justify-content: space-between">
    <div style="width: 100%">
      <VueDatePicker
        v-model="defaultData"
        locale="ru-RU"
        auto-apply
        placeholder="Срок"
        :max-date="new Date()"
        format="yyyy-MM-dd"
      />
    </div>

    <div class="de" style="width: 100%">
      <v-checkbox v-model="checkbox" :label="checkbox ? 'За месяц' : ''"></v-checkbox>
    </div>
  </div>

  <v-data-table
    v-if="responseData"
    :headers="headers"
    :items="responseData"
    :items-per-page="itemsPerPage"
    hide-default-footer
    class="elevation-1"
  >
    <template v-slot:[`column.entrance_time`]="{ column }">
      <div class="sorting__container" :class="{ active: isActive }" @click="toggleSorting">
        <p>{{ column.title }}</p>
        <span class="mdi mdi-arrow-down-thin"></span>
      </div>
    </template>

    <template v-slot:[`item.entrance_file`]="{ item }">
      <div class="regme__img">
        <img :src="item.entrance_file" alt="" />
      </div>
    </template>

    <template v-slot:[`item.exit_file`]="{ item }">
      <div class="regme__img">
        <img :src="item.exit_file" alt="" />
      </div>
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
import VueDatePicker from '@vuepic/vue-datepicker'

import { ref, computed, watch, onMounted } from 'vue'
import SearchComponent from '@/components/SearchComponent.vue'
import axios from '@/axios.js'
import { useRouter } from 'vue-router'

export default {
  components: {
    SearchComponent,
    VueDatePicker
  },
  props: ['value'],
  setup(props) {
    const position = props.value

    const defaultData = ref(new Date())

    const router = useRouter()
    const checkbox = ref(false)
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
        key: 'order_number',
        sortable: false,
        title: '№'
      },
      { title: 'ФИО', key: 'name', sortable: false },
      { title: 'Дата входа', key: 'entrance_time', sortable: false },
      { title: 'Подтверждение', key: 'entrance_file', sortable: false },
      { title: 'Дата выхода', key: 'exit_time', sortable: false },
      { title: 'Подтверждение', key: 'exit_file', sortable: false }
    ]

    // Computed property to calculate the page count
    const pageCount = computed(() => {
      return Math.ceil(total.value / itemsPerPage.value)
    })

    const currentData = computed(() => {
      let temp
      if (!checkbox.value) {
        temp =
          defaultData.value.getFullYear() +
          '-' +
          getMonthFromDate(defaultData.value) +
          '-' +
          String(defaultData.value.getDate()).padStart(2, '0')
      } else {
        temp = defaultData.value.getFullYear() + '-' + getMonthFromDate(defaultData.value)
      }
      return temp
    })

    // Function to make the API request
    const receivedDataOrders = async () => {
      try {
        const response = await axios.post('regmy/list', {
          search: search.value,
          period: currentData.value,
          page: page.value,
          sort: '',
          asc: asc.value,
          count: itemsPerPage.value
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

    // Function to make the API request
    const getMonthFromDate = (date) => {
      return date.getMonth() + 1
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

    watch(currentData, () => {
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
      position,
      defaultData,
      getMonthFromDate,
      checkbox,
      currentData
    }
  }
}
</script>
