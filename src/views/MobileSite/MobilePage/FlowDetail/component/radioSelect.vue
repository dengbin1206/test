<template>
  <div>
    <el-tag
      v-for="(tag, index) in tagList"
      :key="index"
      type="primary"
      :effect="tag.isChecked == true ? 'light' : 'plain'"
      size="mini"
      :class="[tag.isChecked == true ? 'active tag' : 'inactive tag']"
      @click="activeTag(tag, index)"
      >{{ tag.label }}</el-tag
    >
  </div>
</template>

<script>
export default {
  props: {
    dictData: {
      type: Array,
      default: () => [],
    },
    activeValue: {
      type: String | Object,
    },
    readonly: {
      type: Boolean,
    },
  },
  data() {
    return {
      tagList: [],
      activeTagList: [],
    };
  },

  created() {
    this.activeTagList = (this.activeValue && this.activeValue.split(",")) || [];

    this.tagList =
      this.dictData &&
      this.dictData.map((e) => {
        if (this.activeTagList.includes(e.value)) {
          return {
            label: e.label,
            value: e.value,
            isChecked: true,
          };
        } else {
          return {
            label: e.label,
            value: e.value,
            isChecked: false,
          };
        }
      });
  },

  methods: {
    activeTag(tag, index) {
      if (this.readonly) {
        return;
      } else {
        let selectedValue = "";
        this.tagList.forEach((e, i) => {
          if (index === i) {
            e.isChecked = true;
            selectedValue = e.value;
          } else {
            e.isChecked = false;
          }
        });
        this.$emit("click", selectedValue);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tag {
  margin-bottom: 3px;
  margin-right: 3px;
}

.tag:nth-child(1) {
  margin-right: 3px;
}

.active {
  background-color: #1989fa;
  color: #fff;
  border-color: #1989fa;
}

.inactive {
  background-color: #fff;
  color: #969799;
  border-color: #969799;
}

/deep/.el-tag {
  border-radius: 39px;
}
</style>