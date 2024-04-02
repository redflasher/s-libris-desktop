<script lang="js">
import { ipcRenderer } from 'electron'
import { defineComponent } from 'vue'

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
    <li class="list-group-item" v-for="groupName in checkListGroups">
      <router-link class="btn btn-default" :to="{ name: 'group', params: {id: groupName.ID}}">
        {{preparedTitle(groupName.NAME)}}
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
