import '@/styles/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import axios from 'axios'
import store from './store'
import '@mdi/font/css/materialdesignicons.css'

// VueDatePicker
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VDatePicker } from 'vuetify/labs/VDatePicker'

const vuetify = createVuetify({
  components,
  directives
})

createApp(App)
  .use(router)
  .use(vuetify)
  .component('VDataTable', VDataTable)
  .component('VDatePicker', VDatePicker)
  .component('VueDatePicker', VueDatePicker)

  .use(store)
  .mount('#app')
