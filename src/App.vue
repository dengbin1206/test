<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  mounted() {
    // let isMobile = navigator.userAgent.match(
    //   /(Android|webOS|iPhone|iPad|iPod|BlackBerry)/i
    // );
    // if (isMobile) {
    //   this.$router.replace("/mobileLogin");
    // } else {
    //   this.$router.replace("/login");
    // }
    Array.from(document.getElementsByClassName('el-select')).forEach((item) => {
  item.children[0].children[0].removeAttribute('readOnly')
  item.children[0].children[0].onblur = function () {
    let _this = this
    setTimeout(() => {
      _this.removeAttribute('readOnly')
    }, 200)
  }
})
  },
  created() {},
  methods: {},
  computed: {},
};
</script>
<style scoped lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
