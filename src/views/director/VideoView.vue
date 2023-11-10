<template>
  <div class="section__cctv">
    <div class="section__cctv__select">
      <v-select
        v-model="selectStatus"
        :items="status"
        item-title="title"
        item-value="status"
        label="Выберите"
        variant="outlined"
        return-object
        single-line
        hide-details="none"
      ></v-select>
    </div>

    <div class="section__row" v-if="selectStatus.status == '1'">
      <div class="section__cctv__item">
        <img src="@/assets/video/1.gif" alt="" />
      </div>
      <div class="section__cctv__item">
        <img src="@/assets/video/2.gif" alt="" />
      </div>
      <div class="section__cctv__item">
        <img src="@/assets/video/3.jpeg" alt="" />
      </div>
      <div class="section__cctv__item">
        <img src="@/assets/video/4.jpeg" alt="" />
      </div>
    </div>

    <div class="section__row" v-if="selectStatus.status == '0'">
      <div class="section__cctv__item" style="width: 100% !important; height: 100% !important">
        <img
          src="@/assets/video/5.jpeg"
          style="width: 100% !important; height: 100% !important"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectStatus: { title: 'Цех', status: '1' },
      status: [
        { title: 'Офис', status: '0' },
        { title: 'Цех', status: '1' },
        { title: 'Внешние', status: '2' }
      ]
    }
  }
}
</script>

<style></style>
