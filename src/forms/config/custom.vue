<template>
  <div>
    <el-form-item label="标题宽度">
      <el-input v-model="data.labelWidth"
                placeholder="标题宽度"></el-input>
    </el-form-item>
    <el-form-item label="是否禁用">
      <el-switch v-model="data.disabled"></el-switch>
    </el-form-item>
    <el-form-item label="是否可见">
      <el-switch v-model="data.display"></el-switch>
    </el-form-item>
  </div>
</template>
<script>

export default {
  name: 'config-custom',
  props: ['data'],
  data() {
    return {
      params: this.data.params || {},
      event: this.data.event || {},
      options: {
        minimap: {
          enabled: false,
        },
      },
    }
  },
  methods: {
  },
  watch: {
    'data.params'(val) {
      this.params = val || {}
    },
    'data.event'(val) {
      this.event = val || {}
    },
    params(val) {
      try {
        this.data.params = eval("(" + val + ")")
      } catch (e) {
        // console.error(e)
      }
    },
    event(val) {
      try {
        this.data.event = eval("(" + val + ")")
      } catch (e) {
        // console.error(e)
      }
    }
  }
}
</script>
