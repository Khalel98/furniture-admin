<template>
  <div class="sidebar__menu">
    <img src="@/assets/logo.png" alt="" />
    <v-app-bar-nav-icon @click="openSideBar"></v-app-bar-nav-icon>
  </div>
</template>

<script>
export default {
  methods: {
    openSideBar() {
      this.$emit('openSideBar')
    }
  }
}
</script>
