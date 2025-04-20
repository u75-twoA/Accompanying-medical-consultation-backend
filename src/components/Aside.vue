<template>
    <el-menu :style="{ width: !menuStore.isCollapse ? '230px' : '64px' }" active-text-color="#ffd04b"
        background-color="#545c64" class="aside-container" default-active="2" text-color="#fff" @open="handleOpen"
        @close="handleClose" :collapse="menuStore.isCollapse">
        <p class="logo-lg">{{ menuStore.isCollapse ? 'DIDI' : 'DIDI陪诊中心' }}</p>
        <tree-menu :menuData="menuData" :index="1" />
    </el-menu>
</template>

<script lang="ts" setup>
import { useMenuStore } from '@/store/menu'
import treeMenu from './treeMenu.vue'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'


const router = useRouter()
// const menuData = reactive(
//     (router.options.routes && router.options.routes[0] && router.options.routes[0].children) || []
// );

const menuStore = useMenuStore()

const menuData = menuStore.routerList

let handleOpen = () => {
    console.log('opened');
}
function handleClose() {
    console.log('closed');
}


</script>

<style lang="less">
.aside-container {
    height: 100%;

    .logo-lg {
        font-size: 20px;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #fff;
    }
}
</style>