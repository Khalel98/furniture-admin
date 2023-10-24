<template>
  <div class="search__filter">
    <input
      class="search__filter__input"
      v-model="inputValue"
      @input="emitValue"
      placeholder="Поиск"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: ['value'],
  setup(props, { emit }) {
    const inputValue = ref(props.value)

    const emitValue = () => {
      emit('update:value', inputValue.value)
    }

    return {
      inputValue,
      emitValue
    }
  }
}
</script>

<style lang="scss">

</style>
