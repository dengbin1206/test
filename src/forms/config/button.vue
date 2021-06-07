<template>
  <div>
    <el-form-item label="样式">
      <el-select v-model="data.btnType" placeholder="选择按钮样式">
        <el-option
          v-for="(item, index) in btnTypeList"
          :label="item.name"
          :key="index.key"
          :value="item.key"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="功能">
      <el-select v-model="data.assFunc" placeholder="选择功能">
        <el-option
              v-for="(item, index) in funcList"
              :label="item.name"
              :key="index.key"
              :value="item.key"
            >
            </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="跳转选项" v-show='data.showForm'>
      <!-- <el-input  placeholder="变量/表达式"></el-input> -->
      <el-radio-group v-model="data.assignType" style="margin-bottom: 15px">
        <!--<el-radio-button label="ass_func">功能</el-radio-button>-->
        <el-radio-button label="ass_form">表单</el-radio-button>
        <el-radio-button label="ass_model">模型</el-radio-button>
        <el-radio-button label="ass_custom">自定义</el-radio-button>
      </el-radio-group>
      <!--<keep-alive>
        <el-form-item v-if="data.assignType == 'ass_func'">
          <el-select
            v-model="data.assRuleCode"
            placeholder="选择规则"
            clearable
          >
            <el-option
              v-for="(item, index) in funcList"
              :label="item.name"
              :key="index.key"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </keep-alive>-->
      <keep-alive>
        <el-form-item v-if="data.assignType == 'ass_form'">
          <el-select
            v-model="data.assRuleCode"
            placeholder="选择表单"
            filterable
            remote
            :remote-method="searchForm"
            clearable
          >
            <el-option
              v-for="(item, index) in data.formList"
              :label="item.formName"
              :value="item.id"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </keep-alive>
      <keep-alive>
        <el-form-item v-if="data.assignType == 'ass_model'">
          <el-select
            @change="changeValue()"
            placeholder="选择模型"
            v-model="data.method"
            clearable
            style="margin-top: 10px"
          >
            <el-option
              v-for="(item, index) in ['GET', 'POST']"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
          <!-- <span v-if="data.method == 'POST'">
          请求参数
         <avue-dynamic v-model="data.dicQueryConfig"
                      :children="option"></avue-dynamic>
        </span> -->
        </el-form-item>
      </keep-alive>
      <keep-alive>
        <el-form-item v-if="data.assignType == 'ass_custom'">
          <el-input style="margin-right: 5px;"
                        size="mini"
                        v-model="data.url"
                        placeholder="label">
          </el-input>
        </el-form-item>
      </keep-alive>
    </el-form-item>
    <el-form-item label="工作流" v-show='showFlow'>
      <el-select v-model="data.flowId" placeholder="选择工作流">
        <el-option
              v-for="(item, index) in data.flowList"
              :label="item.label"
              :key="index.value"
              :value="item.value"
            >
            </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="绑定表格" v-show='data.showCrud'>
      <el-select v-model="data.crud" placeholder="选择表格">
        <el-option
              v-for="(item, index) in data.crudList"
              :label="item.title"
              :key="index"
              :value="item"
            >
            </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="显示位置">
      <el-select v-model="data.place" placeholder="选择位置">
        <el-option
              v-for="(item, index) in placeList"
              :label="item.name"
              :key="index.key"
              :value="item.key"
            >
            </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="按钮内容">
      <el-input v-model="data.title" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="图标">
      <avue-input-icon
        v-model="data.icon"
        :icon-list="iconList"
        placeholder="图标"
      ></avue-input-icon>
    </el-form-item>
  </div>
