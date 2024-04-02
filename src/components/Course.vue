<script lang="js">
import { ipcRenderer } from 'electron'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      list: []
    }
  },
  mounted() {
    let self = this;
    ipcRenderer.invoke('loadCourseList', this.$route.params.id).then(_checkList => {
      self.list = _checkList;
    })
  },
  methods: {
    preparedTitle(_val) {
      let result = _val;
      result = result.toLowerCase();
      result = result.replace(/[^a-zA-Zа-яА-ЯёЁ0-9:.,;:&%?!#$+-\/\]\[() ]/g, "");
      result = result.charAt(0).toUpperCase() + result.slice(1);
      return result;
    }
  }
})
</script>

<template>
  <div class="main-as-page-wrapper">
    <ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="document in list">
        <router-link class="btn btn-default" :to="{ name: 'document', params: {filename: document.filename, title: document.NAME}}">
          {{preparedTitle(document.NAME)}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
