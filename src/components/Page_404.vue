<template>
  <div class="">
    <div class="container h-100">
      <div class="row">
        Данный документ не найден в базе файлов.
      </div>
      <hr>
      <div class="row">
        <a href="javascript: void(0)" v-on:click="goBackBtn()">Вернуться назад</a>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: "Page_404",
  methods: {
    goBackBtn() {
      window.history.length > 1 ? this.$router.go(-2) : this.$router.push({ name: 'home'});
    }
  }
})
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
