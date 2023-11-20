<template>
  <div style="display: flex; justify-content: space-between">
    <div class="search__filter">
      <input class="search__filter__input" v-model="search" @input="loadData" placeholder="Поиск" />
    </div>

    <AddRole @getPositions="getPositions" />
  </div>

  <v-data-table
    class="elevation-1"
    :headers="headers"
    v-model:page="page"
    :items="data"
    item-value="name"
    :search="search"
    return-object
    :items-per-page="itemsPerPage"
  >
    <template v-slot:[`item.num`]="{ index }">
      {{ index + 1 }}
    </template>

    <template v-slot:[`item.action`]="{ item }">
      <v-icon size="small" @click="confirmDeletion(item.id)"> mdi-delete </v-icon>
    </template>
    <template v-slot:[`item.created_at`]="{ item }">
      <span>{{ new Date(item.created_at).toLocaleString('ru-RU') }}</span>
    </template>

    <template v-slot:bottom>
      <div
        class="pagination__section"
        style="
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          align-items: center;
          flex-wrap: wrap;
        "
      >
        <v-pagination v-model="page" :length="pageCount" :total-visible="5"></v-pagination>

        <strong>Всего: {{ this.data.length }}</strong>
      </div></template
    >
  </v-data-table>
</template>
<script>
import axios from '@/axios.js'
import AddRole from '@/components/admin/AddRole.vue'

export default {
  components: {
    AddRole
  },
  data() {
    return {
      search: '',
      page: 1,
      itemsPerPage: 10,
      newData: [],
      total: null,
      isActive: false,
      asc: 0,
      headers: [
        { key: 'num', title: '№', sortable: false },
        { key: 'position', title: 'Позиция', sortable: true },
        { key: 'name', title: 'Название', sortable: true },
        { key: 'created_at', title: 'Дата создания', sortable: true },
        { key: 'action', title: 'Действие', sortable: true }
      ],
      data: []
    }
  },
  methods: {
    async getPositions() {
      const data = {
        type: 'factory' // factory or empty
      }
      try {
        const response = await axios.get('factory/position', {
          params: data
        })
        console.log('Response:', response.data)
        this.data = response.data
      } catch (error) {
        console.error('Error:', error)
      }
    },

    confirmDeletion(id) {
      if (confirm('Вы уверены что хотите удалить?')) {
        this.deleteData(id)
      } else {
        console.log('Cancel')
      }
    },
    async deleteData(id) {
      try {
        await axios.delete(`factory/position/${id}`)
        this.getPositions()
      } catch (error) {
        console.error('Error deleting data:', error)
        alert('Что-то пошло не так')
      }
    }
  },

  mounted() {
    this.getPositions()
  },
  computed: {
    pageCount() {
      return Math.ceil(this.data.length / this.itemsPerPage)
    }
  }
}
</script>
