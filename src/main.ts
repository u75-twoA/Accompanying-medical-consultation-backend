import { createApp } from 'vue'
import { createPinia } from 'pinia'
//导入pinia持久化配置
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.css'

import App from './App.vue'
import router from './router'
import PanelHead from './components/PanelHead.vue'

router.beforeEach((to, from) => {
    const token = localStorage.getItem('pz_token')
    if (!token && to.path !== '/login') {
        return '/login'
    } else if (token && to.path === '/login') {
        return '/'
    } else {
        return true
    }
})

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.component('PanelHead', PanelHead)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')
import { useMenuStore } from './store/menu'

const menuStore = useMenuStore()
const localdata = localStorage.getItem('menu')
if (localdata) {
    console.log(menuStore.routerList, 'dddddddddddd')
    menuStore.dynamicMenu(menuStore.routerList)
    menuStore.routerList.forEach((item) => {
        router.addRoute('main', item)
        router.push('/')
    })
}
