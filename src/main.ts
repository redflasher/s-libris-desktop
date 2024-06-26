import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import "./style.css"
import App from './App.vue'
import './samples/node-api'
import Main from "./components/Main.vue";
import Group from "./components/Group.vue";
import Course from "./components/Course.vue";
import Document from "./components/Document.vue";
import ByNameSearchPage from "./components/ByNameSearchPage.vue";
import FulltextSearchPage from "./components/FulltextSearchPage.vue";
import Page_404 from "./components/Page_404.vue";
// Import our custom CSS
import './scss/styles.scss'
// Import all of Bootstrap's JS
import * as bootstrap from '../node_modules/bootstrap';


// 1. Определите компоненты маршрута.
// Они могут быть импортированы из других файлов
// const Home = { template: '<div>Home</div>' }
// const About = { template: '<div>About</div>' }

// 2. Определите какие-нибудь маршруты
// Каждый маршрут должен быть связан с компонентом.
// О вложенных маршрутах мы поговорим позже.
const routes = [
    { path: '/', name: 'home', component: Main },
    { path: '/search-by-name', name: 'search-by-name', component: ByNameSearchPage },
    { path: '/search-fulltext', name: 'search-fulltext', component: FulltextSearchPage },
    { path: '/group/:id', name: 'group', component: Group },
    { path: '/course/:id', name: 'course', component: Course },
    { path: '/document/:filename', name: 'document', component: Document },
    { path: '/document/:id', name: 'document-by-id', component: Document },
    { path: '/404', name: '404', component: Page_404 },
]

// 3. Создайте экземпляр маршрутизатора и передайте ему опцию `routes`
// Здесь можно передать дополнительные опции, но давайте
// пока оставим все так.
const router = createRouter({
    // 4. Предоставьте реализацию history для использования. Для простоты мы используем hash.
    history: createWebHashHistory(),
    routes, // сокращение от `routes: routes`
});

createApp(App)
    .use(router)
    .mount('#app')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
    })
