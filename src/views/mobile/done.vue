<template>
    <el-container style="background:#eee;width:100%;height:100%">
        <el-header>
             <el-row style="width:100%">
                    <el-col span="2" style="text-align:center;line-height:60px"><i class="el-icon-arrow-left" style="font-size:20px" @click="rollback"></i></el-col>
                    <el-col span="17" style="text-align:center;line-height:60px">
                        <el-input placeholder="请输入关键字搜索" v-model="inp" class="input-with-select" size="small" style="width:100%">
                            <el-button slot="append" icon="el-icon-search" @click="searchs"></el-button>
                        </el-input>
                    </el-col>
                    <el-col span="5" style="text-align:center;line-height:60px">我的已办</el-col>
                </el-row>
        </el-header>
        <el-header style="background:#fff;border-bottom:1px solid #ccc;height:40px;line-height:40px;padding:0;">
            <div style="height:100%;border-bottom:1px solid #ccc;padding:0px;text-align:center">
              <el-button-group style="width:100%;padding:0" class="sx_done_btns">
                <el-button size="small" style="width:25%;text-align:center;height:100%;font-size:13px;" class="activeBtn btn0" @click="all(0)">全部</el-button>
                <el-button size="small" style="width:25%;text-align:center;height:100%;font-size:13px;" class="btn1"  @click="all(1)">处理中</el-button>
                <el-button size="small" style="width:25%;text-align:center;height:100%;font-size:13px;" class="btn2"  @click="all(2)">已完成</el-button>
                <el-button size="small" style="width:25%;text-align:center;height:100%;font-size:13px;" class="btn3"  @click="all(3)">已作废</el-button>
              </el-button-group>
            </div>
        </el-header>
        <el-main>
            <ul class="list" v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-distance='10' infinite-scroll-immediate='false' style="width:100%;overflow:visible">
                <el-row style="width:100%;border-bottom:1px solid #ccc;background:#fff;" v-for="(item,index) in dataList" :key='index' class="list-item" v-on:click.native="detail(item,2)">
                    <el-col :span="15">
                        <p style="margin:6px;font-size:14px;white-space:nowrap;">事务编码:{{item.instId}}</p>
                        <p style="margin:6px;font-size:14px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden; white-space:nowrap;">{{item.title}}</p>
                    </el-col>
                    <el-col :span="9">
                        <span style='float:right;line-height:60px;margin-right:10px'><i class="el-icon-arrow-right" style="font-size:20px"></i></span>
                        <span style="float:right;margin-right:10px;padding-top:10px;font-size:12px;">{{item.createTime}}</span>
                    </el-col>
                </el-row>
            </ul>
            <p v-if="loading" style="text-align:center">加载中...</p>
            <p v-if="noMore" style="text-align:center">没有更多了</p>
            <p v-if="errors" style="text-align:center">加载失败</p>
        </el-main>
    </el-container>
</template>
<script>
import { myDoneList } from "@/api/mobile";
export default {
  data() {
    return {
      inp: "",
      dataList: [],
      loading: false,
      errors: false,
      current: 1,
      size: 15,
      total: 0,
      arr: [],
      status: 0,
      old: 0
    };
  },
  computed: {
    noMore() {
      this.loading = false;
      return this.dataList.length >= this.total;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    searchs() {
      this.search(this.inp, this.old, 1, this.size);
    },
    search(a, b, c, d) {
      this.arr = [];
      this.current = c;
      myDoneList(a, b, c, d).then(res => {
        if (res.data.code == "200") {
          this.arr.push(this.current);
          this.dataList = res.data.data.records;
          this.total = res.data.data.total;
          this.dataList.forEach(item => {
            if (item.createTime != "") {
              item.createTime = item.createTime.slice(0, 10);
            }
          });
          if (this.dataList.length >= this.total) {
            return this.noMore;
          }
        } else {
          this.dataList = [];
          this.errors = true;
        }
      });
    },
    load() {
      this.current = Math.ceil(this.dataList.length / this.size) + 1;
      if (this.arr.indexOf(this.current) < 0) {
        this.arr.push(this.current);
        this.loading = true;
        setTimeout(() => {
          myDoneList(this.inp, this.old, this.current, this.size).then(res => {
            if (res.data.code == "200") {
              var list = res.data.data.records;
              this.total = res.data.data.total;
              list.forEach(item => {
                if (item.createTime != "") {
                  item.createTime = item.createTime.slice(0, 10);
                }
                this.dataList.push(item);
              });
              if (this.dataList.length >= this.total) {
                return this.noMore;
              }
            } else {
              this.loading = true;
              let old = this.arr.indexOf(this.current);
              this.arr = this.arr.splice(old, 1);
              return (this.loading = true);
            }
          });
          this.loading = false;
        }, 1000);
      } else {
        return false;
      }
    },
    all(old) {
      document.querySelector(".activeBtn").classList.remove("activeBtn");
      let btn = ".btn" + old;
      document.querySelector(btn).classList.add("activeBtn");
      this.status = old;
      this.current = 1;
      this.size = 15;
      this.arr = [];
      this.search(this.inp, old, this.current, this.size);
    },
    rollback() {
      this.$router.push("/mobile/index");
    },
    detail(item, type) {
      this.$router.push({
        path: "/mobile/todoDet",
        query: {
          proInstId: item.proInstId,
          taskId: item.taskId,
          type: type,
          status: item.status
        }
      });
    }
  },
  created() {
    this.search(this.inp, this.old, 1, this.size);
  }
};
</script>
<style scoped lang='scss'>
html,
body {
  font-size: 14px;
  list-style: none;
}

.sx_done_btns {
  .btn0,
  .btn1,
  .btn2,
  .btn3 {
    color: #000;
  }
  .activeBtn {
    background: #409eff !important;
    color: #fff !important;
  }
}
</style>

