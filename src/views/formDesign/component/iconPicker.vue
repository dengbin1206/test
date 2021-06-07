<template>
  <div>
    <el-popover placement="left" width="400" trigger="click" v-model="visible">
      <div class="iconPanel">
        <div class="iconList">
          <li
            v-for="(icon, index) in iconList"
            :key="index"
            @click="selectIcon(icon)"
          >
            <a :class="`iconfont ${icon}`" v-if="icon.includes('iconfont')"></a>
            <a :class="icon" v-else></a>
          </li>
        </div>
      </div>
      <el-input
        clearable
        placeholder="图标"
        slot="reference"
        @clear="clearIcon"
      >
        <template slot="prepend" style="width: 60px">
          <i
            :class="`iconfont ${iconName}`"
            v-if="iconName.includes('iconfont')"
          ></i>
          <i :class="iconName" v-else></i>
        </template>
      </el-input>
    </el-popover>
  </div>
</template>

<script>
import { iconfontUrl, iconfontVersion } from "@/config/env";
import { iconList } from "./js/icon";
export default {
  name: "icon",
  props: ["data"],
  data() {
    return {
      iconList,
      visible: false,
      iconName: "",
    };
  },
  methods: {
    selectIcon(name) {
      this.data.icon = name;
      this.iconName = name;
      this.visible = false;
    },

    clearIcon() {
      this.iconName = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.iconPanel {
  height: 300px;
  align-content: flex-start;

  .iconList {
    width: 100%;
    height: 100%;
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    overflow-y: auto;
    align-content: flex-start;

    li {
      flex: 1;
      width: 19%;
      min-width: 19%;
      max-width: 19%;
      height: 50px;
      margin-right: 1px;
      margin-top: 5px;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      cursor: pointer;

      a {
        font-size: 28px;
        transition: all 0.2s;
        cursor: pointer;

        &:hover {
          font-size: 38px;
        }
      }
    }
  }
}
</style>