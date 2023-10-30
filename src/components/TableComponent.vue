<template>
  {{ position }}
  <div class="section__row">
    <SearchComponent :value="search" @update:value="search = $event" />
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

  <div class="order">
    <div class="section__row">
      <div class="order__item" v-for="item in responseData" :key="item.id">
        <div class="order__item__position">
          {{ item.order_num }}
        </div>
        <div class="order__item__text"><strong>Клиент: </strong>{{ item.full_name }}</div>
        <div class="order__item__text"><strong>Адрес: </strong>{{ item.address }}</div>
        <div class="order__item__text">
          <strong>Дата создания: </strong>{{ new Date(item.created_at).toLocaleString('ru-RU') }}
        </div>
        <div class="order__item__text">
          <strong>Срок:</strong> {{ new Date(item.date_end).toLocaleString('ru-RU') }}
        </div>
        <div class="order__item__text">
          <strong>Дата начала: </strong>
          <span v-if="item.take_date">{{ new Date(item.take_date).toLocaleString('ru-RU') }}</span>
        </div>

        <div class="order__item__text">
          <strong>Дата завершения: </strong>
          <span v-if="item.passed_date">{{
            new Date(item.passed_date).toLocaleString('ru-RU')
          }}</span>
        </div>
        <TakeOrder
          :id="item.card_id"
          :position="position"
          v-if="selectStatus.status == 0"
          @updateOrder="takenDataOrders"
        />
        <CancelOrder
          :id="item.card_id"
          :position="position"
          v-if="selectStatus.status == 1"
          @updateOrder="takenDataOrders"
        />
        <SubmitOrder
          :id="item.card_id"
          :position="position"
          v-if="selectStatus.status == 1"
          @updateOrder="takenDataOrders"
        />
      </div>
    </div>
  </div>

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

<script>
import TakeOrder from '@/components/workshop-orders/TakeOrder.vue'
import CancelOrder from '@/components/workshop-orders/CancelOrder.vue'
import SubmitOrder from '@/components/workshop-orders/SubmitOrder.vue'
import { ref, computed, watch, onMounted } from 'vue'
import SearchComponent from '@/components/SearchComponent.vue'
import axios from '@/axios.js'

export default {
  components: {
    SearchComponent,
    TakeOrder,
    CancelOrder,
    SubmitOrder
  },
  props: ['value'],
  setup(props) {
    console.log(props.value)
    const position = props.value

    // Define a ref to store the response data
    const responseData = ref(null)
    // Data properties using ref
    const page = ref(1)
    const search = ref('')
    const itemsPerPage = ref(10)
    const total = ref(null)
    const asc = ref(0)
    const selectStatus = ref({ title: 'Принятые', status: '0' })
    const status = [
      { title: 'Принятые', status: '0' },
      { title: 'Обработке', status: '1' },
      { title: 'Завершенные', status: '2' }
    ]

    // Computed property to calculate the page count
    const pageCount = computed(() => {
      return Math.ceil(total.value / itemsPerPage.value)
    })

    // Function to make the API request
    const takenDataOrders = async () => {
      try {
        const response = await axios.post('orders/list/position', {
          search: search.value,
          position: position,
          position_status: selectStatus.value.status,
          sort: '',
          asc: asc.value,
          page: page.value,
          count: itemsPerPage.value
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
      takenDataOrders()
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
      pageCount,
      total,
      responseData,
      loadData,
      selectStatus,
      status,
      handleChange,
      asc,
      position,
      takenDataOrders
    }
  }
}
</script>
