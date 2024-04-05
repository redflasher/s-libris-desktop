<template>
  <div class="main">
    <div class="close_btn">
      <button v-on:click="goBackBtn()" type="button" class="btn-close" aria-label="Close"></button>
    </div>
    <div class="container h-100">
      <div class="row">
        <div class="d-flex justify-content-center h-100">
          <div class="searchbar" :class="onStartCss">
          <input ref="search_input" v-model="searhTextModel" v-on:keypress="autoSearch()" class="search_input" type="search" placeholder="Поиск по названию документа" />
          <a v-on:click="autoSearch()" href="#" class="search_icon">
            <i class="fas fa-search"></i>
          </a>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="d-flex justify-content-center h-100">
          <div class="form-check form-switch searchSetting1">
            <input v-on:click="isFromStartSearchOnly = !isFromStartSearchOnly" v-model="isFromStartSearchOnly" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
            <label v-if="isFromStartSearchOnly" class="form-check-label container form-check-label text-start" for="flexSwitchCheckDefault">Поиск с начала названия</label>
            <label v-if="!isFromStartSearchOnly" class="form-check-label container form-check-label text-start" for="flexSwitchCheckDefault">Поиск по совпадению любой части названия</label>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="d-flex justify-content-center h-100">
          <div class="form-check form-switch searchSetting1">
            <input v-on:click="isSortByName = !isSortByName" v-model="isSortByName" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
            <label v-if="isSortByName" class="form-check-label container form-check-label text-start" for="flexSwitchCheckDefault">Сортировать по названию</label>
            <label v-if="!isSortByName" class="form-check-label container form-check-label text-start" for="flexSwitchCheckDefault">Сортировать по дате</label>
          </div>
        </div>
      </div>

      <hr>
      <div class="row">
        <div class="list-group">
          <ResultSearchItem v-for="result in results" :resultItem="result" :itemType="itemType" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import {defineComponent} from "vue";
import "@fortawesome/fontawesome-free/js/all";
import ResultSearchItem from "./ResultSearchItem.vue";
import {ipcRenderer} from "electron";
import {renderAsync} from "docx-preview";

export default defineComponent ({
  name: "ByNameSearchPage",
  components: {
    ResultSearchItem
  },
  data() {
    return {
      itemType: "DocumentById",
      isFromStartSearchOnly: true, //выполняем поиск с начала названия или нет
      isSortByName: true, //сортируем по названию
      searhTextModel: '',
      onStartCss: '',
      results: []
    }
  },
  mounted() {
    let self = this;
    this.$nextTick(() => {
      self.onStartCss = 'searchbar_hover';
      self.$refs.search_input.focus();
      window.addEventListener('keydown', event => this.goBack(event));
    });
  },
  unmounted() {
    this.onStartCss = '';
    this.searhTextModel = '';
  window.removeEventListener('keydown', event => this.goBack(event));
  },

  watch: {
    isFromStartSearchOnly() {
      this.autoSearch();
    },
    isSortByName() {
      this.autoSearch();
    },
    searhTextModel(newVal) {
      if(newVal.length === 0) {
        this.results = [];
      }
    }
  },
  methods: {
    goBack(e) {
      if (e.key == 'Escape') {
        if(this.$route.name === 'search-by-name') {
          window.history.length > 1 ? this.$router.go(-1) : this.$router.push({name: 'home'});
        }
      }
    },
    goBackBtn() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push({ name: 'home'});
    },
    autoSearch() {
      if (this.searhTextModel.length < 1) return;
      this.searchText();
    },
    searchText() {
      let self = this;
      ipcRenderer.invoke('searchDocsByName', this.searhTextModel, this.isFromStartSearchOnly, this.isSortByName).then(_results => {
        self.results = _results;
      });
    }
  }
})

</script>

<style scoped>

body,html{
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background: #e74c3c !important;
}

.searchbar{
  margin-bottom: auto;
  margin-top: 32px;
  height: 60px;
  background-color: #353b48;
  border-radius: 30px;
  padding: 10px;
}

.search_input{
  color: white;
  border: 0;
  outline: 0;
  background: none;
  width: 0;
  caret-color:transparent;
  line-height: 40px;
  transition: width 0.1s linear;
}

.searchbar_hover > .search_input{
  padding: 0 10px;
  width: 450px;
  caret-color:red;
  transition: width 0.1s linear;
}

.searchbar_hover > .search_icon{
  background: white;
  color: #e74c3c;
}

.search_icon {
  height: 40px;
  width: 40px;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color:white;
  text-decoration:none;
}

.close_btn {
  background-color: #eeeeee;
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 1;
  padding: 0;
  margin: 0;
}

.main {
  background-color: #eeeeee;
  overflow: scroll;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  padding: 0;
  margin: 0;
}

@media screen and (min-width: 20px) and (max-width: 320px) {
  .searchbar_hover > .search_input{
    padding: 0 10px;
    width: 100%;
    caret-color:red;
    transition: width 0.1s linear;
  }

  .search_icon {
    height: 40px;
    width: 40px;
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color:white;
    text-decoration:none;
  }
}

.searchSetting1 {
  padding-top: 8px;
  width: 500px;
}

input.form-check-input:checked {
  background-color: #353b48;
}

.btn-close:focus, .form-check-input:focus {
  border-color: #000;
  outline: 1;
  box-shadow: 0 0 0 0.1rem rgba(13, 110, 253, 0);
}

</style>