</template>
<script>
import { findFormBySearch, findTableNameBySearch ,findFlowList} from "@/api/tool/form";
export default {
  name: "config-button",
  props: ["data"],
  data() {
    return {
      showFlow: false,
      flowList:{},
      showCrud:false,
      crudList:{},
      crud:null,
      crudId:null,
      modelId:null,
      showForm: false,
      btnType: "primary",
      btnTypeList: [
        {
          key: "primary",
          name: "蓝底白字",
        },
        {
          key: "success",
          name: "绿底白字",
        },
        {
          key: "info",
          name: "灰底白字",
        },
        {
          key: "warning",
          name: "黄底白字",
        },
        {
          key: "danger",
          name: "红底白字",
        },
      ],
      funcList: [
        {
          key: "todo",
          name: "跳转",
        },
        {
          key: "save",
          name: "保存",
        },
        {
          key: "submit",
          name: "保存并提交",
        },
        {
          key: "search",
          name: "搜索",
        },
         {
          key: "reset",
          name: "重置",
        },
         {
          key: "cancel",
          name: "取消",
        },
      ],
      placeList: [
        {
          key: "default",
          name: "默认",
        },
        {
          key: "left-top",
          name: "左上角",
        },
        {
          key: "right-down",
          name: "右下角",
        },
        {
          key: "down-mid",
          name: "底部居中",
        }
      ],
      formList: [],
      iconList: [
        {
          label: "element-ui",
          list: [
            "el-icon-platform-eleme",
            "el-icon-eleme",
            "el-icon-delete-solid",
            "el-icon-delete",
            "el-icon-s-tools",
            "el-icon-setting",
            "el-icon-user-solid",
            "el-icon-user",
            "el-icon-phone",
            "el-icon-phone-outline",
            "el-icon-more",
            "el-icon-more-outline",
            "el-icon-star-on",
            "el-icon-star-off",
            "el-icon-s-goods",
            "el-icon-goods",
            "el-icon-warning",
            "el-icon-warning-outline",
            "el-icon-question",
            "el-icon-info",
            "el-icon-remove",
            "el-icon-circle-plus",
            "el-icon-success",
            "el-icon-error",
            "el-icon-zoom-in",
            "el-icon-zoom-out",
            "el-icon-remove-outline",
            "el-icon-circle-plus-outline",
            "el-icon-circle-check",
            "el-icon-circle-close",
            "el-icon-s-help",
            "el-icon-help",
            "el-icon-minus",
            "el-icon-plus",
            "el-icon-check",
            "el-icon-close",
            "el-icon-picture",
            "el-icon-picture-outline",
            "el-icon-picture-outline-round",
            "el-icon-upload",
            "el-icon-upload2",
            "el-icon-download",
            "el-icon-camera-solid",
            "el-icon-camera",
            "el-icon-video-camera-solid",
            "el-icon-video-camera",
            "el-icon-message-solid",
            "el-icon-bell",
            "el-icon-s-cooperation",
            "el-icon-s-order",
            "el-icon-s-platform",
            "el-icon-s-fold",
            "el-icon-s-unfold",
            "el-icon-s-operation",
            "el-icon-s-promotion",
            "el-icon-s-home",
            "el-icon-s-release",
            "el-icon-s-ticket",
            "el-icon-s-management",
            "el-icon-s-open",
            "el-icon-s-shop",
            "el-icon-s-marketing",
            "el-icon-s-flag",
            "el-icon-s-comment",
            "el-icon-s-finance",
            "el-icon-s-claim",
            "el-icon-s-custom",
            "el-icon-s-opportunity",
            "el-icon-s-data",
            "el-icon-s-check",
            "el-icon-s-grid",
            "el-icon-menu",
            "el-icon-share",
            "el-icon-d-caret",
            "el-icon-caret-left",
            "el-icon-caret-right",
            "el-icon-caret-bottom",
            "el-icon-caret-top",
            "el-icon-bottom-left",
            "el-icon-bottom-right",
            "el-icon-back",
            "el-icon-right",
            "el-icon-bottom",
            "el-icon-top",
            "el-icon-top-left",
            "el-icon-top-right",
            "el-icon-arrow-left",
            "el-icon-arrow-right",
            "el-icon-arrow-down",
            "el-icon-arrow-up",
            "el-icon-d-arrow-left",
            "el-icon-d-arrow-right",
            "el-icon-video-pause",
            "el-icon-video-play",
            "el-icon-refresh",
            "el-icon-refresh-right",
            "el-icon-refresh-left",
            "el-icon-finished",
            "el-icon-sort",
            "el-icon-sort-up",
            "el-icon-sort-down",
            "el-icon-rank",
            "el-icon-loading",
            "el-icon-view",
            "el-icon-c-scale-to-original",
            "el-icon-date",
            "el-icon-edit",
            "el-icon-edit-outline",
            "el-icon-folder",
            "el-icon-folder-opened",
            "el-icon-folder-add",
            "el-icon-folder-remove",
            "el-icon-folder-delete",
            "el-icon-folder-checked",
            "el-icon-tickets",
            "el-icon-document-remove",
            "el-icon-document-delete",
            "el-icon-document-copy",
            "el-icon-document-checked",
            "el-icon-document",
            "el-icon-document-add",
            "el-icon-printer",
            "el-icon-paperclip",
            "el-icon-takeaway-box",
            "el-icon-search",
            "el-icon-monitor",
            "el-icon-attract",
            "el-icon-mobile",
            "el-icon-scissors",
            "el-icon-umbrella",
            "el-icon-headset",
            "el-icon-brush",
            "el-icon-mouse",
            "el-icon-coordinate",
            "el-icon-magic-stick",
            "el-icon-reading",
            "el-icon-data-line",
            "el-icon-data-board",
            "el-icon-pie-chart",
            "el-icon-data-analysis",
            "el-icon-collection-tag",
            "el-icon-film",
            "el-icon-suitcase",
            "el-icon-suitcase-1",
            "el-icon-receiving",
            "el-icon-collection",
            "el-icon-files",
            "el-icon-notebook-1",
            "el-icon-notebook-2",
            "el-icon-toilet-paper",
            "el-icon-office-building",
            "el-icon-school",
            "el-icon-table-lamp",
            "el-icon-house",
            "el-icon-no-smoking",
            "el-icon-smoking",
            "el-icon-shopping-cart-full",
            "el-icon-shopping-cart-1",
            "el-icon-shopping-cart-2",
            "el-icon-shopping-bag-1",
            "el-icon-shopping-bag-2",
            "el-icon-sold-out",
            "el-icon-sell",
            "el-icon-present",
            "el-icon-box",
            "el-icon-bank-card",
            "el-icon-money",
            "el-icon-coin",
            "el-icon-wallet",
            "el-icon-discount",
            "el-icon-price-tag",
            "el-icon-news",
            "el-icon-guide",
            "el-icon-male",
            "el-icon-female",
            "el-icon-thumb",
            "el-icon-cpu",
            "el-icon-link",
            "el-icon-connection",
            "el-icon-open",
            "el-icon-turn-off",
            "el-icon-set-up",
            "el-icon-chat-round",
            "el-icon-chat-line-round",
            "el-icon-chat-square",
            "el-icon-chat-dot-round",
            "el-icon-chat-dot-square",
            "el-icon-chat-line-square",
            "el-icon-message",
            "el-icon-postcard",
            "el-icon-position",
            "el-icon-turn-off-microphone",
            "el-icon-microphone",
            "el-icon-close-notification",
            "el-icon-bangzhu",
            "el-icon-time",
            "el-icon-odometer",
            "el-icon-crop",
            "el-icon-aim",
            "el-icon-switch-button",
            "el-icon-full-screen",
            "el-icon-copy-document",
            "el-icon-mic",
            "el-icon-stopwatch",
            "el-icon-medal-1",
            "el-icon-medal",
            "el-icon-trophy",
            "el-icon-trophy-1",
            "el-icon-first-aid-kit",
            "el-icon-discover",
            "el-icon-place",
            "el-icon-location",
            "el-icon-location-outline",
            "el-icon-location-information",
            "el-icon-add-location",
            "el-icon-delete-location",
            "el-icon-map-location",
            "el-icon-alarm-clock",
            "el-icon-timer",
            "el-icon-watch-1",
            "el-icon-watch",
            "el-icon-lock",
            "el-icon-unlock",
            "el-icon-key",
            "el-icon-service",
            "el-icon-mobile-phone",
            "el-icon-bicycle",
            "el-icon-truck",
            "el-icon-ship",
            "el-icon-basketball",
            "el-icon-football",
            "el-icon-soccer",
            "el-icon-baseball",
            "el-icon-wind-power",
            "el-icon-light-rain",
            "el-icon-lightning",
            "el-icon-heavy-rain",
            "el-icon-sunrise",
            "el-icon-sunrise-1",
            "el-icon-sunset",
            "el-icon-sunny",
            "el-icon-cloudy",
            "el-icon-partly-cloudy",
            "el-icon-cloudy-and-sunny",
            "el-icon-moon",
            "el-icon-moon-night",
            "el-icon-dish",
            "el-icon-dish-1",
            "el-icon-food",
            "el-icon-chicken",
            "el-icon-fork-spoon",
            "el-icon-knife-fork",
            "el-icon-burger",
            "el-icon-tableware",
            "el-icon-sugar",
            "el-icon-dessert",
            "el-icon-ice-cream",
            "el-icon-hot-water",
            "el-icon-water-cup",
            "el-icon-coffee-cup",
            "el-icon-cold-drink",
            "el-icon-goblet",
            "el-icon-goblet-full",
            "el-icon-goblet-square",
            "el-icon-goblet-square-full",
            "el-icon-refrigerator",
            "el-icon-grape",
            "el-icon-watermelon",
            "el-icon-cherry",
            "el-icon-apple",
            "el-icon-pear",
            "el-icon-orange",
            "el-icon-coffee",
            "el-icon-ice-tea",
            "el-icon-ice-drink",
            "el-icon-milk-tea",
            "el-icon-potato-strips",
            "el-icon-lollipop",
            "el-icon-ice-cream-square",
            "el-icon-ice-cream-round"
          ],
        },
      ],
      assignType: "",
      assRuleCode: "",
    };
  },
  created(){

  },
  mounted() {
    window.$bus.$on('crduSetModel', (model) => {
      console.log('button-crudList:'+JSON.stringify(model))
      if(model==null){

      }else{

      }
      //this.$set(this.data,'crudList',crudList)
    })
    window.$bus.$on('setCrudList', (crudList) => {
      console.log('button-crudList:'+JSON.stringify(crudList))
      this.$set(this.data,'crudList',crudList)
    })
  },
  methods: {
    //模型搜索
    searchForm(query) {
      console.log('searchForm-query=>'+query)
      if (query !== "") {
        this.loading = true;
        findFormBySearch(query).then((res) => {
          console.log('res=>'+res)
          this.$set(this.data, "formList", res.data.data);
        });
      } else {
        this.data.formList = [];
      }
    },
    selectForm(id) {
       console.log('id=>'+id)
    },
  },
  watch: {
    'data.assFunc': function (val) {
      console.log('assFunc=>'+val)
      if (val) {
        this.showForm = false;
        if(val=='submit'){
          this.data.showFlow = true;
          this.data.showCrud = false;
          let query=''
          findFlowList(query).then((res) => {
            console.log('res=>'+res)
            this.$set(this.data, "flowList", res.data.data);
          });
        }else if(val=='todo'){
          this.data.showFlow = false;
          this.data.showForm = true;
          this.data.showCrud = true;
        }else if(val=='search'){
          console.log('bit-search=>:' +JSON.stringify(this.data))
          this.data.showFlow = false;
          this.data.showForm = false;
          this.data.showCrud = true;
          //window.$bus.$emit('showCrud',this.data)
        }else if(val=='save'){
          console.log('bit-save=>:' +JSON.stringify(this.data))
          this.data.showFlow = false;
          this.data.showForm = false;
          this.data.showCrud = false;
          //this.$set(this.data, "formId", res.data.data);
        }
      }

    },
    'data.assignType': function (val) {
      if (val) {
        if(val=='ass_form'){
          this.searchForm();
        }
      }
    },
    'data.crud': function (val) {
      if (val) {
        console.log('data.crud=>:' +JSON.stringify(val))
        this.$set(this.data, "crud", val);
        this.$set(this.data, "crudId", val.prop);
        this.$set(this.data, "modelId", val.model.id);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
