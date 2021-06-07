<template>
    <div class="todoWrapper">
    <van-search
      v-model="search"
      placeholder="请输入搜索关键词"
      class="todoSearch"
      show-action
    >
      <template #left>
        <van-icon
          name="arrow-left"
          size="1rem"
          color="#0079fe"
          class="arrowIcon"
          @click="$router.push('/mobile/home')"
        />
      </template>
      <template #action>
          <div @click="handleSearch">搜索</div>
      </template>
    </van-search>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      class="pullrefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        ref="list"
      >
        <div
          v-for="item in list"
          :key="item.id"
          @click="getCurrentRow(item.id)"
          class="cellNode"
          :class="addClass(item.condition)"
        >
          <div class="left">
            <div>{{ `委托单号:${item.entrustCode}` }}</div>
            <div>{{ `合同号:${item.contractNum}` }}</div>
            <div>{{ `产品编号:${item.productCode}` }}</div>
          </div>
          <div class="right">
            <div v-if="item.condition==1">检测合格</div>
            <div v-if="item.condition==2">检测不合格</div>
            <div v-if="item.condition==3">未完成</div>
            <div>{{item.createTime}}</div>
            <div>{{ item.createUserName }}</div>
          </div>
        </div>
      </van-list>
      <div class="placeholder"></div>
    </van-pull-refresh>
  </div>
</template>
<script>
import { list } from "@/api/biz/guarantee/orderTicket";
import { filters } from "./orderTicket_m";
import { mapMutations } from "vuex";
import { setStore, getStore, removeStore } from "@/util/store";
export default {
    data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      current: 1,
      size: 10,
      search:'',
      total: null,
    };
  },
  created() {
    this.$nextTick(() => {
      this.$refs.list.check();
    });
  },
  methods: {
    async onLoad() {
      let extQueryList=[
            {
                field: "entrustCode",
                expressionList: [
                    {
                        operator: "EQ",
                        lowerValue: this.search,
                        upperValue: ""
                    }
                ]
           },
      ]
      const { data } = await list({extQueryList:extQueryList, current:this.current, size:this.size});

      if (this.refreshing) {
        this.list = [];
        this.current = 1;
        this.refreshing = false;
      }
      this.loading = false;
      this.list = this.list.concat(data.data.records);
      this.total = data.data.total;
      if (this.list.length < data.data.total) {
        this.current++;
      }
      if (this.list.length >= data.data.total) {
        this.finished = true;
      } else {
        this.finished = false;
      }
      this.list.forEach(item=>{
        if(item.flowStatus==2){
          if(item.isRight==1){
            this.$set(item,'condition',1)
          }else{
            this.$set(item,'condition',2)
          }
        }else{
          this.$set(item,'condition',3)
        }
      })
    },
    addClass(condition){
      switch (condition) {
        case 1:
          return 'qualified';
        case 2:
          return 'unqualified'
        case 3:
          return 'undone'
      }
    },
    handleSearch() {
      this.list = [];
      this.current = 1;
      this.onLoad();
    },
    onRefresh() {
      this.list = [];
      this.current = 1;
      this.finished = true;
      this.onLoad();
    },
    getCurrentRow(id){
      this.$router.push({path:"/equipment/orderTicket",query:{id:id}});
    },
  }
};
</script>
<style scoped lang='scss'>
@import "./orderTicketStyle/orderTicket_m";
</style>

