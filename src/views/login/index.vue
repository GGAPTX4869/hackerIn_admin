<template>
  <!-- 整体背景 -->
  <div class="login-wrap">
    <!--输入框-->
    <div class="form-wrapper">
      <div class="header">USER manage</div>
      <div class="input-wrapper">
        <div class="border-wrapper">
          <input
            type="text"
            name="username"
            required
            v-model="loginForm.username"
            class="border-item"
          />
        </div>
        <div class="border-wrapper">
          <input
            type="password"
            name="password"
            required
            v-model="loginForm.password"
            class="border-item"
          />
        </div>
      </div>
      <div class="action">
        <div class="btn" @click="login">login</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import useUserStore from '@/store/modules/user.ts'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'

let loginForm = reactive({ username: 'admin1', password: 'admin' })
let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()

const login = async () => {
  // 通知仓库发送请求,登录成功跳转页面
  try {
    await userStore.userLogin(loginForm)
    // 判断query参数
    let redirect: any = $route.query.redirect

    $router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      title: '登录成功',
      message: '欢迎回来' + loginForm.username,
    })
  } catch (error) {
    ElNotification({
      title: '登录失败',
      type: 'error',
      message: (error as error).response.data.msg,
    })
  }
}
</script>

<style lang="scss">
.el-textarea__inner,
.el-input__inner {
  background: transparent !important;
}

.login-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: "JetBrains Mono" Medium;

  /* background-color: #0e92b3; */
  background: url('@/assets/images/login_background.jpg');
  background-size: cover;
}

.form-wrapper {
  width: 400px;
  padding: 50px;
  color: #fff;
  background-color: rgb(50 41 62 / 80%);
  border-radius: 20px;
}

.form-wrapper .header {
  margin-bottom: 30px;
  font-size: 25px;
  line-height: 30px;
  text-align: center;
  text-transform: uppercase;
}

.form-wrapper .input-wrapper input {
  width: 100%;
  font-size: 15px;
  color: #fff;
  text-align: center;
  background-color: rgb(41 45 62);
  border: 0;
  outline: none;
}

.form-wrapper .input-wrapper input::placeholder {
  text-transform: uppercase;
}

.form-wrapper .input-wrapper .border-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
  background-image: linear-gradient(to right, #e8198b, #0eb4dd);
  border-radius: 30px;
}

.form-wrapper .input-wrapper .border-wrapper .border-item {
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  border-radius: 30px;
}

.form-wrapper .action {
  display: flex;
  justify-content: center;
}

.form-wrapper .action .btn {
  width: 60%;
  line-height: 50px;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;
  border: 2px solid #0e92b3;
  border-radius: 30px;
}

.form-wrapper .action .btn:hover {
  background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
}

.form-wrapper .icon-wrapper {
  width: 60%;
  padding: 20px;
  margin: 0 auto;
  margin-top: 20px;
  text-align: center;
  border-top: 1px dashed rgb(146 146 146);
}

.form-wrapper .icon-wrapper i {
  padding: 5px;
  font-size: 20px;
  color: rgb(187 187 187);
  cursor: pointer;
  border: 1px solid #fff;
  border-radius: 20px;
}

.form-wrapper .icon-wrapper i:hover {
  background-color: #0e92b3;
}
</style>
