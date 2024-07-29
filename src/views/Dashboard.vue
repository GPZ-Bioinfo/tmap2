<template>
  <div class="wrapper">
    <el-header>
      <el-page-header @back="goBack" title="Home" style="color: #000"> </el-page-header>
    </el-header>
    <h1>Projects</h1>
    <div class="cardbox">
      <div class="card">
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
            <el-popover placement="bottom" width="200">
              <div class="popup-content">
                <div @click="handleTextClick($event)">genus_r1106_c421</div>
              </div>
              <el-button slot="reference" class="el-dropdown-link"> Graph name<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            </el-popover>
          </div>
        </el-card>
      </div>

      <div class="card">
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
            <el-popover placement="bottom" width="200">
              <div class="popup-content">
                <div class="textDec" @click="handleTextClick($event)">discv_genus_r1455_c373</div>
                <div class="textDec" @click="handleTextClick($event)">valid_genus_r634_c373</div>
              </div>
              <el-button slot="reference" class="el-dropdown-link"> Graph name<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            </el-popover>
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
    return {}
  },
  created() {},
  mounted() {
    this.$vuetify.theme.dark = false
  },
  methods: {
    handleTextClick(event) {
      const newGraphName = event.target.innerText
      const graphName = JSON.parse(localStorage.getItem('graphName'))
      if (JSON.parse(localStorage.getItem('paramsMap'))) {
        localStorage.removeItem('paramsMap')
      }
      localStorage.removeItem('graphName')

      localStorage.setItem('graphName', JSON.stringify(newGraphName))
      this.$router.push(`/project_id=${newGraphName}/Features`)
      if (newGraphName !== graphName) {
        location.reload()
      }
    },
    goBack() {
      localStorage.removeItem('users')
      this.$router.push('/home')
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

.popup-content {
  cursor: pointer;
  color: blue; /* 设置字体颜色为蓝色 */
  text-decoration: underline; /* 添加下划线 */
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
