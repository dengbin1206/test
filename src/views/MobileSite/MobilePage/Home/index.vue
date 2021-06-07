<template>
  <div class="wrapper">
    <van-nav-bar title="个人中心" @click-right="onClickRight">
      <template #right>
        <van-icon
          class-prefix="iconfont"
          name="setting"
          size="1.2rem"
          color="#0079fe"
        />
      </template>
    </van-nav-bar>
    <div class="header">
      <div class="profile">
        <div class="inner">
          <div class="photo">{{ userInfo.realName }}</div>
          <div class="content">
            <div class="name">{{ userInfo.realName }}</div>
            <div class="dept">
              <van-icon class-prefix="iconfont" name="bank" size="1rem" />
              {{ userInfo.deptName }}
            </div>
            <div class="position">
              <van-icon class-prefix="iconfont" name="user" size="1rem" />
              {{ userInfo.postName }}
            </div>
          </div>
        </div>
      </div>
      <div class="topCard">
        <div class="card">
          <div class="mainTitle">
            <span>我的流程</span>
            <div class="rightTitle">
              <span @click="enterPage('done')">查看全部流程</span
              ><van-icon class-prefix="iconfont" name="right" size="0.8rem" />
            </div>
          </div>
          <van-grid :column-num="4" :border="false">
            <van-grid-item @click="enterPage('todo')">
              <template #icon>
                <van-badge :content="todoCountNum === 0 ? null : todoCountNum">
                  <van-icon class-prefix="iconfont" name="audit" size="2rem" />
                </van-badge>
              </template>
              <template #text>
                <span class="iconText">我的待办</span>
              </template>
            </van-grid-item>
            <van-grid-item @click="enterPage('done')">
              <template #icon>
                <van-icon
                  class-prefix="iconfont"
                  name="fileprotect"
                  size="2rem"
                />
              </template>
              <template #text>
                <span class="iconText">我的已办</span>
              </template>
            </van-grid-item>
            <van-grid-item @click="enterPage('myInstance')">
              <template #icon>
                <van-icon class-prefix="iconfont" name="adduser" size="2rem" />
              </template>
              <template #text>
                <span class="iconText">我的发起</span>
              </template>
            </van-grid-item>
            <van-grid-item @click="enterPage('reply')">
              <template #icon>
                <van-badge :content="copyCountNum === 0 ? null : copyCountNum">
                  <van-icon
                    class-prefix="iconfont"
                    name="file-copy"
                    size="2rem"
                  />
                </van-badge>
              </template>
              <template #text>
                <span class="iconText">抄送回复</span>
              </template>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
    </div>
    <div class="funcContent">
      <div class="funcCard">
        <div class="mainTitle">
          <span>我的应用</span>
        </div>
        <div class="wapper">
          <AppPanel :visible.sync="visible" :actions="actionList" />
          <div class="application">
            <van-popover
              v-for="(item, index) in applicationData"
              :key="index"
              v-model="item.show"
              :trigger="trigger"
              :actions="item.actions ? item.actions : []"
              :placement="setPlacement(index)"
              theme="dark"
              style="left: 0"
              @select="getDetail"
              ref="popover"
            >
              <template #reference>
                <div class="mode" @click="handleCick(item, index)">
                  <div class="icon">
                    <van-icon
                      class-prefix="iconfont"
                      :name="item.source"
                      size="2rem"
                    />
                  </div>
                  <div class="text">{{ item.name }}</div>
                </div>
              </template>
            </van-popover>
          </div>
        </div>
      </div>
    </div>

    <div>
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g class="parallax">
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="0"
            fill="rgba(0,121,254,0.7)"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="3"
            fill="rgba(0,121,254,0.5)"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="5"
            fill="rgba(0,121,254,0.3)"
          />
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="7"
            fill="rgba(0,121,254,0.1)"
          />
        </g>
      </svg>
    </div>

    <popup :showPopup.sync="showPopup" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { setStore, getStore } from "@/util/store";
