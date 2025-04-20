<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20" @click="collapseMenu">
                <Fold />
            </el-icon>
            <ul class="flex-box">
                <!-- 菜单列表 -->
                <li v-for="(item, index) in menuStore.selectMenu" :key="item.path" class="tab flex-box" :class="{
                    selected: item.path == route.path
                }">
                    <el-icon size="12">
                        <component :is="item.icon" />
                    </el-icon>
                    <!-- 菜单名称 -->
                    <RouterLink class="text flex-box" :to="item.path">{{ item.name }}</RouterLink>
                    <!-- 关闭图标 -->
                    <el-icon size="12" class="close" @click="closeMenu(item)">
                        <Close />
                    </el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right">
            <el-dropdown @command="handClick">
                <div class="el-dropdown-link flex-box">
                    <el-avatar :src="userInfo.avatar" />
                    <p class="username">{{ userInfo.name }}</p>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="cancel">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

</template>

<script setup lang="ts">
import { useMenuStore } from '@/store/menu'
import { RouterLink } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { type MenuItem } from '@/types/index'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
//获取用户数据
const localdata = localStorage.getItem('pz_userInfo')
let userInfo = null
if (localdata) {
    userInfo = JSON.parse(localdata);
}
console.log(userInfo, '111111111');

function collapseMenu() {
    menuStore.collopseMenu()
}
function closeMenu(item: MenuItem) {
    menuStore.closeMenu(item)
    if (route.path !== item.path) {
        return
    }
    const selectMenuData = menuStore.selectMenu
    if (menuStore.a === selectMenuData.length) {
        if (!selectMenuData.length) {
            router.push('/')
        } else {
            router.push(selectMenuData[menuStore.a - 1].path)
        }
    } else {
        router.push(selectMenuData[menuStore.a].path)
    }

}

const handClick = (command: string) => {
    if (command === 'cancel') {
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        localStorage.removeItem('menu')
        window.location.href = window.location.origin
    }
}


</script>
<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background: #fff;
    padding-right: 25px;

    .header-left {
        height: 100%;

        .icon {
            width: 45px;
            height: 100%;
        }

        .icon:hover {
            background: #f5f5f5;
            cursor: pointer;
        }

        .tab {
            padding: 0 15px;
            height: 100%;

            .text {
                margin: 0 5px;
            }

            .close {
                visibility: hidden;
            }

            &.selected {
                a {
                    color: #409EFF;
                }

                i {
                    color: #409EFF;
                }
            }
        }

        .tab:hover {
            background-color: #f5f5f5;

            .close {
                visibility: inherit;
                cursor: pointer;
            }
        }


    }

    .header-right {
        .use-name {
            margin-left: 10px;
        }
    }

    a {
        height: 100%;
        color: #333;
    }
}
</style>