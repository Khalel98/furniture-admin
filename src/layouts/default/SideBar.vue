<template>
  <v-app id="inspire">
    <v-app-bar v-if="!isPermanent">
      <!-- <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Application</v-app-bar-title> -->
      <SideBarMenu @openSideBar="drawer = !drawer" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :permanent="isPermanent">
      <div>
        <div class="logo__body" v-if="isPermanent">
          <img src="@/assets/logo.png" alt="" />
        </div>

        <v-list density="compact" class="sidebar__link__body">
          <div class="sidebar__link" style="pointer-events: none">
            <v-icon class="sidebar__link__icon" icon="mdi mdi-account-circle-outline" />
            <div class="sidebar__link__title">{{ userName }}</div>
          </div>
          <div>
            <router-link
              v-for="link in singleNavigationLinks"
              :to="link.to"
              :key="link.to"
              class="sidebar__link"
            >
              <v-icon class="sidebar__link__icon" :icon="link.icon" />
              <span class="sidebar__link__title">{{ link.title }}</span>
            </router-link>
          </div>

          <v-list-group value="Admin">
            <template v-slot:activator="{ props }">
              <v-list-item class="sidebar__link" v-bind="props" title="Выбрать роль">
                <template v-slot:prepend>
                  <v-icon icon="mdi mdi-podcast"></v-icon>
                </template>
              </v-list-item>
            </template>

            <router-link
              v-for="link in userRole"
              :to="link.to"
              :key="link.to"
              class="sidebar__link"
            >
              <v-icon class="sidebar__link__icon" :icon="link.icon" />
              <span class="sidebar__link__title">{{ link.title }}</span>
            </router-link>
          </v-list-group>
        </v-list>
      </div>
      <div class="sidebar__link exit" @click="logout">
        <v-icon class="sidebar__link__icon" icon="mdi mdi-exit-to-app" />
        <div class="sidebar__link__title">Выйти</div>
      </div>
    </v-navigation-drawer>

    <v-main class="mainContent">
      <div class="mainContent__body">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>
<script setup>
import SideBarMenu from '@/components/layout/SideBarMenu.vue'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()

const userName = computed(() => store.getters.currentUser)
const userRole = computed(() => store.getters.currentRole) // Add this line to get the user's role from the store

const drawer = ref(null)
const singleNavigationLinks = [
  {
    to: '/main',
    icon: 'mdi mdi-home-analytics',
    title: 'Главная'
  },
  {
    to: '/cabinet',
    icon: 'mdi mdi-microsoft-office',
    title: 'Кабинет'
  }
]

// Define refs for screen size monitoring
const screenWidth = ref(window.innerWidth)
const isScreenSizeLessThan1100px = ref(screenWidth.value <= 1100)

const isPermanent = ref(null) // Initially, the drawer is permanent

// Function to handle screen size changes
const handleResize = () => {
  screenWidth.value = window.innerWidth
  isScreenSizeLessThan1100px.value = screenWidth.value <= 1100

  // Set the `isPermanent` ref accordingly
  if (isScreenSizeLessThan1100px.value) {
    isPermanent.value = false
  } else {
    isPermanent.value = true
  }
}

// Add a resize event listener when the component is mounted
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})

// Remove the resize event listener when the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const logout = async () => {
  try {
    await store.dispatch('logout')
    router.push('/login')
  } catch (error) {
    console.error(error)
  }
}
</script>
