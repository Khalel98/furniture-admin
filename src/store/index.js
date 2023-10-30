import { createStore } from 'vuex'
import axios from '@/axios.js'

export default createStore({
  state: {
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('name') || null,
    connection: localStorage.getItem('connection') || null,
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
        const { token, name, role, connection } = response.data
        commit('setToken', token)
        commit('setUser', name)
        commit('setRole', role)
        commit('setConnection', connection)
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

        localStorage.removeItem('token')
        localStorage.removeItem('name')
        localStorage.removeItem('role')
        localStorage.removeItem('connection')
      } catch (error) {
        localStorage.removeItem('token')
        // location.reload()
        throw error
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
    currentRole(state) {
      return state.role
    },
    currentConnection(state) {
      return state.connection
    }
  }
})
