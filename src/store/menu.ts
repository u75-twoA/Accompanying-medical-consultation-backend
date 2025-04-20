import { defineStore } from 'pinia'
import { type MenuItem } from '@/types/index'
import router from '@/router'
export const useMenuStore = defineStore('menu', {
    state: () => {
        return {
            isCollapse: false,
            selectMenu: [] as MenuItem[],
            a: 10,
            routerList: [],
        }
    },
    actions: {
        collopseMenu() {
            this.isCollapse = !this.isCollapse
        },
        addMenu(payload: MenuItem) {
            // 对数据去重
            if (this.selectMenu.length > 0) {
                const index = this.selectMenu.findIndex(
                    (item) => item.path === payload.path
                )
                if (index !== -1) {
                    this.selectMenu.splice(index, 1, payload)
                } else {
                    this.selectMenu.push(payload)
                }
            } else {
                this.selectMenu.push(payload)
            }
        },
        closeMenu(item: MenuItem) {
            const index = this.selectMenu.findIndex(
                (menu) => menu.path === item.path
            )
            this.selectMenu.splice(index, 1)
            this.a = index
        },
        dynamicMenu(payload: any) {
            //通过glob导入文件
            const modules = import.meta.glob('../views/**/**/*.vue')
            let b = 0
            function routerSet(router: any) {
                router.forEach((route: any) => {
                    //判断没有子菜单，拼接路由数据
                    if (!route.children) {
                        const url = `../views${route.meta.path}/index.vue`
                        //拿到获取的vue组件
                        route.component = modules[url]
                        console.log(route.component, 'route.component')
                        b++
                    } else {
                        routerSet(route.children)
                    }
                })
            }
            routerSet(payload)
            console.log(b, 'b')
            this.routerList = payload
        },
    },
    persist: true,
})
