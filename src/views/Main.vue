<template>
    <div class="common-layout">
        <el-container>
            <Aside />
            <el-container>
                <el-header>
                    <Header />
                </el-header>
                <el-main>
                    <RouterView />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import Aside from '@/components/Aside.vue'
import Header from '@/components/Header.vue';
</script>

<style lang="scss" scoped>
.common-layout {
    height: 100%;

    .el-container {
        height: 100%;
    }
}
</style>