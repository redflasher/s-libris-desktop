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
  <div class="main-as-page-wrapper">
    <ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="course in list">
        <router-link class="btn btn-default" :to="{ name: 'course', params: {id: course.ID}}">
          {{course.NAME}}
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
