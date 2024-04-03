<script lang="js">
import { ipcRenderer } from 'electron'
import { ref, defineComponent } from 'vue'
import {renderAsync} from 'docx-preview';

export default defineComponent({
  props: ['itemType'],
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
    if(this.$route.params.hasOwnProperty("id")) {
      ipcRenderer.invoke('loadDocxFileById', this.$route.params.id)
          .then(dataBlob => this.docBlobRenderToPage(dataBlob));
    } else {
      ipcRenderer.invoke('loadDocxFileByFilename', this.$route.params.filename)
          .then(dataBlob => this.docBlobRenderToPage(dataBlob));
    }
  },
  methods: {
    downloadFile() {
    },
    drugFile() {
    },
    docBlobRenderToPage(dataBlob) {
      // https://www.npmjs.com/package/docx-preview
      renderAsync(dataBlob,
          document.getElementById("docxViewer"),
          null,
          {
            inWrapper: true, //enables rendering of wrapper around document content
            ignoreWidth: false, //disables rendering width of page
            ignoreHeight: false, //disables rendering height of page
            ignoreFonts: false, //disables fonts rendering
            breakPages:  false, //enables page breaking on page breaks
            ignoreLastRenderedPageBreak: true, //disables page breaking on lastRenderedPageBreak elements
            experimental:  false, //enables experimental features (tab stops calculation)
            trimXmlDeclaration: true, //if true, xml declaration will be removed from xml documents before parsing
            useBase64URL: false, //if true, images, fonts, etc. will be converted to base 64 URL, otherwise URL.createObjectURL is used
            renderChanges: false, //enables experimental rendering of document changes (inserions/deletions)
            renderHeaders: true, //enables headers rendering
            renderFooters: true, //enables footers rendering
            renderFootnotes: true, //enables footnotes rendering
            renderEndnotes: true, //enables endnotes rendering
            debug: false, //enables additional logging
          })
          .then(x => {
            console.log("docx: finished", x);
            const docxElem = document.getElementsByClassName("docx-wrapper");
            //удаляем первую пустую страницу
            if(docxElem[0].childNodes.length > 1) {
              const elementArray = [...docxElem[0].childNodes];
              elementArray[0].remove();
            }
          });
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
  <!-- end styles -->
  <div class="">
    <h5>{{ this.$route.params.title}}</h5>
    <div class="d-flex ">
      <div id="docxViewer"></div>
    </div>
  </div>

</template>

<style scoped>
.read-the-docs {
  /*color: #888;*/
}
</style>
