<template>
  <div class="main justify-center">
    <div class="flex-column margin-top-20vh">
      <div class="display-3 font-weight-regular span-margin">Tmap</div>
      <div class="login">
        <el-input placeholder="请输入用户名" v-model="username" clearable @keyup.native.enter="routerRedirect"></el-input>
        <el-input placeholder="请输入密码" v-model="password" show-password @keyup.native.enter="routerRedirect"></el-input>
        <v-btn outlined large rounded color="primary" class="btn" @click="routerRedirect"><i class="iconfont icon-yuanzi"></i>login</v-btn>
      </div>
    </div>
    <!-- 背景动画画布 -->
    <vue-particles
      class="login-bg"
      color="#39AFFD"
      :particleOpacity="0.7"
      :particlesNumber="100"
      shapeType="circle"
      :particleSize="4"
      linesColor="#8DD1FE"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <!-- <vue-particles color="#fff" class="particles-position" :lineOpacity="0.5" :clickEffect="false" :particlesNumber="60" :particleSize="3"></vue-particles> -->
  </div>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      username: 'admin',
      password: ''
    }
  },
  created() {
    this.$vuetify.theme.dark = true
  },
  methods: {
    routerRedirect() {
      let users = {
        token: 't2t123xafwfw2233',
        userName: this.username
      }
      if (!this.username) {
        this.$message({
          showClose: true,
          message: '请输入用户名',
          type: 'error'
        })
        return
      }
      if (!this.password) {
        this.$message({
          showClose: true,
          message: '请输入密码',
          type: 'error'
        })
        return
      }
      if (this.password === '0011') {
        localStorage.setItem('users', JSON.stringify(users))
        const isLogin = JSON.parse(localStorage.getItem('users')) && JSON.parse(localStorage.getItem('users'))
        if (isLogin) {
          this.$router.push('/dashboard')
        }
      } else {
        this.$message({
          showClose: true,
          message: '密码错误',
          type: 'error'
        })
      }
    }
  }
}
</script>
<style scoped>
.login-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
.main {
  text-align: center;
}

.margin-top-20vh {
  margin-top: 20vh;
}

.img-width {
  width: 12% !important;
  margin: 0 35px;
}

.img-d3-padding {
  padding: 8px;
}

.span-margin {
  margin: 20px 0 40px 0;
}

.particles-position {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
.el-input {
  margin-top: 15px;
  z-index: 20;
}
.btn {
  margin-top: 15px;
  z-index: 20;
}

.login {
  width: 400px;
  margin: 0 auto;
}
</style>
