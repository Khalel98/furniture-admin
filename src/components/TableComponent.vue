<template>
  <SearchComponent :value="search" @update:value="search = $event" />
  {{ this.search }}

  <v-data-table
    v-model:page="page"
    :headers="headers"
    :items="desserts"
    :items-per-page="itemsPerPage"
    hide-default-footer
    class="elevation-1"
  >
    <template v-slot:bottom>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import { ref, computed, watch } from 'vue'
import SearchComponent from '@/components/SearchComponent.vue'

export default {
  components: {
    SearchComponent
  },
  props: ['value'],
  setup(props, { emit }) {
    const inputValue = ref(props.value)

    // eslint-disable-next-line no-unused-vars
    const emitValue = () => {
      emit('update:value', inputValue.value)
    }
    // Data properties using ref
    const page = ref(1)
    const search = ref('')
    const itemsPerPage = ref(5)

    const headers = [
      {
        align: 'start',
        key: 'name',
        sortable: false,
        title: 'Dessert (100g serving)'
      },
      { title: 'Calories', key: 'calories' },
      { title: 'Fat (g)', key: 'fat' },
      { title: 'Carbs (g)', key: 'carbs' },
      { title: 'Protein (g)', key: 'protein' },
      { title: 'Iron (%)', key: 'iron' }
    ]

    const desserts = ref([
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: 1
      }
      // Add more dessert data as needed
    ])

    // Computed property to calculate the page count
    const pageCount = computed(() => {
      return Math.ceil(desserts.value.length / itemsPerPage.value)
    })

    // Watch for changes in the search value and reset the page to 1
    watch(search, () => {
      page.value = 1
    })

    return {
      page,
      search,
      itemsPerPage,
      headers,
      desserts,
      pageCount
    }
  }
}
</script>
