<template>

  <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
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
  name: "ResultSearchItem",
  props: ['resultItem'],
  components: {

  },
  computed: {
    docType() {
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
      let result = this.resultItem.NAME;
      result = result.toLowerCase();
      result = result.replace(/[^a-zA-Zа-яА-ЯёЁ0-9:.,;:&%?!#$+-\/\]\[() ]/g, "");
      result = result.charAt(0).toUpperCase() + result.slice(1);
      return result;
    },
    preparedDate() {
      let result = this.resultItem.DATE_MATERIALS;
      if(result.length === 0) return "-";
      result = result.substr(6,2) + "/" + result.substr(4,2) + "/" + result.substr(0,4);
      return result;
    }
  }
})
</script>

<style scoped>
.docName {
  white-space: nowrap; /* Запрещаем перенос строк */
  overflow: hidden; /* Обрезаем все, что не помещается в область */
  padding: 5px; /* Поля вокруг текста */
  text-overflow: ellipsis; /* Добавляем многоточие */
}
</style>
