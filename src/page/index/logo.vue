<template>
  <div class="avue-logo">
    <span class="title" v-if="keyCollapse">Dart</span>
    <img
      v-else
      class="avue-logo_title"
      key="1"
      src="../../assets/image/dart_logo.png"
      style="background-size: 100% 100%; width: 60%; height: 85%"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "logo",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["website", "keyCollapse"]),
  },
};
</script>

<style >
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.avue-logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 64px;
  line-height: 64px;
  background-color: #20222a;
  font-size: 20px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.8);
  z-index: 1024;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-weight: 600;
}
</style>
