import { createStore } from 'vuex'
import axios from '@/axios.js'
import router from '@/router'

export default createStore({
  state: {
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('name') || null,
    connection: localStorage.getItem('connection') || null,
    user_id: localStorage.getItem('user_id') || null,
    role: JSON.parse(localStorage.getItem('role')) || null, // Parse the sto
    switchModel: localStorage.getItem('switchModel') === 'true' || false // Y // Initial value
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    setUser(state, user) {
      state.user = user
      localStorage.setItem('name', user)
    },
    setRole(state, role) {
      state.role = role
      localStorage.setItem('role', JSON.stringify(role))
    },
    setConnection(state, connection) {
      state.connection = connection
      localStorage.setItem('connection', connection)
    },
    setUserId(state, user_id) {
      state.user_id = user_id
      localStorage.setItem('user_id', user_id)
    },

    updateSwitchModel(state) {
      state.switchModel = !state.switchModel
      localStorage.setItem('switchModel', state.switchModel)
    }
  },
  actions: {
    async login({ commit }, credentials) {
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await axios.post('login', credentials)
        const { token, name, role, connection, user_id } = response.data
        commit('setToken', token)
        commit('setUser', name)
        commit('setRole', role)
        commit('setConnection', connection)
        commit('setUserId', user_id)
      } catch (error) {
        throw error
      }
    },
    async logout({ commit, state }) {
      try {
        await axios.get('logout', {
          headers: {
            Authorization: `Bearer  ${state.token}`
          }
        })

        commit('setToken', null)
        commit('setUser', null)
        commit('setRole', null)
        commit('setConnection', null)
        commit('setUserId', null)

        localStorage.removeItem('token')
        localStorage.removeItem('name')
        localStorage.removeItem('role')
        localStorage.removeItem('connection')
        localStorage.removeItem('user_id')
        router.push('/login')
      } catch (error) {
        localStorage.removeItem('token')
        router.push('/login')
        // location.reload()
        console.error(error)
      }
    }
  },
  getters: {
    isAuthenticated(state) {
      return state.token !== null
    },
    activeToken(state) {
      return state.token
    },
    currentUser(state) {
      return state.user
    },
    currentUserId(state) {
      return state.user_id
    },
    currentRole(state) {
      return state.role
    },

    currentConnection(state) {
      return state.connection
    }
  }
})
