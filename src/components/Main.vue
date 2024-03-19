<script lang="js">
import { ipcRenderer } from 'electron'
import { defineComponent } from 'vue'
import { ref } from 'vue'

export default defineComponent({
  data() {
    return {
      checkListGroups: []
    }
  },

  mounted() {
    let self = this;
    ipcRenderer.invoke('loadGroupsList').then(_checkListGroups => {
      self.checkListGroups = _checkListGroups;
    })
  }
})
</script>

<template>
  <div class="main-as-page-wrapper">
  <ul class="list-group list-group-flush">
    <li class="list-group-item" v-for="groupName in checkListGroups">
      <router-link class="btn btn-default" :to="{ name: 'group', params: {id: groupName.ID}}">
        {{groupName.NAME}}
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
