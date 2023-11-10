<template>
  <div class="sidebar__menu">
    <div class="sidebar__menu__logo">
      <img src="@/assets/logo.svg" alt="" />
      <div class="sidebar__menu__text">APP</div>
    </div>
    <v-app-bar-nav-icon color="white" @click="openSideBar"></v-app-bar-nav-icon>
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
