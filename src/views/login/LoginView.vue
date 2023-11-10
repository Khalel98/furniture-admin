<template>
  <div class="section__login">
    <div class="section__login__content">
      <div class="section__login__preview">
        <div class="section__login__preview__header">
          <img src="@/assets/logo.svg" alt="" />
          <h1 class="section__login__preview__title">APP</h1>
        </div>
        <p class="section__login__preview__subtitle">Системы автоматизации производства</p>
        <p class="section__login__preview__subtitle">Новые границы производительности</p>
      </div>
      <div class="login__wrapper">
        <div class="login__form">
          <div class="login__form__title">
            {{ toggle ? 'Зарегистрировать' : 'Войти в кабинет' }}
          </div>
          <v-form v-if="!toggle" ref="form" @submit.prevent="validate">
            <div class="login__form__item">
              <v-text-field
                v-model="username"
                variant="outlined"
                :rules="firstNameRules"
                label="Логин"
              ></v-text-field>
            </div>
            <div class="login__form__item">
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
            </div>
            <button class="login__form__btn" type="submit">Войти</button>
          </v-form>

          <v-form v-if="toggle" ref="form2" @submit.prevent="validate2">
            <div class="login__form__item">
              <v-text-field
                v-model="registUsername"
                variant="outlined"
                :rules="[(v) => !!v || 'Заполните поле']"
                label="Логин"
              ></v-text-field>
            </div>

            <div class="login__form__item">
              <v-text-field
                v-model="registPassword"
                variant="outlined"
                :append-icon="showPw1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[(v) => !!v || 'Заполните поле']"
                :type="showPw1 ? 'text' : 'password'"
                name="input-10-1"
                label="Пароль"
                counter
                @click:append="showPw1 = !showPw1"
              ></v-text-field>
            </div>

            <div class="login__form__item">
              <v-text-field
                v-model="confirmPassword"
                variant="outlined"
                :append-icon="showPw2 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[
                  (v) => !!v || 'Заполните поле',
                  (v) => v === this.registPassword || 'Пороли не совпадают'
                ]"
                :type="showPw2 ? 'text' : 'password'"
                name="input-10-1"
                label="Подтвердите пороль"
                counter
                @click:append="showPw2 = !showPw2"
              ></v-text-field>
            </div>

            <button class="login__form__btn" type="submit">Подтвердить</button>
          </v-form>
          <br />
          <a @click="toggle = !toggle" style="color: #2176ff">
            {{ toggle ? 'Войти в личный кабинет' : 'Зарегистрировать ' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios.js'
// import MenuComponent from '@/components/layout/MenuComponent.vue'
// import FooterComponent from '@/components/layout/FooterComponent.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    // MenuComponent,
    // FooterComponent
  },
  data() {
    return {
      toggle: false,
      apiKey: 'https://api.cards.edus.kz/public',
      username: '',
      password: '',

      registUsername: null,
      registPassword: null,
      confirmPassword: null,

      show: false,
      showPw1: false,
      showPw2: false,
      rules: {
        required: (value) => !!value || 'Заполните поле.',
        min: (v) => v.length >= 6 || 'Минимум 6 символов'
      },
      firstNameRules: [
        (value) => {
          if (value?.length > 0) return true

          return 'Заполните поле'
        }
      ]
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
        if (role == '/dir') {
          this.$router.push(`/main`)
        } else {
          this.$router.push(`${role}`)
        }
      } catch (error) {
        console.error(error)
        alert('Данные введены неверно')
      }
    },

    async regist() {
      try {
        const response = await axios.post('admin/user/confirm', {
          email: this.registUsername,
          password: this.registPassword,
          password_confirm: this.confirmPassword
        })
        console.log(response.data)

        alert(response.data.message + ' ' + 'Можете войти в систему')
      } catch (error) {
        console.error('Error:', error)
        alert(error.response.data.message)
      }
    },
    async validate() {
      const { valid } = await this.$refs.form.validate()
      if (valid) this.login()
    },
    async validate2() {
      const { valid } = await this.$refs.form2.validate()
      if (valid) this.regist()
    }
  },
  computed: {
    ...mapGetters(['currentRole']) // Map your getter here
  }
}
</script>
