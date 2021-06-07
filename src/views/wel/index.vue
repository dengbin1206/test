<template>
  <div>
    <basic-container background="transparent">
      <el-row :gutter="10">
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
          <el-card>
            <div class="main-content">
              <div class="header">
                <div class="title">
                  <i class="iconfont iconfont-appstore"></i>
                  流程工作台
                </div>
                <div class="option">
                  <el-button
                    size="mini"
                    type="text"
                    @click="$router.push('/work/donec')"
                    >查看更多</el-button
                  >
                </div>
              </div>
              <div
                style="margin-top: 25px; padding: 5px 20px; overflow-y: auto"
              >
                <van-grid :gutter="10" square :border="false" :column-num="6">
                  <van-grid-item text="我的待办" to="/work/todoc">
                    <template #icon>
                      <van-badge
                        :content="todoCountNum === 0 ? null : todoCountNum"
                      >
                        <van-icon
                          class-prefix="iconfont"
                          name="audit"
                          size="2rem"
                        />
                      </van-badge>
                    </template>
                  </van-grid-item>
                  <van-grid-item text="抄送回复" to="/work/reply">
                    <template #icon>
                      <van-badge
                        :content="copyMeCount === 0 ? null : copyMeCount"
                      >
                        <van-icon
                          class-prefix="iconfont"
                          name="file-copy"
                          size="2rem"
                        />
                      </van-badge>
                    </template>
                  </van-grid-item>
                  <van-grid-item text="我的已办" to="/work/donec">
                    <template #icon>
                      <van-icon
                        class-prefix="iconfont"
                        name="fileprotect"
                        size="2rem"
                      />
                    </template>
                  </van-grid-item>
                  <van-grid-item text="我的发起" to="/work/affair">
                    <template #icon>
                      <van-icon
                        class-prefix="iconfont"
                        name="adduser"
                        size="2rem"
                      />
                    </template>
                  </van-grid-item>
                  <van-grid-item text="委托授权" to="/system/author">
                    <template #icon>
                      <van-icon
                        class-prefix="iconfont"
                        name="switchuser"
                        size="2rem"
                      />
                    </template>
                  </van-grid-item>
                  <van-grid-item text="更多功能" @click="moreFun">
                    <template #icon>
                      <el-dropdown placement="bottom" @command="onSelected" trigger="click" ref="dropdown">
                        <van-icon
                          class-prefix="iconfont"
                          name="ellipsis"
                          size="2rem"
                        />
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="work"
                            >我的抄送</el-dropdown-item
                          >
                          <el-dropdown-item command="disAccredit"
                            >授权给我查看的</el-dropdown-item
                          >
                          <el-dropdown-item command="accredit"
                            >我的授权查看</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </van-grid-item>
                </van-grid>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
          <el-card>
            <div class="main-content">
              <div class="header">
                <div class="title">
                  <i class="iconfont iconfont-calendar"></i>
                  日历
                </div>
                <div class="option">
                  <el-button size="mini" type="text">更多</el-button>
                </div>
              </div>
              <div style="padding: 5px 20px"><sxCalendarPro/></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import sxCalendarPro from "./CalendarPro/index";
import { myToDoCount, instCopyMeCount } from "@/api/mobileApi/flow";

export default {
  data() {
    return {
      mobile: false,
      activeName: "first",
      value: new Date(),
      todoCountNum: null,
      copyMeCount: null,
      showPopover: false,
      actions: [{ text: "选项一" }, { text: "选项二" }, { text: "选项三" }],
      option: {
        props: {
          avatar: "avatar",
          author: "author",
          body: "body",
        },
      },
      data: {
        avatar:
          "https://iconfont.alicdn.com/t/001bb462-a3ff-4c12-af15-14fa0800049f.png",
        author: "大通宝富",
        body: "测试文字内容",
      },
    };
  },
  components:{
    sxCalendarPro
  },
  computed: {
    ...mapGetters(["tagWel"]),
  },
  created() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      if (this.$route.query.route === "flowDetail") {
        this.$router.push({ path: "/mobile/flowDetail" });
      } else {
        this.$router.push({ path: "/mobile/index" });
      }
    } else {
      this.mobile = true;
      this.$router.push({ path: this.tagWel.value });
      this.getToDoNum();
      this.getCopyMeCount();
    }
  },

  methods: {
    getToDoNum() {
      myToDoCount().then((res) => {
        this.todoCountNum = res.data.data;
      });
    },

    getCopyMeCount() {
      instCopyMeCount().then((res) => {
        this.copyMeCount = res.data.data;
      });
    },

    onSelected(command) {
      switch (command) {
        case "work":
          this.$router.push("/work/copy");
          break;
        case "disAccredit":
          this.$router.push("/work/disAccredit");
          break;
        case "accredit":
          this.$router.push("/work/accredit");
          break;
        default:
          break;
      }
    },

    moreFun(){
      this.$refs.dropdown.show()
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/wel/index.scss";

.mores {
  color: #646566;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid;
  padding: 0 10px;
  &:hover {
    color: #0079fe;
  }
}

/deep/.van-grid-item__content {
  border-radius: 10px !important;
  border: 1px solid #dcdfe6 !important;
  cursor: pointer;
}

.box {
  border: 1px solid;
}

.icon-card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .inner {
    border: 1px solid;
    border-radius: 10px;
    width: 120px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .icon,
    .titled {
      flex: 1;
    }

    .icon i {
      font-size: 30px;
    }
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
    }

    .titled,
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

/deep/.el-calendar-table .el-calendar-day {
  height: 60px;
}

/deep/.van-grid-item__content{
  border-radius: 15px !important;
  border: none !important;
  box-shadow: 0 -1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  &:hover{
    transform: scale(0.95);
    border: 1px double #0079FE !important;
    box-shadow: none;
  }
}

/deep/.van-grid-item__text {
  margin-top: 5px;
}

/deep/.el-dropdown {
  color: #000;
}
</style>
