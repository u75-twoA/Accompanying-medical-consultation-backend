import { createWebHashHistory, createRouter } from 'vue-router'
import Layout from '../views/Main.vue'
import Login from '../views/login/index.vue'
import Admin from '../views/auth/admin/index.vue'
import Group from '../views/auth/group/index.vue'
import Order from '../views/vppz/order/index.vue'
import Staff from '../views/vppz/staff/index.vue'
import Dashboard from '../views/dashboard/index.vue'

const routes = [
    {
        path: '/',
        component: Layout,
        name: 'main',
        children: [],
    },
    {
        path: '/login',
        component: Login,
    },
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
})
