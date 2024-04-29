<template>

  <a href="javascript: void(0)" v-on:click="doClickAction()" class="list-group-item list-group-item-action flex-column align-items-start">
    <div class="d-flex w-100 justify-content-between">
      <small class="col-2 text-start">{{ docType }}</small>
      <h5 class="col-8 text-start docName">{{ preparedTitle }}</h5>
      <small>{{ preparedDate }}</small>
    </div>
    <!--<small>Кусочек содержания</small>-->
  </a>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "ResultFulltextSearchItem",
  /**
   * resultItem - массив с элементами списка
   * itemType - тип элемента. определяет действие при щелчке по элементу списка
      * 'Group' - группа контрольных листов на одну тему.
      * 'CheckList' - КЛ. при щелчке переход внутрь КЛ.
      * 'Document' - Документ. при щелчке переход на содержимое документа.
   */
  props: ['resultItem', 'itemType'],
  components: {

  },
  mounted() {
    // console.log("resultItem", this.resultItem);
  },
  computed: {
    docType() {
      if(!this.resultItem.hasOwnProperty('FILE_NAME')) return "";
      let rawData = this.resultItem.FILE_NAME;
      if(rawData.indexOf('Admin dict') !== -1) return "Админ словарь";
      if(rawData.indexOf('Book extracts russian') !== -1) return "Фрагмент книги";
      if(rawData.indexOf('CBR confid rus') !== -1) return "КБР конфид";
      if(rawData.indexOf('CBR nonconfid rus') !== -1) return "КБР неконфид";
      if(rawData.indexOf('HCO Bs Russian') !== -1) return "БОХС";
      if(rawData.indexOf('HCO PLs Russian') !== -1) return "ИП";
      if(rawData.indexOf('Lists Russian') !== -1) return "Список";
      if(rawData.indexOf('LRH confidential') !== -1) return "ЛРХ конфид";
      if(rawData.indexOf('Ls rus') !== -1) return "Ls";
      if(rawData.indexOf('PABs and Ability Russian') !== -1) return "Журнал";
      if(rawData.indexOf('QBRB and others Max') !== -1) return "Макс Хаури";
      if(rawData.indexOf('Russian Tapes') !== -1) return "Лекция";
    },
    preparedTitle() {
      if(!this.resultItem.hasOwnProperty('NAME')) return "-";
      let result = this.resultItem.NAME;
      result = result.toLowerCase();
      result = result.replace(/[^a-zA-Zа-яА-ЯёЁ0-9:.,;:&%?!#$+-\/\]\[() ]/g, "");
      result = result.charAt(0).toUpperCase() + result.slice(1);
      return result;
    },
    preparedDate() {
      if(!this.resultItem.hasOwnProperty('DATE_MATERIALS')) return "";
      let result = this.resultItem.DATE_MATERIALS;
      if(result.length === 0) return "-";
      result = result.substr(6,2) + "/" + result.substr(4,2) + "/" + result.substr(0,4);
      return result;
    }
  },
  methods: {
    doClickAction() {
      switch (this.itemType) {
        case 'Group': {
          this.$router.push({ name: 'group', params: {id: this.resultItem.ID}});
          break;
        }
        case 'CheckList': {
          this.$router.push({ name: 'course', params: {id: this.resultItem.ID}});
          break;
        }
        case 'Document': {
          console.log("Document, this.resultItem",  this.resultItem);
          if(!this.resultItem.hasOwnProperty("FILE_NAME")) {
            console.log("error:", "ResultSearchItem.vue has not FILE_NAME");
            console.log("error, this.resultItem:", this.resultItem);
            return;
          }
          this.$router.push({ name: 'document', params: {filename: this.resultItem.FILE_NAME}});
          break;
        }
        case 'DocumentById': {
          this.$router.push({ name: 'document-by-id', params:
                {id: this.resultItem.ID}
          });
          break;
        }
        default: {
          console.log("case.default", this.itemType);
        }
      }
    }
  }
})
</script>

<style scoped>
</style>
