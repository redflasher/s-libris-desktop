<template>
  <div class="main">
    <div class="container h-100">
      <hr>
      <div class="row">
        <div class="list-group">
          <ResultSearchItem v-for="result in list" :resultItem="result" :itemType='itemType' />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { ipcRenderer } from 'electron'
import { defineComponent } from 'vue'
import ResultSearchItem from "./ResultSearchItem.vue"

export default defineComponent({
  name: "Main",
  components: {
    ResultSearchItem
  },
  data() {
    return {
      itemType: 'CheckList',
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

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
