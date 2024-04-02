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
    ipcRenderer.invoke('loadCoursesList', this.$route.params.id).then(_checkLists => {
      self.list = _checkLists;
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
      <li class="list-group-item" v-for="course in list">
        <router-link class="btn btn-default" :to="{ name: 'course', params: {id: course.ID}}">
          {{preparedTitle(course.NAME)}}
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
