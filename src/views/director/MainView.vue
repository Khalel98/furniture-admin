<template>
  <div class="section__statistics">
    <div class="section__statistics__title section__title">Статистика</div>
    <div class="section__statistics__date">
      <div class="section__statistics__date__pick">
        <input class="section__statistics__date__input" type="text" v-model="monthDate.year" />
        <input class="section__statistics__date__input" type="text" v-model="monthDate.month" />
      </div>
    </div>
    <div class="section__row">
      <div class="section__statistics__item">
        <div class="section__statistics__item__title">Зарплаты</div>
        <div class="section__statistics__item__img">
          <v-icon style="color: #ffc700" class="mdi">mdi-account-cash-outline</v-icon>
        </div>
        <div class="section__statistics__item__text">{{ this.stat.salary }}</div>
      </div>

      <div class="section__statistics__item">
        <div class="section__statistics__item__title">Заказы</div>
        <div class="section__statistics__item__img">
          <v-icon style="color: #699bf7" class="mdi">mdi mdi-table-check</v-icon>
        </div>
        <div class="section__statistics__item__text">{{ this.stat.order_sum }}</div>
      </div>

      <div class="section__statistics__item">
        <div class="section__statistics__item__title">Количество заказов</div>
        <div class="section__statistics__item__img">
          <v-icon style="color: #48bfc7" class="mdi">mdi-order-bool-ascending-variant</v-icon>
        </div>
        <div class="section__statistics__item__text">{{ this.stat.order_count }}</div>
      </div>

      <div class="section__statistics__item">
        <div class="section__statistics__item__title">Новых клиентов</div>
        <div class="section__statistics__item__img">
          <v-icon style="color: #9747ff" class="mdi">mdi-account-multiple-plus</v-icon>
        </div>
        <div class="section__statistics__item__text">{{ this.stat.client }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios.js'
export default {
  data() {
    return {
      month: false,
      monthDate: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      },
      stat: { salary: 0, order_sum: 0, order_count: 0, client: 0 }
    }
  },
  methods: {
    async getStat() {
      const data = {
        year: this.monthDate.year, // получаем статистику за год
        month: this.monthDate.month
      }
      try {
        const response = await axios.get('statistic/mix', {
          params: data
        })
        console.log('Response', response.data)
        this.stat = response.data
      } catch (error) {
        console.error(error)
        alert(error.response.data.message || 'Что-то пошло не так!')
      }
    }
  },

  mounted() {
    this.getStat()
  },

  watch: {
    'monthDate.month'() {
      this.getStat()
    },

    'monthDate.year'() {
      this.getStat()
    }
  }
}
</script>

<style></style>
