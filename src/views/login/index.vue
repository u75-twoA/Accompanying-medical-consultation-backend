<template>
    <el-row class="login-container" justify="center" align="middle">
        <el-card style="max-width: 480px;">
            <template #header>
                <div class="card-header">
                    <img :src="imgUrl" alt="">
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="handerChange">{{ formType ? '返回登录' : '注册账号' }}</el-link>
            </div>
            <el-form :model="loginForm" label-width="auto" style="max-width: 600px" class="demo-ruleForm"
                ref="loginFormRef" :rules="rules">
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="UserFilled"></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="loginForm.passWord" type="password" placeholder="密码"
                        :prefix-icon="Lock"></el-input>
                </el-form-item>
                <el-form-item prop="validCode" v-if="formType">
                    <el-input v-model="loginForm.validCode" placeholder="验证码" :prefix-icon="Lock">
                        <template #append>
                            <span @click="countDownChange">{{ countDown.validText }}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :style="{ width: '100%' }" @click="submitForm(loginFormRef)">
                        {{ formType ? '注册' : '登录' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
</template>

<script setup lang="ts">
import { Lock, UserFilled } from '@element-plus/icons-vue';
import { ref, reactive, toRaw } from 'vue';
import { getCode, useraAuthentication, login, menuPermissions } from '../../api';
import { useRouter } from 'vue-router';
import { useMenuStore } from '@/store/menu'


const router = useRouter();
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href;
const menuStore = useMenuStore();

//表单的初始数据
const loginForm = reactive({
    userName: '',
    passWord: '',
    validCode: ''
});

//表单验证
const ValidateUser = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('请输入手机号'));
    }
    else {
        const phoneReg = /^1[3-9]\d{9}$/;
        if (!phoneReg.test(value)) {
            callback(new Error('手机号格式不正确'));
        } else {
            callback();
        }
    }
}

const ValidatePass = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('请输入密码'));
    }
    else {
        const Reg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/;
        if (!Reg.test(value)) {
            callback(new Error('密码格式不正确'));
        } else {
            callback();
        }
    }
}
//表单校验
const rules = reactive({
    userName: [
        { validator: ValidateUser, trigger: 'blur' }],
    passWord: [
        { validator: ValidatePass, trigger: 'blur' }]
})


//发送短信
const countDown = reactive({
    validText: '发送短信',
    time: 60
})
let tag = false;
function countDownChange() {
    if (tag) return
    // 判断手机号是否正确
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
        ElMessage({
            message: '请检查手机号是否正确',
            type: 'warning',
        })
    }

    const time = setInterval(() => {
        if (countDown.time <= 0) {
            countDown.validText = '发送验证码';
            countDown.time = 60;
            tag = false;
            clearInterval(time);
        } else {
            countDown.time -= 1;
            countDown.validText = `剩余${countDown.time}`;
        }
    }, 1000);
    tag = true;
    getCode({ tel: loginForm.userName }).then(({ data }) => {
        console.log(data, 'data');
        if (data.code === 10000) {
            ElMessage({
                message: '发送成功',
                type: 'success',
            })
        } else {
            ElMessage({
                message: '发送失败',
                type: 'warning',
            })
        }
    })
}
//切换表单（0是登录，1是注册）
const formType = ref(0);

//点击切换登录方式
const handerChange = () => {
    formType.value = formType.value === 0 ? 1 : 0;
}

const loginFormRef = ref();
//表单提交
async function submitForm(formEl: any) {
    if (!formEl) return
    await formEl.validate((valid: any, fields: any) => {
        if (valid) {
            //注册页面
            if (formType.value === 1) {
                useraAuthentication(loginForm).then(({ data }) => {
                    if (data.code === 10000) {
                        ElMessage({
                            message: '注册成功请登录',
                            type: 'success',
                        })
                        formType.value = 0;
                    } else {
                        ElMessage({
                            message: '注册失败',
                            type: 'warning',
                        })
                    }
                })
            } else {
                login({ userName: loginForm.userName, passWord: loginForm.passWord }).then(({ data }) => {
                    if (data.code === 10000) {
                        ElMessage({
                            message: '登录成功',
                            type: 'success',
                        })
                        localStorage.setItem('pz_token', data.data.token)
                        localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo))
                        menuPermissions().then(({ data }) => {
                            menuStore.dynamicMenu(data.data)
                            console.log(data, '**********');
                            console.log(menuStore.routerList, 'menuStore.menuList');
                            toRaw(menuStore.routerList).forEach((item: any) => {
                                router.addRoute('main', item)
                            })
                            router.push('/')
                        })

                    } else {
                        ElMessage({
                            message: '登录失败',
                            type: 'warning',
                        })
                    }
                })

            }
        } else {
            console.log('error submit!', fields)
        }
    })

}

</script>



<style lang="less" scoped>
:deep(.el-card__header) {
    padding: 0
}

.login-container {
    height: 100%;

    .card-header {
        background-color: #899fe1;

        img {
            width: 430px;
        }
    }

    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
}
</style>
