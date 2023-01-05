<template>
  <div class="main justify-center">
    <div class="flex-column margin-top-20vh">
      <div class="display-3 font-weight-regular span-margin">Tmap</div>
      <div>
        <v-btn outlined large rounded color="primary" class="margin-0-15 z-index-2" @click="routerRedirect"><v-icon left>mdi-palm-tree</v-icon>login</v-btn>
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
    return {}
  },
  created() {
    this.$vuetify.theme.dark = true
  },
  methods: {
    routerRedirect() {
      this.$router.push('/examples').catch((err) => {}) // eslint-disable-line
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

.margin-0-15 {
  margin: 0 15px;
}

.z-index-2 {
  z-index: 2;
}

.particles-position {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>
