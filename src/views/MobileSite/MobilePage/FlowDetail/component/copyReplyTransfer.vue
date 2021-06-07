<template>
  <div>
    <van-nav-bar
      :title="titleBar"
      left-arrow
      @click-left="$parent.close()"
    ></van-nav-bar>
    <van-cell
      title="回退环节"
      :label="label"
      v-if="titleBar === '回退'"
      is-link
      @click="showUserSelect"
      required
    />
    <van-cell
      :title="subTitle[0]"
      is-link
      center
      @click="showUserSelect"
      v-if="titleBar !== '回退'"
    >
      <template #label>
        <van-tag
          plain
          type="primary"
          v-for="(item, index) in selectedList"
          :key="index"
          class="tag"
          >{{ item.realName }}</van-tag
        >
      </template>
    </van-cell>
    <van-cell :title="subTitle[1]" center>
      <template #label>
        <textarea rows="4" class="textarea" v-model="comment"></textarea>
      </template>
    </van-cell>
    <van-goods-action>
      <van-goods-action-button
        text="确认"
        color="#409EFF"
        @click="onHandlesubmit"
      />
    </van-goods-action>

    <!-- 用户选择 -->
    <van-popup
      v-model="showSelectUserList"
      get-container="body"
      class="popup"
      position="bottom"
    >
      <userSelect @onConfirm="onConfirm" />
    </van-popup>

    <!--  回退环节 -->

    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirmBackTo"
      />
    </van-popup>
  </div>
</template>

<script>
import userSelect from "../component/userSelect";

export default {
  components: {
    userSelect,
  },
  props: {
    titleBar: {
      type: String,
    },
    subTitle: {
      type: Array,
    },
    columns: {
      type: Array,
    },
  },
  data() {
    return {
      selectedList: [],
      comment: "",
      showSelectUserList: false,
      showPicker: false,
      label: "",
      targetActivityId: ""
    };
  },

  methods: {
    onHandlesubmit() {
      this.$emit("onHandlesubmit", {
        comment: this.comment,
        selectedList: this.selectedList,
        targetActivityId: this.targetActivityId,
      });
    },

    onConfirm(users) {
      this.selectedList = users;
    },

    showUserSelect() {
      if (this.titleBar === "回退") {
        this.showPicker = true;
      } else {
        this.showSelectUserList = true;
      }
    },

    onConfirmBackTo({ valueName, text }) {
      this.showPicker = false;
      this.label = text;
      this.targetActivityId = valueName
    },
  },
};
</script>

<style lang="scss" scoped>
.textarea {
  width: 97.5%;
  border: none;
  resize: none;
  border: 1px dashed #ccc;
  color: #969799;
  font-size: 12px;
  margin-top: 15px;
}

.tag {
  margin-top: 4px;
  margin-bottom: 4px;
  margin-right: 3px;
}

.popup {
  width: 100%;
  height: 100%;
}
</style>