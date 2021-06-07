<template>
  <div>
    <van-nav-bar right-text="确认">
      <template #left>
        <div class="tabbar">
          <van-tabs
            v-model="active"
            line-width="80px"
            color="#0079fe"
            v-if="dateType === 'datetime'"
          >
            <van-tab :title="currentDate"></van-tab>
            <van-tab :title="currentTime"></van-tab>
          </van-tabs>
          <div v-if="dateType === 'date'" style="text-align: left">
            {{ currentDate }}
          </div>
          <div v-if="dateType === 'time'" style="text-align: left">
            {{ currentTime }}
          </div>
        </div>
      </template>
      <template #right>
        <span class="righttitle" @click="rightNow">此刻</span>
        <van-button size="small" type="info" @click="onClickRight" round
          >确认</van-button
        >
      </template>
    </van-nav-bar>

    <van-calendar
      :poppable="false"
      :show-confirm="false"
      color="#0079fe"
      @select="selectDate"
      v-if="active === 0"
      :min-date="minDate"
      :max-date="maxDate"
      :style="{ height: '420px' }"
      :show-subtitle="false"
      :row-height="45"
      ref="calendar"
    >
      <template #title>
        <div class="toolbar">
          <div class="lefticon">
            <van-icon
              class-prefix="iconfont"
              name="doubleleft"
              @click="calcDate('year', -1)"
            ></van-icon>
            <van-icon
              class-prefix="iconfont"
              name="left"
              @click="calcDate('month', -1)"
            ></van-icon>
          </div>
          <div class="titlecontent">{{ currentDate }}</div>
          <div class="righticon">
            <van-icon
              class-prefix="iconfont"
              name="right"
              @click="calcDate('month', 1)"
            ></van-icon>
            <van-icon
              class-prefix="iconfont"
              name="doubleright"
              @click="calcDate('year', 1)"
            ></van-icon>
          </div>
        </div>
      </template>
    </van-calendar>
    <van-datetime-picker
      v-if="active === 1"
      v-model="currentTime"
      type="time"
      :show-toolbar="false"
      @change="selectTime"
    />
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "calanderTimePicker",
  props: {
    defaultDate: {
      type: String | Date,
      default: () => new Date(dayjs()),
    },
    dateType: {
      type: String,
      default: "date",
    },
    menuKey: Number,
  },

  watch: {
    active: function (next, pre) {
      if (
        next === 0 &&
        this.active === 0 &&
        (this.dateType === "date" || this.dateType === "datetime")
      ) {
        this.$nextTick(() => {
          this.$refs.calendar.scrollToDate(new Date(this.currentDate));
          this.$refs.calendar.select(new Date(this.currentDate));
        });
      }
    },

    currentDate: function (next, pre) {
      let min = `${dayjs(this.currentDate)
        .add(-6, "month")
        .format("YYYY-MM")}-01`;
      let max = dayjs(
        `${dayjs(this.currentDate).add(7, "month").format("YYYY-MM")}-01`
      ).subtract(1, "days");
      this.minDate = new Date(min);
      this.maxDate = new Date(max);

      if (
        this.active === 0 &&
        (this.dateType === "date" || this.dateType === "datetime")
      ) {
        this.$nextTick(() => {
          this.$refs.calendar.scrollToDate(new Date(this.currentDate));
          this.$refs.calendar.select(new Date(this.currentDate));
        });
      }

      if (this.dateType === "time") {
        this.newDate = this.currentTime;
      } else if (this.dateType === "date") {
        this.newDate = this.currentDate;
      } else if (this.dateType === "datetime") {
        this.newDate = `${this.currentDate} ${this.currentTime}`;
      }
    },

    currentTime: function (next, pre) {
      if (this.dateType === "time") {
        this.newDate = this.currentTime;
      } else if (this.dateType === "date") {
        this.newDate = this.currentDate;
      } else if (this.dateType === "datetime") {
        this.newDate = `${this.currentDate} ${this.currentTime}`;
      }
    },

    menuKey: {
      handler(next, pre) {
        if (this.defaultDate) {
          if (this.dateType === "time") {
            this.currentTime = this.defaultDate;
          } else {
            this.currentTime = dayjs(this.defaultDate).format("HH:mm:ss");
          }
          this.currentDate = dayjs(this.defaultDate).format("YYYY-MM-DD");
        } else {
          this.currentTime = dayjs().format("HH:mm:ss");
          this.currentDate = dayjs().format("YYYY-MM-DD");
        }
      },

      immediate: true,
      deep: true,
    },

    dateType: {
      handler(next, pre) {
        if (this.dateType === "date") {
          this.active = 0;
        } else if (this.dateType === "datetime") {
          this.active = 0;
        } else if (this.dateType === "time") {
          this.active = 1;
        }
      },

      immediate: true,
      deep: true,
    },
  },

  data() {
    return {
      active: 0,
      minDate: new Date(),
      maxDate: new Date(),
      currentTime: "",
      currentDate: "",
      newDate: "",
    };
  },

  methods: {
    selectDate(currentDate) {
      this.currentDate = dayjs(currentDate).format("YYYY-MM-DD");
    },

    selectTime(picker) {
      this.currentTime = `${picker.getValues().join(":")}:00`;
    },

    onClickRight() {
      this.$emit("click", this.newDate);
    },

    rightNow() {
      this.currentDate = dayjs().format("YYYY-MM-DD");
      this.currentTime = dayjs().format("HH:mm:ss");
      if (this.active === 0) {

        console.log(this.$refs.calendar);
        this.$refs.calendar.scrollToDate(new Date(this.currentDate));
        this.$refs.calendar.select(new Date(this.currentDate));
      }
    },
    calcDate(type, num) {
      let newDate = dayjs(this.currentDate).add(num, type);
      this.$refs.calendar.scrollToDate(new Date(newDate));
      this.$refs.calendar.select(new Date(newDate));
    },

    clickRight() {
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.popup {
  width: 100%;
  height: 65%;
  background-color: #fff;

  .tabbar {
    width: 185px;
  }
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
}

.righttitle {
  color: #0079fe;
}

.righttitle:nth-child(1) {
  margin-right: 10px;
}

/deep/.van-button--round {
  border-radius: 4px;
}
</style>