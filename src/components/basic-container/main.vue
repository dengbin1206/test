<!--
 * @Date: 2021-01-02 09:15:47
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-02 16:58:44
 * @FilePath: /SX-DTBF-VIEW/src/components/basic-container/main.vue
 * @Description:
-->
<template>
  <div class="basic-container"
       :class="{'basic-container--block':block}">
    <el-card :style="{background: background}">
      <slot></slot>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "basicContainer",
    props: {
      radius: {
        type: [String, Number],
        default: 10
      },
      background: {
        type: String
      },
      block: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      styleName () {
        return {
          borderRadius: this.setPx(this.radius),
          background: this.background,
        }
      }
    }
  };
</script>

<style scoped lang="scss">
.basic-container {
  margin-top: 10px;
  padding: 10px 6px;
  box-sizing: border-box;
  &--block {
    height: 100%;
    .el-card {
      height: 100%;

    }
  }
  .el-card {
    width: 100%;
  }
  &:first-child {
    padding-top: 0;
  }
}
</style>
