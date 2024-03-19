<script lang="js">
import { ipcRenderer } from 'electron'
import { defineComponent } from 'vue'

export default {
  name: "Breadcrumps",
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

<template>
  <ul class="breadcrumb">
    <li v-if="groupName.length > 0">
      <router-link :to="{ name: 'home'}">
        Группы материалов
      </router-link>
    </li>
    <li v-else-if="groupName.length == 0">
      Группы материалов
    </li>

    <li v-if="groupName.length > 0 && courseName.length > 0">
       <router-link :to="{ name: 'group', params: {id: groupId}}">
         {{groupName}}
       </router-link>
    </li>
    <li v-else-if="groupName.length > 0">
      {{groupName}}
    </li>

    <li v-if="courseName.length > 0 && documentName.length > 0">
      <router-link :to="{ name: 'course', params: {id: courseId}}">
        {{courseName}}
      </router-link>
    </li>
    <li v-else-if="courseName.length > 0">
      {{courseName}}
    </li>

    <li v-show="documentName.length > 0">{{documentName}}</li>
  </ul>
</template>

<style scoped>
/*хлебные крошки*/
/* Style the list */
ul.breadcrumb {
  padding: 10px 16px;
  list-style: none;
  background-color: #eee;
}

/* Display list items side by side */
ul.breadcrumb li {
  display: inline;
  font-size: 18px;
}

/* Add a slash symbol (/) before/behind each list item */
ul.breadcrumb li+li:before {
  padding: 8px;
  color: black;
  content: "/\00a0";
}

/* Add a color to all links inside the list */
ul.breadcrumb li a {
  color: #0275d8;
  text-decoration: none;
}

/* Add a color on mouse-over */
ul.breadcrumb li a:hover {
  color: #01447e;
  text-decoration: underline;
}
</style>
