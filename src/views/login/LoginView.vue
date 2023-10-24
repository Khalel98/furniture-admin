<template>
  <div id="page-container">
    <div id="content-wrap">
      <MenuComponent />
      <div class="login__form">
        <div class="login__form__title">Войти в кабинет</div>
        <v-form ref="form" @submit.prevent="validate">
          <v-text-field
            v-model="username"
            variant="outlined"
            :rules="firstNameRules"
            label="Логин"
          ></v-text-field>
          <br />
          <v-text-field
            v-model="password"
            variant="outlined"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show ? 'text' : 'password'"
            name="input-10-1"
            label="Пароль"
            counter
            @click:append="show = !show"
          ></v-text-field>
          <br />
          <button type="submit">Войти</button>
        </v-form>
      </div>
    </div>

    <div class="footer">
      <FooterComponent />
    </div>
  </div>
</template>

<script>
import MenuComponent from '@/components/layout/MenuComponent.vue'
import FooterComponent from '@/components/layout/FooterComponent.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    MenuComponent,
    FooterComponent
  },
  data() {
    return {
      apiKey: 'https://api.cards.edus.kz/public',
      username: '',
      password: '',

      show: false,
      rules: {
        required: (value) => !!value || 'Заполните поле.',
        min: (v) => v.length >= 6 || 'Минимум 6 символов'
      },
      firstNameRules: [
        (value) => {
          if (value?.length > 0) return true

          return 'Заполните поле'
        }
      ],
      validationErrors: {
        username: null,
        password: null
      }
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', {
          email: this.username,
          password: this.password
        })
        const role = this.currentRole[0].to
        console.log(role)
        this.$router.push(`${role}`)
      } catch (error) {
        console.error(error)
        alert('Данные введены неверно')
      }
    },
    async validate() {
      const { valid } = await this.$refs.form.validate()
      if (valid) this.login()
    }
  },
  computed: {
    ...mapGetters(['currentRole']) // Map your getter here
  }
}
</script>
