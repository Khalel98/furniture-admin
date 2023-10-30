<template>
  <TableComponent :value="this.position" />
</template>

<script>
import TableComponent from '@/components/TableComponent.vue'
export default {
  components: {
    TableComponent
  },
  data() {
    return {
      position: 'vacuum'
    }
  }
}
</script>

<style></style>
