<template>
    <template v-for="(item, index) in props.menuData">
        <el-menu-item @click="handleClick(item, `${props.index}-${item.meta.id}`)"
            v-if="!item.children || item.children.length == 0" :index="`${props.index}-${item.meta.id}`"
            :key="`${props.index}-${item.meta.id}`">
            <el-icon size="20">
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.name }}</span>
        </el-menu-item>
        <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
            <template #title>
                <el-icon size="20">
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.name }}</span>
            </template>
            <tree-menu :index="`${props.index}-${item.meta.id}`" :menuData="item.children" />
        </el-sub-menu>
    </template>

</template>
<script setup lang="ts">
import { useMenuStore } from '@/store/menu'
import { useRouter } from 'vue-router';
import { } from '@/store/menu'

const props = defineProps(['menuData', 'index'])
const router = useRouter()
const menuStore = useMenuStore()


//点击菜单
function handleClick(item: any, active: any) {
    router.push(item.meta.path)
    console.log(item.meta)
    menuStore.addMenu(item.meta)
}


</script>
<style></style>