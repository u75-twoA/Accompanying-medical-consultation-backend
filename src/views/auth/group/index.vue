<template>
    <panel-head :route="route" />
    <div class="btns">
        <el-button :icon="Plus" @click="open()" type="primary" size="small">新增</el-button>
    </div>
    <el-table :data="tableData.list" width="100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="昵称"></el-table-column>
        <el-table-column prop="permissionName" label="菜单权限" width="500px"></el-table-column>
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
            <el-form-item label="名称" prop="id" v-show="false">
                <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请填写权限名称"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="permissions">
                <el-tree ref="treeRef" :data="permissionData" style="max-width: 600px" node-key="id" show-checkbox
                    :default-expand-keys="defaultKey" :default-checked-keys="defaultKeys" />
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
import { reactive, ref, onMounted, nextTick } from 'vue'
import { userGetmenu, userSetMenu, menuList } from '@/api'
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

//取路由信息
const route = useRoute()

onMounted(() => {
    userGetmenu().then(({ data }) => {
        console.log(data)
        permissionData.value = data.data
    })
    getListData()
})
//列表数据
const tableData = reactive({
    list: [],
    total: 0
})

//打开弹窗
const open = (rowData?: { id: string; name: string; permissions: string[] }) => {
    dialogFormVisable.value = true
    //form弹窗打开form为异步
    nextTick(() => {
        if (rowData) {
            Object.assign(form, { id: rowData.id, name: rowData.name })
            treeRef.value.setCheckedKeys(rowData.permissions)
        }
    })
}

const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})

const handleSizeChange = (val: number) => {
    paginationData.pageSize = val
    getListData()
}
const handleCurrentChange = (val: number) => {
    paginationData.pageNum = val
    getListData()
}
// 获取菜单列表
const getListData = () => {
    menuList(paginationData).then(({ data }) => {
        const { list, total } = data.data
        tableData.list = list
        tableData.total = total
    }).catch(error => {
        console.error('获取菜单列表失败:', error)
    })
}

const formRef = ref()

//form的数据
const form = reactive({
    id: '',
    name: '',
    permissions: ''
})

//树形菜单权限数据
const permissionData = ref([])


//控制弹窗的显示与隐藏
const dialogFormVisable = ref(false)


//关闭弹窗的回调
const beforeClose = () => {
    dialogFormVisable.value = false
    formRef.value.resetFields()
    treeRef.value.setCheckedKeys(defaultKeys.value)
}

const treeRef = ref()
//选中默认
const defaultKeys = ref([4, 5])
const defaultKey = ref([2])

const rules = reactive({
    name: [{ required: true, trigger: 'blur', message: '请输入权限名称' }]
})


//表单提交
async function confirm(formEl: any) {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
        if (valid) {
            const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
            userSetMenu({ name: form.name, permissions: permissions, id: form.id }).then(({ data }) => {
                console.log(data, 'data');
                beforeClose()
                getListData()
            }
            )
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>
<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
</style>