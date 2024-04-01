<template>
  <div class="">
    <ByNameSearchPage v-if="showByNameSearchPage" />
    <div v-show="showMainContent">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="js">
import {defineComponent} from "vue";
import ByNameSearchPage from "./components/ByNameSearchPage.vue";

export default defineComponent({
  name: "App",
  components: {
    ByNameSearchPage
  },
  data() {
    return {
      showByNameSearchPage: false
    }
  },
  computed: {
    showMainContent() {
      return !this.showByNameSearchPage;
    }
  },
  unmounted() {
      window.removeEventListener("message", this.preloadHandler);
  },
  mounted() {
    let self = this;
    window.addEventListener("message", this.preloadHandler)
  },
  methods: {
    preloadHandler(event) {
      if (event.source !== window) return;

      switch (event.data) {
        case "show:ByNameSearchPage": {
          this.showByNameSearchPage = !this.showByNameSearchPage;
          break;
        }
      }
    }
  }
})
</script>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9FEAF9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
