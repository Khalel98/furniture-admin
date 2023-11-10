<template>
  <OfficeTable :value="this.position" />
</template>

<script>
import OfficeTable from '@/components/OfficeTable.vue'
export default {
  components: {
    OfficeTable
  },
  data() {
    return {
      position: 'metrings'
    }
  }
}
</script>

<style></style>
