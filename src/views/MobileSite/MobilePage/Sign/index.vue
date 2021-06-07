<template>
  <van-popup
    v-model="show"
    position="bottom"
    :style="{ height: '40%' }"
    get-container="body"
  >
    <div class="main">
      <div class="sign-card">
        <div class="buttons" @click="getMyLocation">
          <span class="title">打卡</span>
          <span class="times">{{ time }}</span>
        </div>
        <div class="address" v-if="currentAddress">
          <div class="locationName">{{ locationName }}</div>
          <div class="currentAddress">{{ currentAddress }}</div>
          <div>{{ dateTime }}</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { signature } from "@/api/mobile";
import { getUserInfo } from "@/api/system/user";
import * as dd from "dingtalk-jsapi";
import { Toast } from "vant";
import { setStore, getStore } from "@/util/store";
import dayjs from "dayjs";

export default {
  name: "Sign",
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    show: function (val) {
      this.$emit("update:visible", val);
    },
    visible: function (val) {
      this.show = val;
    },
  },
  data() {
    return {
      currentAddress: "",
      locationName: "",
      time: "",
      dateTime: "",
      show: this.visible,
      isDingTalk: false,
    };
  },

  created() {
    this.getTimes();
    this.isDingTalk = dd.env.platform === "notInDingTalk" ? true : false;
    this.dingConfig();
  },

  methods: {
    getMyLocation() {
      if (this.isDingTalk) {
        Toast("非钉钉环境");
      } else {
        dd.device.geolocation.get({
          targetAccuracy: 200,
          coordinate: 1,
          withReGeocode: false,
          useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
          onSuccess: (result) => {
            dd.biz.map.search({
              latitude: result.latitude, // 纬度
              longitude: result.longitude, // 经度
              scope: 500, // 限制搜索POI的范围；设备位置为中心，scope为搜索半径
              onSuccess: ({ province, city, adName, snippet, title }) => {
                this.currentAddress = `${province}${city}${adName}${snippet}`;
                this.locationName = title;
                this.dateTime = this.dayjs().format("YYYY-MM-DD HH:mm:ss");

                this.$emit("getLocation", {
                  address: `${this.locationName} ${this.currentAddress}`,
                  date: this.dateTime,
                });

                // this.show = false;
                // this.currentAddress = this.locationName = this.dateTime = "";
              },
              onFail: (error) => {
                alert(JSON.stringify(error));
              },
            });
          },

          onFail: (error) => {
            alert(JSON.stringify(error));
          },
        });

        dd.error((error) => {
          alert(JSON.stringify(error));
        });
      }
    },

    dingConfig() {
      signature({
        url: location.href.split("#")[0],
      }).then((res) => {
        let { nonceStr, timeStamp, sign, agentId, corpId } = res.data.data;
        dd.config({
          agentId: agentId, // 必填，微应用ID
          corpId: corpId, //必填，企业ID
          timeStamp: timeStamp, // 必填，生成签名的时间戳
          signature: sign, // 必填，签名
          nonceStr: nonceStr,
          type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
          jsApiList: ["device.geolocation.get", "biz.map.search"], // 必填，需要使用的jsapi列表，注意：不要带dd。
        });
      });
    },

    onClickLeft() {
      this.$router.back();
    },

    getTimes() {
      setInterval(() => {
        this.time = this.dayjs().format("HH:mm:ss");
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .sign-card {
    margin: 10px auto;
    height: 95%;
    border-radius: 8px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .address {
      margin-top: 15px;
      font-size: 13px;
      padding: 0 10px;
      i {
        color: #07c160;
        display: inline-block;
        vertical-align: middle;
      }
      width: 100%;
      text-align: center;

      .locationName {
        font-weight: bold;
        font-size: 15px;
        margin-bottom: 10px;
      }

      .currentAddress {
        margin-bottom: 10px;
      }
    }

    .buttons {
      width: 120px;
      height: 120px;
      background: #0079fe;
      border-radius: 50%;
      text-align: center;
      display: flex;
      color: #fff;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .title {
        font-size: 20px;
      }

      .times {
        margin-top: 10px;
      }
    }
  }
}
</style>