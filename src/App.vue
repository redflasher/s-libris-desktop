<template>
  <div class="main">
    <div class="container h-100">
      <div class="row">
        <Breadcrumbs />
      </div>
      <div class="row">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import {defineComponent} from "vue";
import Breadcrumbs from "./components/Breadcrumbs.vue";

export default defineComponent({
  name: "App",
  components: {
    Breadcrumbs
  },
  data() {
    return {
    }
  },
  computed: {
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
          this.$router.push({ name: 'search-by-name'});
          break;
        }
        case "show:FulltextSearchPage": {
          this.$router.push({ name: 'search-fulltext'});
          break;
        }
        case "goto:home": {
          this.$router.push({ name: 'home'});
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