import * as dd from "dingtalk-jsapi";
import { getTopMenu } from "./index.js";
import popup from "./popup";
import AppPanel from "../../MobileComponent/AppPanel";
export default {
  components: {
    popup,
    AppPanel,
  },

  data() {
    return {
      applicationData: [],
      actionList: [],
      showPopover: false,
      showQuality: false,
      showMarket: false,
      showPopup: false,
      visible: false,
      trigger: "",
      actions: [
        { text: "设备点检" },
        { text: "点检记录" },
        { text: "设备信息" },
      ],
      qualityActions: [
        { text: "检验单" },
        // { text: "新建检验单" },
        { text: "检验记录" },
        { text: "不合格品处理" },
        { text: "测试委托单" },
      ],
      marketActions: [{ text: "礼品申请" }, { text: "客户接待" }],
    };
  },

  computed: {
    ...mapState("Home", ["userInfo", "todoCountNum", "copyCountNum"]),

    setPlacement() {
      return (index) => {
        let n = index + 1;
        if (n % 4 === 0) {
          return "left";
        } else if (n % 5 === 0 || n % 5 === 1) {
          return "right";
        } else {
          return "bottom";
        }
      };
    },
  },

  created() {
    if (dd.env.platform != "notInDingTalk") {
      dd.ready(function () {
        document.addEventListener("backbutton", function (e) {
          dd.biz.navigation.close();
        });
      });
    }
    this.queryUserInfo();
    this.queryTodoCount();
    this.queryCopyCount();
  },
  mounted() {
    this.getMyApplication();
  },
  methods: {
    ...mapMutations("Home", [
      "SET_USERINFO",
      "SET_POPUPVISIBLE",
      "SET_NAVBARTITLE",
      "SET_ACTIONLIST",
    ]),
    ...mapActions("Home", [
      "queryUserInfo",
      "queryTodoCount",
      "queryCopyCount",
    ]),

    // 打开设置页面弹出层
    onClickRight() {
      this.showPopup = true;
      // this.$router.push('/AppModel')
    },

    enterPage(type) {
      switch (type) {
        case "todo":
          this.SET_NAVBARTITLE("我的待办");
          setStore({
            name: "navBarTitle",
            content: "我的待办",
          });
          this.$router.push("/mobile/myTodoList");
          break;
        case "done":
          this.SET_NAVBARTITLE("我的已办");
          setStore({
            name: "navBarTitle",
            content: "我的已办",
          });
          this.$router.push("/mobile/myDoneList");
          break;
        case "myInstance":
          this.SET_NAVBARTITLE("我的发起");
          setStore({
            name: "navBarTitle",
            content: "我的发起",
          });
          this.$router.push("/mobile/myInstanceList");
          break;
        case "reply":
          this.SET_NAVBARTITLE("抄送回复");
          setStore({
            name: "navBarTitle",
            content: "抄送回复",
          });
          this.$router.push("/mobile/instCopyReplyList");
          break;
        default:
          break;
      }
    },

    select({ text }, index) {
      switch (text) {
        case "设备点检":
          this.$router.push("/biz/sbgl/check");
          break;
        case "点检记录":
          this.$router.push("/biz/sbgl/point");
          break;
        case "设备信息":
          this.$router.push("/biz/sbgl/message");
          break;
        default:
          break;
      }
    },
    qualitySelect({ text }, index) {
      switch (text) {
        case "检验单":
          this.$router.push("/quality/testList");
          break;
        case "检验记录":
          this.$router.push("/quality/testRecordList");
          break;
        case "不合格品处理":
          this.$router.push("/quality/unqualifiedList");
          break;
        case "测试委托单":
          this.$router.push("/quality/orderTicket_m");
          break;
        default:
          break;
      }
    },
    marketSelect({ text }, index) {
      switch (text) {
        case "礼品申请":
          this.$router.push("/mobile/crm/giftList");
          break;
        case "客户接待":
          this.$router.push("/mobile/crm/customerList");
          break;
        default:
          break;
      }
    },
    getDetail(action) {
      this.$router.push({
        path: action.path,
        query: {
          ...action.params,
        },
      });
    },
    getMyApplication() {
      getTopMenu("M").then((res) => {
        this.applicationData = res.data.data;
        res.data.data.forEach((ele) => {
          if (ele.children && ele.children.length > 0) {
            ele.actions = [];
            ele.children.forEach((el) => {
              let path = "";
              let obj = {};
              let pathArry = el.path.split("/");
              pathArry &&
                pathArry.forEach((url) => {
                  obj.params = url;
                });

              obj.path = el.path;

              if (el.path.indexOf("/modelAnalysis/modelList") != -1) {
                path = `/mobile/modelList`;
              } else if (el.path.indexOf("/modelAnalysis/modelForm") != -1) {
                path = `/mobile/modelForm`;
              } else if (el.path.indexOf("/formTranslate/index") != -1) {
                path = `/mobile/formTranslate`;
              } else {
                path = el.path;
              }
              ele.actions.push({
                text: el.name,
                path: path,
                params: obj,
                icon: el.source,
              });
            });
          }
        });
      });
    },

    handleCick({ actions, show, source }, index) {
      if (actions.length <= 3) {
        this.trigger = "click";
      } else {
        this.trigger = "";
        this.SET_ACTIONLIST(actions);
        this.$router.push("/AppModel");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";

.iconText {
  font-size: 12px;
  margin-top: 2px;
}

.wapper {
  height: 180px;
  overflow-y: scroll;
  .application {
    display: grid;
    grid-template-columns: repeat(auto-fill, 25%);
    .mode {
      text-align: center;
      padding: 10px 0;

      .text {
        font-size: 12px;
      }
    }
  }
}

.waves {
  position: relative;
  width: 100%;
  height: 12vh;
  min-height: 100px;
  max-height: 150px;
  position: fixed;
  left: 0;
  bottom: 0;
}

.parallax > use {
  animation: move-wave 15s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-wave {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

@media (max-width: 768px) {
  .waves {
    height: 65px;
    min-height: 65px;
  }
}
</style>
