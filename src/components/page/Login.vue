<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="name">
                    <el-input v-model="param.name" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item >
                    <Vcode :show="isShow" @success="success" @close="close" />
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>
     
<script>
import { Login } from '../../api/index';
import Vcode from "vue-puzzle-vcode";
export default {
    data: function() {
        return {
            param: {
                name: 'admin',
                password: '123456',
            },
            rules: {
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
            isShow: false, // 验证码模态框是否出现
        };
    },
    components: {
        Vcode,
    },
    mounted:function(){

    },
    methods: {
        submitForm() {
            let self = this;
            self.$refs.login.validate(valid => {
            if (valid) {
                self.isShow = true;
            }else{
                self.$message.error('请输入账号和密码');
                return false;
            }
            });
        },
        // 用户通过了验证
        success() {
            let self = this;
            self.isShow = false; // 通过验证后，需要手动隐藏模态框
            Login(self.param).then(res => {
                console.log(res);
                //如果服务端没有返回token，说明该账户不存在
                if(!res.result.token){
                    self.$message.error('该账户不存在');
                    return;
                }
                self.tool.setCookie('userinfo',JSON.stringify({name:self.param.name,token:res.result.token,last_logintime:res.result.last_logintime,avatar:res.result.avatar}));
                self.$message.success('登录成功');
                self.$router.push('/');
            });
        },
        // 用户点击遮罩层，应该关闭模态框
        close() {
            this.isShow = false;
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    /* background-image: url(../../assets/img/login-bg.jpg); */
    background-color:#2d3a4b;
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>