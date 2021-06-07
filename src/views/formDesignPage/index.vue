<template>
  <div class="design-container">
    <div class="design-inner">
      <sx-form-design :options="options"></sx-form-design>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: { column: [] },
    };
  },
};
</script>


<style lang="scss" scoped>
$primary-color: #409eff;
$primary-active-color: #ecf5ff;
$primary-background-color: #ecf8ff;
$primary-height: 100%;

.design-container {
  background-color: #606266;
  height: 100%;
  padding: 20px;
  .design-inner {
    min-height: $primary-height;
    height: $primary-height;
    width: $primary-height;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
}
</style>