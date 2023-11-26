<template>
  <div class="wrapper">
    <el-header>
      <el-page-header @back="goBack" title="Home" style="color: #000" v-if="Home_visible"> </el-page-header>
    </el-header>
    <h1>New Project</h1>
    <div class="cardbox">
      <div @click="handleClick">
        <el-card @click="handleClick" class="card">
          <div class="card-image"><img src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" alt="Card Image" /></div>
          <div class="card-content">
            <p>Your card content goes here</p>
          </div>
        </el-card>
      </div>
      <div @click="handleClick">
        <el-card @click="handleClick" class="card">
          <div class="card-image"><img src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" alt="Card Image" /></div>
          <div class="card-content">
            <p>Your card content goes here</p>
          </div>
        </el-card>
      </div>
      <div @click="handleClick">
        <el-card @click="handleClick" class="card">
          <div class="card-image"><img src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" alt="Card Image" /></div>
          <div class="card-content">
            <p>Your card content goes here</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
/*
 *@Date: 2023-10-10 05:34:38
 *@Description: 模块描述
 */
export default {
  name: '',
  data() {
    return {
      Home_visible: true
    }
  },
  created() {},
  mounted() {
    this.$vuetify.theme.dark = false
  },
  methods: {
    handleClick() {
      this.$router.push('/examples/ForceBased')
    },
    goBack() {
      this.$store.commit('removeToken')
      localStorage.removeItem('users')
      this.Home_visible = true
      this.$router.push('/home').catch((err) => {}) // eslint-disable-line
    }
  },
  beforeRouteEnter(to, from, next) {
    const isLogin = JSON.parse(localStorage.getItem('users'))
    if (isLogin.token !== 't2t123xafwfw2233') {
      next({
        path: '/home'
      })
    } else {
      next()
    }
  }
}
</script>

<style>
.wrapper {
  height: 100%;
}
.el-header {
  height: 60px;
  background-color: #c8d0d4;
  display: flex;
}
.el-page-header {
  height: 60px;
  width: 100px;
  justify-content: center;
  align-items: center;
}
.card {
  width: 350px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2) !important;
  border-radius: 10px;
  margin: 30px 0 10px 30px;
}
.card:hover {
  box-shadow: 2px 3px 6px 3px rgba(0, 0, 0, 0.3) !important;
  cursor: pointer;
}
.cardbox {
  display: flex;
  /* justify-content: center;
  align-items: center; */
}
h1 {
  font-size: 48px;
  margin: 30px 0 30px 30px;
}
</style>
