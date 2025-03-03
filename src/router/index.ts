import { createRouter, createWebHistory } from 'vue-router'
import About from '@/views/Login.vue'
import Home from '@/views/Home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Home.vue'),
        },
        {
            path: '/login',
            component: () => import('@/views/Login.vue'),
        },
    ],
})

export default router
