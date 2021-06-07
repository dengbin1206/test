<template>
  <div class="listCard">
    <el-timeline class="timeline">
      <el-timeline-item
        v-for="(item, index) in flowActivityVOList"
        :icon="item.status | iconSelect | selectIcon('icon')"
        :color="item.status | iconSelect | selectIcon('color')"
        :key="index"
        type="primary"
        size="large"
      >
        <div class="timelinecontent">
          <div class="titlearea">
            <div>{{ item.nodeName }}</div>
            <van-tag
              :color="item.status | iconSelect | selectIcon('color')"
              style="margin-left: 3px"
              >{{ item.status | iconSelect | selectIcon("text") }}</van-tag
            >
          </div>
          <div class="timecase">
            <van-icon
              class-prefix="iconfont"
              name="time-circle"
              size="0.8rem"
              color="#0079fe"
            />
            <span>
              {{ item.startTime | formatDate }} {{ "-" }}
              {{ item.assignTime | formatDate }}</span
            >
          </div>
          <div class="comment">
            {{ `${item.userName}: ${item.assignComment}` }}
          </div>
          <div class="fileList" v-if="item.flowFileList.length > 0">
            <div
              class="fileListInner"
              v-for="(file, i) in item.flowFileList"
              :key="i"
            >
              <van-icon
                class-prefix="iconfont"
                name="file"
                size="0.8rem"
                color="#0079fe"
              />
              <span @click="downLoadFile(file.fileId)">{{
                file.fileName
              }}</span>
            </div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { filters } from "../index.js";
import { getToken } from "@/util/auth";
import website from "@/config/website";

export default {
  props: {
    flowActivityVOList: {
      type: Array,
    },
  },
  filters: filters,
  data() {
    return {};
  },

  methods: {
    downLoadFile(fileId) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&affixId=${fileId || ""}`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.listCard {
  width: 90%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 3% auto;
  border-radius: 7px;
  padding: 10px 12px;
  background: #fff;

  .timeline {
    margin-top: 15px;

    .timelinecontent {
      .titlearea {
        display: flex;
        align-items: center;
        margin-bottom: 2px;

        .tag {
          margin-left: 5px;
        }
      }

      .timecase {
        font-size: 13px;
        margin-top: 3px;
      }

      .comment {
        font-size: 12px;
        color: #969799;
        word-wrap: break-word;
        margin-top: 3px;
      }

      .fileList,
      .fileListInner {
        font-size: 12px;
        color: #0079fe;
        margin-top: 3px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 80%;
      }
    }
  }
}
</style>
