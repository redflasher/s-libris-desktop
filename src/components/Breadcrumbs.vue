<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li v-if="groupName.length > 0" class="breadcrumb-item">
        <router-link :to="{ name: 'home'}">
          Каталог
        </router-link>
      </li>
      <li v-else-if="groupName.length === 0" class="breadcrumb-item">
        Каталог
      </li>

      <li v-if="groupName.length > 0 && courseName.length > 0" class="breadcrumb-item active">
        <router-link :to="{ name: 'group', params: {id: groupId}}">
          {{groupName}}
        </router-link>
      </li>
      <li v-else-if="groupName.length > 0" class="breadcrumb-item">
        {{groupName}}
      </li>

      <li v-if="courseName.length > 0 && documentName.length > 0" class="breadcrumb-item">
        <router-link :to="{ name: 'course', params: {id: courseId}}">
          {{courseName}}
        </router-link>
      </li>
      <li v-else-if="courseName.length > 0" class="breadcrumb-item">
        {{courseName}}
      </li>

      <li v-show="documentName.length > 0" class="breadcrumb-item">{{documentName}}</li>

    </ol>
  </nav>
</template>

<script lang="js">
import { ipcRenderer } from 'electron'
import { defineComponent } from 'vue'

export default {
  name: "Breadcrumbs",
  data() {
    return {
      groupId: -1,
      courseId: -1,
      documentId: -1,

      groupName: '',
      courseName: '',
      documentName: ''
    };
  },
  computed: {
    route() {
      return this.$route;
    },
  },
  watch: {
    route (to, from) {
      console.log("route to.name", to, to.params.id);
      let self = this;
      switch(to.name) {
        case "home": {
          self.groupId = -1;
          self.groupName = '';

          self.courseId = -1;
          self.courseName = '';
          self.documentId = -1;
          self.documentName = '';

          break;
        }
        case "group": {
          ipcRenderer.invoke('getGroupName', to.params.id).then(groupName => {
            self.groupId = to.params.id;
            self.groupName = groupName;

            self.courseId = -1;
            self.courseName = '';
            self.documentId = -1;
            self.documentName = '';
          });
          break;
        }
        case "course": {
          ipcRenderer.invoke('getCourseName', to.params.id).then(courseName => {
            self.courseId = to.params.id;
            self.courseName = courseName;

            self.documentId = -1;
            self.documentName = '';
          });
          break;
        }
        case "document": {
          self.documentId = to.params.id;
          self.documentName = to.params.title;
          break;
        }
        default: {
          this.groupId = -1;
          this.courseId = -1;
          this.documentId = -1;

          this.groupName = '';
          this.courseName = '';
          this.documentName = '';
          break;
        }
      }
    }
  },
  mounted() {
  }
}
</script>


<style scoped>

</style>
