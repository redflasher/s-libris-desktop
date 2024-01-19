<script lang="js">
import { ipcRenderer } from 'electron'
import { ref, defineComponent } from 'vue'
import {renderAsync} from 'docx-preview';

export default defineComponent({
  data() {
    return {
      checkListGroups: [],
      checkLists: []
    }
  },
  setup(props) {
    props.message
  },
  mounted() {
    let self = this;
    ipcRenderer.invoke('loadDocxFile', this.$route.params.filename).then(dataBlob => {
      // https://www.npmjs.com/package/docx-preview
      renderAsync(dataBlob,
          document.getElementById("docxViewer"),
          null,
      {
        // ignoreWidth: true,
        ignoreHeight: true,
        breakPages: true
        // breakPages: true
      })
          .then(x => console.log("docx: finished"));
    })
  },
  methods: {
    downloadFile() {
    },
    drugFile() {

    }
  }
})


const count = ref(0)



</script>

<template>
<!--  <h1>Скачать файл</h1>-->
<!--  todo: оформить название документа как шапку вверху. туда же разместить:
 хлебные крошки
 кнопку "скачать"
 переход на другой язык
 поиск по тексту
 кнопки изменения масштаба.

 так же, сделать:
  изменение масштаба колесом мыши
  адаптацию ширины документа к размеру экрана
  возможность перетащить файл за пределы окна чтобы сохранить его там

  курсор-закладку - справа от документа. ставится и убирается по щелчку мыши, сбоку от документа
 -->
  <div class="content">
    <h5>{{ this.$route.params.title}}</h5>
    <div id="docxViewer"></div>
    <div id="styleContainer"></div>
  </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
