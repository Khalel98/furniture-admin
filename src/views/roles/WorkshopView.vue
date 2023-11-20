<template>
  <TableComponent :value="this.$route.params.position" />
</template>

<script>
import TableComponent from '@/components/TableComponent.vue'
export default {
  components: {
    TableComponent
  }
}
</script>

<style></style>
