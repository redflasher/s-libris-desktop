<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li v-if="isShowCatalogLinkDisabled" class="breadcrumb-item active">
        Каталог
      </li>

      <li v-if="isShowCatalogLink" class="breadcrumb-item">
        <router-link :to="{ name: 'home'}">
          Каталог
        </router-link>
      </li>

      <li v-show="isShowSearchByNameLink" class="breadcrumb-item">
        <router-link :to="{ name: 'search-by-name'}">
          Поиск по названию
        </router-link>
      </li>

      <li v-if="groupName.length > 0 && courseName.length > 0" class="breadcrumb-item active">
        <router-link :to="{ name: 'group', params: {id: groupId}}">
          {{preparedTitle(groupName)}}
        </router-link>
      </li>
      <li v-else-if="groupName.length > 0" class="breadcrumb-item">
        {{preparedTitle(groupName)}}
      </li>

      <li v-if="isShowCourse" class="breadcrumb-item">
        <router-link :to="{ name: 'course', params: {id: courseId}}">
          {{preparedTitle(courseName)}}
        </router-link>
      </li>
      <li v-else-if="courseName.length > 0" class="breadcrumb-item">
        {{preparedTitle(courseName)}}
      </li>

      <li v-show="isShowDocumentName" class="breadcrumb-item docName">{{preparedTitle(documentName)}}</li>

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
      routeHistory: [],
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
    isShowCatalogLink() {
      return !this.isShowCatalogLinkDisabled ||
          this.isShowSearchByNameLink ||
          this.groupId > -1 || this.courseId > -1 || this.documentId > -1;
    },
    isShowCatalogLinkDisabled() {
      return this.route.name === 'home';
    },
    isShowSearchByNameLink() {
      return this.routeHistory[this.routeHistory.length - 1] === 'search-by-name';
    },
    isShowCourse() {
      if(this.courseName === undefined || this.documentName === undefined) return false;
      return this.courseName.length > 0 && this.documentName.length > 0;
    },
    isShowDocumentName() {
      if(this.documentName === undefined) return false;
      return this.documentName.length > 0;
    },

  },
  watch: {
    route (to, from) {
      if(to.name === 'home') {
        this.routeHistory.push(to.name);
      }
      let self = this;
      switch(to.name) {
        case "document-by-id": {
          self.groupId = -1;
          self.courseId = -1;
          self.documentId = to.params.id;
          ipcRenderer.invoke('getDocumentName', to.params.id).then(_documentName => {
            self.documentName = _documentName;
            // console.log("_documentName", _documentName);
          });
        }
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
  },
  methods: {
    preparedTitle(_val) {
      if(_val === undefined) return "---";
      let result = _val;
      result = result.toLowerCase();
      result = result.replace(/[^a-zA-Zа-яА-ЯёЁ0-9:.,;:&%?!#$+-\/\]\[() ]/g, "");
      result = result.charAt(0).toUpperCase() + result.slice(1);
      return result;
    }
  }
}
</script>


<style scoped>

</style>
