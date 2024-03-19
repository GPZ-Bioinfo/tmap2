<template>
  <div class="wrapper">
    <el-header>
      <el-page-header @back="goBack" title="Home" style="color: #000" v-if="Home_visible"> </el-page-header>
    </el-header>
    <h1>Projects</h1>
    <div class="cardbox">
      <div class="card" @click="handleClick1">
        <el-card>
          <div class="card-content">
            <h2>Title: <span class="info-value">FGFP</span></h2>
            <div class="textDec">
              <span class="info-label">Description:</span>
              <span class="info-value">Flemish Gut Flora Project</span>
            </div>
            <div class="textDec">
              <span class="info-label">Last updated:</span>
              <span class="info-value">YYYY-MM-DD HH:MM</span>
            </div>
          </div>
        </el-card>
      </div>

      <div class="popup-box" v-show="showPopup">
        <h2>Graph name:</h2>
        <div class="popup-content">
          <div @click="handleTextClick($event)">genus_r1106_c421</div>
        </div>
      </div>

      <div class="card" @click="handleClick2">
        <el-card>
          <div class="card-content">
            <h2>Title: <span class="info-value">GZFY</span></h2>
            <div class="textDec">
              <span class="info-label">Description:</span>
              <span class="info-value">Guangzhou Fuyou Gestation Cohort</span>
            </div>
            <div class="textDec">
              <span class="info-label">Last updated:</span>
              <span class="info-value">YYYY-MM-DD HH:MM</span>
            </div>
          </div>
        </el-card>
      </div>

      <div class="popup-box" v-show="showPopup2">
        <h2>Graph name:</h2>
        <div class="popup-content">
          <div class="textDec" @click="handleTextClick($event)">discv_genus_r1455_c373</div>
          <div class="textDec" @click="handleTextClick($event)">valid_genus_r634_c373</div>
        </div>
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
      showPopup: false,
      showPopup2: false,
      Home_visible: true
    }
  },
  created() {},
  mounted() {
    this.$vuetify.theme.dark = false
  },
  methods: {
    handleClick1() {
      // 点击卡片时显示弹出框
      this.showPopup = !this.showPopup
    },
    handleClick2() {
      this.showPopup2 = !this.showPopup2
    },
    handleTextClick() {
      const graphName = event.target.innerText
      localStorage.removeItem('graphName')
      localStorage.setItem('graphName', JSON.stringify(graphName))
      this.$router.push(`/project_id=${graphName}/ForceBased`)
      location.reload()
    },
    goBack() {
      this.$store.commit('removeToken')
      localStorage.removeItem('users')
      this.Home_visible = true
      this.$router.push('/home').catch((err) => {}) // eslint-disable-line
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
  margin: 30px 50px 10px 30px;
}
.card:hover {
  box-shadow: 2px 3px 6px 3px rgba(0, 0, 0, 0.3) !important;
  cursor: pointer;
}
.cardbox {
  display: flex;
  /* justify-content: space-around; */
}
h1 {
  font-size: 48px;
  margin: 30px 0 30px 30px;
}
.card-content {
  padding: 15px;

  max-width: 300px; /* 根据需要设置最大宽度 */
}
h2,
.textDec {
  margin: 0;
  padding: 0;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.textDec {
  font-size: 1em;
  margin-bottom: 5px;
}

.info-label {
  display: block; /* 设置为块级元素 */
}

.info-label {
  color: #222;
  font-weight: bold;
}

.info-value {
  color: #555;
  font-style: italic;
}
.popup-box {
  padding: 10px;
  background-color: rgb(253, 252, 252);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 300px;
  height: 200px;
}

.popup-content {
  cursor: pointer;
  color: blue; /* 设置字体颜色为蓝色 */
  text-decoration: underline; /* 添加下划线 */
}
</style>
