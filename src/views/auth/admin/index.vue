<template>
    <panel-head :route="route" />
    <el-table :data="tableData.list" width="100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="昵称"></el-table-column>
        <el-table-column prop="permission_id" label="所属组别">
            <template #default="scoped">
                {{ permissionName(scoped.row.permission_id) }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="active" label="状态">
            <template #default="scoped">
                <el-tag :type="scoped.row.active ? 'success' : 'danger'">{{ scoped.row.active ? '正常' : '失效' }}</el-tag>
            </template>
        </el-table-column>

        <el-table-column prop="active" label="创建时间">
            <template #default="scoped">
                <div class="flex-box">
                    <span>
                        {{ scoped.row.create_time }}
                    </span>
                </div>
            </template>
        </el-table-column>


        <el-table-column label="操作">
            <template #default="scoped">
                <el-button type="primary" @click="open(scoped.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize"
            :background="false" layout="total, prev, pager, next" :total="tableData.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" size="small" />
    </div>
    <el-dialog v-model="dialogFormVisable" :before-close="beforeClose">
        <el-form ref="formRef" label-width="100px" lab-position="left" :model="form" :rules="rules">
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" disabled></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width: 240px;">
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>

</template>

<script setup lang="ts">
import { authAdmin, menuSelectlist, updateUser } from '@/api'
import { reactive, onMounted, ref } from 'vue';
import { type SelectList } from '@/types/index'
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';

//当前页面路由
const route = useRoute()

const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})

const tableData = reactive({
    list: [],
    total: 0
})
onMounted(() => {
    authAdmin(paginationData).then(({ data }) => {
        console.log(data)
        const { list, total } = data.data
        list.forEach((el: any) => {
            el.create_time = dayjs(el.create_time).format('YYYY-MM-DD HH:mm:ss')
            el.update_time = dayjs(el.update_time).format('YYYY-MM-DD HH:mm:ss')
        })
        tableData.list = list
        tableData.total = total
    }
    )
    menuSelectlist().then(({ data }) => {
        options.value = data.data
    })
})
//权限id匹配权限名称
const permissionName = (id: string) => {
    const data = options.value.find(el => el.id === id)
    return data ? data.name : '超级管理员'
}
const options = ref<SelectList[]>([])
const handleSizeChange = (val: number) => {
    paginationData.pageSize = val
    getListData()
}
const handleCurrentChange = (val: number) => {
    paginationData.pageNum = val
    getListData()
}

//编辑表单
const form = reactive({
    mobile: '',
    name: '',
    permissions_id: '',
})
const rules = reactive({
    name: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
    ],
    permissions_id: [
        { required: true, message: '请选择菜单权限', trigger: 'change' }
    ]
})

const dialogFormVisable = ref(false)
const beforeClose = () => {
    dialogFormVisable.value = false
}

const formRef = ref()
//表单提交
const confirm = async (formEl: any) => {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
        if (valid) {
            const { name, permissions_id } = form
            updateUser({ name, permissions_id }).then(({ data }) => {
                if (data.code === 10000) {
                    dialogFormVisable.value = false
                    getListData()
                }
            }
            )

        } else {
            console.log('error submit!', fields)
        }
    })
}
const getListData = () => {
    authAdmin(paginationData).then(({ data }) => {
        console.log(data)
        const { list, total } = data.data
        list.forEach((el: any) => {
            el.create_time = dayjs(el.create_time).format('YYYY-MM-DD HH:mm:ss')
            el.update_time = dayjs(el.update_time).format('YYYY-MM-DD HH:mm:ss')
        })
        tableData.list = list
        tableData.total = total
    }
    )
}

const open = (rowdData: any) => {
    Object.assign(form, { mobile: rowdData.mobile, name: rowdData.name, permissions_id: rowdData.permissions_id })
    dialogFormVisable.value = true
}


</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
}
</style>