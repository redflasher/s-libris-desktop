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
  <ul>
    <li v-for="groupName in checkListGroups">
      <router-link :to="{ name: 'group', params: {id: groupName.ID}}">
        {{groupName.NAME}}
      </router-link>
    </li>
  </ul>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
