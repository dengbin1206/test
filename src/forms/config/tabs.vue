<template>
  <div>
    <!-- tabs -->
  </div>
</template>

<script>
export default {
  name: "config-tabs",
  props: ['data'],
  data() {
    return {
      // iconList: [{
      //   label: '基本图标',
      //   list: ['el-icon-info', 'el-icon-error', 'el-icon-error', 'el-icon-success', 'el-icon-warning', 'el-icon-question']
      // },{
      //   label: '方向图标',
      //   list: ['el-icon-info', 'el-icon-back', 'el-icon-arrow-left', 'el-icon-arrow-down', 'el-icon-arrow-right', 'el-icon-arrow-up']
      // }, {
      //   label: '符号图标',
      //   list: ['el-icon-plus', 'el-icon-minus', 'el-icon-close', 'el-icon-check']
      // }],
      options: ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'blod', 'bloder', 'inherit', 'initial', 'lighter', 'normal', 'revert', 'unset']
    }
  }
}
</script>
