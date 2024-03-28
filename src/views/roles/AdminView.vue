<template>
  <div class="section__row">
    <SearchComponent :value="search" @update:value="search = $event" />
    <CreateUser @save="loadData" />
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

    <template v-slot:[`item.position`]="{ item }">
      <span v-if="item.position.length == 1">{{ item.position_name[0] }}</span>
      <v-btn variant="outlined" v-else>
        Универсальный
        <v-tooltip activator="parent" location="bottom">
          {{ item.position_name.join(', ') }}
        </v-tooltip>
      </v-btn>
    </template>

    <template v-slot:[`item.created_at`]="{ item }">
      <span>{{ new Date(item.created_at).toLocaleString('ru-RU') }}</span>
    </template>

    <template v-slot:[`item.action`]="{ item }">
      <div style="display: flex; justify-content: space-around">
        <UpdateUser :id="item.id" @save="loadData" />
        <DeleteUser :id="item.id" @save="loadData" />
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
import { ref, computed, watch, onMounted } from 'vue'
import SearchComponent from '@/components/SearchComponent.vue'
import CreateUser from '@/components/admin/CreateUser.vue'
import DeleteUser from '@/components/admin/DeleteUser.vue'
import UpdateUser from '@/components/admin/UpdateUser.vue'
import axios from '@/axios.js'

export default {
  components: {
    SearchComponent,
    CreateUser,
    DeleteUser,
    UpdateUser
  },
  props: ['value'],
  setup(props) {
    const position = props.value

    // Define a ref to store the response data
    const responseData = ref(null)

    const page = ref(1)
    const search = ref('')
    const itemsPerPage = ref(10)
    const total = ref(null)
    const isActive = ref(false)
    const asc = ref(0)
    const selectStatus = ref({ title: 'Активные', status: '1' })
    const status = [
      { title: 'Активные', status: '1' },
      { title: 'Не активные', status: '3' }
    ]

    const headers = [
      {
        align: 'start',
        key: 'user_number',
        sortable: false,
        title: '№'
      },
      { title: 'ФИО', key: 'name', sortable: false },
      { title: 'Почта', key: 'email', sortable: false },
      { title: 'Позиция', key: 'position', sortable: false },
      { title: 'ИИН', key: 'iin', sortable: false },
      { title: 'Номер', key: 'phone', sortable: false },
      { title: 'Дата создания', key: 'created_at', sortable: false },
      { title: 'Действия', key: 'action', sortable: false }
    ]

    // Computed property to calculate the page count
    const pageCount = computed(() => {
      return Math.ceil(total.value / itemsPerPage.value)
    })

    // Function to make the API request
    const receivedDataOrders = async () => {
      try {
        const response = await axios.get('admin/users', {
          params: {
            search: search.value,
            status: selectStatus.value.status,
            page: page.value,
            sort: '',
            asc: asc.value,
            count: itemsPerPage.value
          }
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
      position
    }
  }
}
</script>
