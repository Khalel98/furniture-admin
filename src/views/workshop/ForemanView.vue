<template>
  <ForemanTable :value="this.position" />
</template>

<script>
import ForemanTable from '@/components/ForemanTable.vue'
export default {
  components: {
    ForemanTable
  },
  data() {
    return {
      position: 'foreman'
    }
  }
}
</script>

<style></style>
