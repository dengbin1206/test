<template>
  <div class="top-menu">
    <el-menu :default-active="activeIndex"
             mode="horizontal"
             text-color="#333">
      <el-menu-item index='0' @click.native="openHome()" :key='99999999'>
        <template slot="title">
          <i :class="itemHome.source"></i>
          <span>{{generateTitle(itemHome)}}</span>
        </template>
      </el-menu-item>
      <template v-for="(item,index) in items">
        <el-menu-item :index="item.id+''" @click.native="openMenu(item)" :key="index">
          <template slot="title">
            <i :class="item.source" style="padding-right: 5px;"></i>
            <span>{{generateTitle(item)}}</span>
          </template>
        </el-menu-item>
      </template>
      <template>
        <el-submenu index="2">
          <template slot="title">更多菜单</template>
            <template v-for="(item,index) in menuItems">
              <el-menu-item :index="item.id+''" @click.native="openMenu(item)" :key="index">
                <i :class="item.source" style="padding-right: 5px;"></i>
                <span class="sx_span_text">{{generateTitle(item)}}</span>
              </el-menu-item>
            </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "top-menu",
    data() {
      return {
        itemHome: {
          name: '首页',
          source: 'el-icon-menu',
        },
        activeIndex: '0',
        items: [],
        menuItems:[],
      };
    },
    inject: ["index"],
    created() {
      this.getMenu();

    },
    computed: {
      ...mapGetters(["tagCurrent", "menu"])
    },
    methods: {
      openHome() {
        // this.index.openMenu(items[0]);
        // this.$router.push({
        //   path: this.$router.$avueRouter.getPath({name: this.itemHome.name, src: ''}, {})
        // });
        this.$router.push({
          path: '/wel/index'
        })
      },
      openMenu(item) {
        this.index.openMenu(item)
      },
      getMenu() {
        this.$store.dispatch("GetTopMenu").then(res => {
          this.items = res;
          this.activeIndex=this.items[0].id+''
          this.$nextTick(() => {
                    var rightWidth=document.querySelector('.top-bar__right').offsetWidth
                    document.querySelector('.top-bar__title').style.marginRight=rightWidth+'px'
                    document.querySelector('.el-submenu').style='display:none'
                    var tittle=document.querySelector('.top-bar__title').offsetWidth
                    var menuWidth=tittle * 0.53
                    var menuBox=document.querySelector('.sx_top_bar').offsetWidth
                    if(menuBox>menuWidth){
                      document.querySelector('.el-submenu').style='display:block'
                      var lis=document.querySelectorAll('.sx_top_bar .el-menu-item')
                      var sum=0
                      var old=0
                      for(var i=0;i<lis.length;i++){
                          sum+=lis[i].offsetWidth;
                          if(sum>menuWidth){
                            old=i-1
                            const arData=res.splice(0,old)
                            this.items = arData;
                            this.menuItems=res
                            return
                          }
                      }
                    }
                });
        });
      },
      generateTitle(item) {
        return this.$router.$avueRouter.generateTitle(
          item.name,
          (item.meta || {}).i18n
        );
      },
    }
  };
</script>
<style lang='scss' scope>
.el-menu--horizontal ul li{
    i{
        color:#000 !important;
    }
    span{
        color:#000 !important;
    }
}
.el-menu--horizontal ul .is-active{
    background: #000 !important;
    i{
        color:#fff !important;
    }
    span{
        color:#fff !important;
    }
}
.el-menu--horizontal ul{
    padding: 0;
}
</style>
