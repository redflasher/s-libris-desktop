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
})
</script>

<template>
  <h1>{{ this.$route.params.id }}</h1>
  <h2>Скачать курс одним файлом</h2>
  <ul>
    <li v-for="document in list">
      <router-link :to="{ name: 'document', params: {filename: document.filename, title: document.NAME}}">
        {{document.NAME}}
      </router-link>
    </li>
  </ul>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
