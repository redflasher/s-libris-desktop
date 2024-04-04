<template>
  <div class="">
    <div class="container h-100">
      <div class="row">
        <div class="list-group">
          <ResultSearchItem v-for="result in checkListGroups" :resultItem="result" :itemType='itemType' />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { ipcRenderer } from 'electron'
import { defineComponent } from 'vue'
import ResultSearchItem from "./ResultSearchItem.vue";

export default defineComponent({
  name: "Main",
  components: {
    ResultSearchItem
  },
  data() {
    return {
      itemType: 'Group',
      checkListGroups: []
    }
  },

  mounted() {
    let self = this;
    ipcRenderer.invoke('loadGroupsList').then(_checkListGroups => {
      console.log("checkListGroups", _checkListGroups);
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

.form-check-input:focus {
  border-color: #000;
  outline: 1;
  box-shadow: 0 0 0 0.1rem rgba(13, 110, 253, 0);
}

</style>
