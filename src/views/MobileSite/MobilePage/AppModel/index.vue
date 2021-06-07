<template>
  <div>
    <AppPanel :actions="actionList"/>
  </div>
</template>

<script>
import AppPanel from "../../MobileComponent/AppPanel.js";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  components: {
    AppPanel,
  },

  computed: {
    ...mapState("Home", ["actionList"]),
  },



};
</script>

<style>
</style>