<template>
    <el-container style="background:#eee;width:100%;height:100%">
        <el-header>
                <el-row style="width:100%">
                    <el-col span="2" style="text-align:center;line-height:60px"><i class="el-icon-arrow-left" style="font-size:20px" @click="rollback"></i></el-col>
                    <el-col span="17" style="text-align:center;line-height:60px">
                        <el-input placeholder="请输入关键字搜索" v-model="inp" class="input-with-select" size="small" style="width:100%">
                            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                        </el-input>
                    </el-col>
                    <el-col span="5" style="text-align:center;line-height:60px">我的待办</el-col>
                </el-row>
        </el-header>
        <el-main>
            <ul class="list" v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-distance='10' infinite-scroll-immediate='false' style="width:100%;overflow:visible">
                <el-row style="width:100%;border-bottom:1px solid #ccc;background:#fff;" v-for="(item,index) in dataList" :key='index' class="list-item" v-on:click.native="detail(item,1)">
                    <el-col :span="15">
                        <p style="margin:6px;font-size:14px;white-space:nowrap;">事务编码:{{item.instId}}</p>
                        <p style="margin:6px;font-size:14px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden; white-space:nowrap;">{{item.title}}</p>
                    </el-col>
                    <el-col :span="9">
                        <span style='float:right;line-height:60px;margin-right:10px'><i class="el-icon-arrow-right" style="font-size:20px"></i></span>
                        <span style="float:right;margin-right:10px;padding-top:10px;font-size:12px;">{{item.taskCreateTime}}</span>
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
import { myToDoList } from "@/api/mobile";
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
      arr: []
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
    search() {
      this.arr=[]
      this.current=1
      myToDoList(this.inp, this.current, this.size).then(res => {
        if (res.data.code == "200") {
          this.arr.push(this.current);
          this.dataList = res.data.data.records;
          this.total = res.data.data.total;
          this.dataList.forEach(item => {
            if (item.taskCreateTime != "") {
              item.taskCreateTime = item.taskCreateTime.slice(0, 10);
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
          myToDoList(this.inp, this.current, this.size).then(res => {
            if (res.data.code == "200") {
              var list = res.data.data.records;
              this.total = res.data.data.total;
              list.forEach(item => {
                if (item.taskCreateTime != "") {
                  item.taskCreateTime = item.taskCreateTime.slice(0, 10);
                }
                this.dataList.push(item);
              });
              if (this.dataList.length >= this.total) {
                return this.noMore;
              }
            } else {
              this.loading=true
              let old = this.arr.indexOf(this.current);
              this.arr = this.arr.splice(old, 1);
              return this.loading=true
            }
          });
          this.loading = false;
        }, 1000);
      } else {
        return false;
      }
    },
    rollback(){
        this.$router.push('/mobile/index')
    },
    detail(item){
        this.$router.push({path:'/mobile/detail',query:{proInstId:item.proInstId,taskId:item.taskId}})
    }
  },
  created() {
    this.search();
  }
};
</script>
<style scoped  lang="scss">
html,
body {
  font-size: 14px;
  list-style: none;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.el-header, .el-footer {
    text-align: center;
    line-height: 60px;
    padding: 0;
  }
</style>
