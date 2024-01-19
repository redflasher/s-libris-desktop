<script lang="js">
import { ipcRenderer } from 'electron'
import { defineComponent } from 'vue'
import { ref } from 'vue'

export default defineComponent({
  data() {
    return {
      list: []
    }
  },
  mounted() {
    let self = this;
    ipcRenderer.invoke('loadCoursesList', this.$route.params.id).then(_checkLists => {
      self.list = _checkLists;
    })
  },
})
</script>

<template>
  <h1>{{ this.$route.params.id }}</h1>
  <ul>
    <li v-for="course in list">
      <router-link :to="{ name: 'course', params: {id: course.ID}}">
        {{course.NAME}}
      </router-link>
    </li>
  </ul>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
