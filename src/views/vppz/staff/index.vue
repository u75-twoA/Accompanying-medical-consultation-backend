<template>
    <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="陪护师添加" width="500">
        <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
            <el-form-item v-show="false" prop="id">
                <el-input v-model="form.id" />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const dialogFormVisible = ref(false)
const beforeClose = () => {

}

const formRef = ref();
const form = reactive({
    id: '',
    mobile: '',
    active: 1,
    age: 28,
    avatar: '',
    name: '',
    sex: ''
});

const rules = reactive({
    // 这里应该是定义表单验证规则的对象
});
</script>
<style lang="less" scoped></style>