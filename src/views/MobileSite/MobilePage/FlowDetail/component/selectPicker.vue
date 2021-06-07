<template>
  <div>
    <van-picker
      :title="title"
      show-toolbar
      :columns="selectColumns"
      @confirm="onConfirm"
      @cancel="onCancel"
      ref="picker"
    />
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
    },
    defaultValue: String,
    title: String,
    menuKey: Number,
  },
  data() {
    return {
      selectColumns: [],
    };
  },

  watch: {
    menuKey: {
      handler(next, pre) {

        console.log(next, pre);
        this.selectColumns = this.columns.map((item) => {
          return {
            text: item.label,
            valueName: item.value,
          };
        });

        for (let i = 0; i < this.columns.length; i++) {
          let e = this.columns[i];
          if (this.defaultValue && this.defaultValue === e.value) {
            this.defaultIndex = i;
          }
        }
      },

      immediate: true,
      deep: true,
    },
  },
  methods: {
    onConfirm(value, index) {
      this.$emit("onConfirm", {
        label: value.text,
        value: value.valueName,
      });
    },
    onCancel() {
      this.$emit("onCancel");
    },
  },
};
</script>