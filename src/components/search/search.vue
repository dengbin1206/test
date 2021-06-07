<template>
  <basic-container>
    <el-form
      ref="form"
      @submit.native.prevent
      :model="form"
      label-width="120px"
      size="small"
      class="sx_search-form"
    >
      <el-row v-for="(k,i) in option.rows" :key="i" v-show=" i > 0 ? isShow : true ">
        <el-col v-for="(k,index) in option.rows[i]" :key="index" :span="11">
          <!-- queryType 为3 时 代表组合查询 -->
         <query-input
            v-if="k.type=='input' && k.queryType =='3'"
            v-model="form[k.prop]"
            :option="k"
            @childGetValue="childGetValueInput"
            @handleQuery="handleQuery"
            ref="queryInput"
          ></query-input>
          <query-number
            v-if="k.type=='number' && k.queryType =='3'"
            v-model="form[k.prop]"
            :option="k"
            @childGetValue="childGetValueInput"
            @handleQuery="handleQuery"
            ref="queryInput"
          ></query-number>
           <query-select
            v-if="(k.type =='select' && k.queryType== 3) || (k.type =='multipleSelect' && k.queryType== 3)"
            v-model="form[k.prop]"
            :option="k"
            @childGetValue="childGetValueSelect"
            @handleQuery="handleQuery"
            ref="querySelect"
          ></query-select>
          <query-date
            v-if="k.type =='date' && k.queryType ==3"
            v-model="form[k.prop]"
            :option="k"
            @childGetValue="childGetValueSelect"
            @handleQuery="handleQuery"
            ref="queryDate"
          ></query-date>
          <query-datetime
            v-if="k.type =='datetime' && k.queryType ==3"
            v-model="form[k.prop]"
            :option="k"
            @childGetValue="childGetValueSelect"
            @handleQuery="handleQuery"
            ref="queryDatetime"
          ></query-datetime>
          <query-time
            v-if="k.type =='time' && k.queryType ==3"
            v-model="form[k.prop]"
            :option="k"
            @childGetValue="childGetValueSelect"
            @handleQuery="handleQuery"
            ref="queryTime"
          ></query-time>
          <el-form-item :label="k.label" :prop="k.prop" v-if="k.queryType!=3">
            <el-input
              v-if="k.type=='input' && k.queryType =='1'"
              clearable
              v-model="form[k.prop]"
              @keyup.enter.native="handleQuery"
              :placeholder="k.placeholder || `请填写${k.label}`"
            ></el-input>
            <el-input
              type="number"
              @mousewheel.native.prevent
              v-if="k.type=='number' && k.queryType =='1'"
              v-model.number="form[k.prop]"
              @keyup.enter.native="handleQuery"
              :placeholder="k.placeholder || `请填写${k.label}`"
              controls-position="right"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              style="width:100%;"
              clearable
            ></el-input>
            <el-select
              v-if="(k.type=='select' && k.queryType =='1') || (k.type =='multipleSelect' && k.queryType =='1')"
              v-model="form[k.prop]"
              clearable
              @keyup.enter.native="handleQuery"
              :multiple="k.type =='multipleSelect' ? true : false"
              :placeholder="k.placeholder || `请选择${k.label}`"
              style="width:100%"
            >
              <el-option
                v-for="item in k.list"
                :key="item.dictKey ? item.dictKey : item.value"
                :label="item.dictValue? item.dictValue : item.label"
                :value="item.dictKey ? item.dictKey : item.value"
              ></el-option>
            </el-select>
            <avue-input-tree
              multiple
              v-if="k.type == 'tree'"
              v-model="form[k.prop]"
              :placeholder="k.placeholder || `请选择${k.label}`"
              type="tree"
              :dic="k.dic"
              size="small"
              @keyup.enter.native="handleQuery"
              style="width:100%"
            ></avue-input-tree>
            <el-date-picker
              v-if="k.type=='date' && k.queryType =='1'"
              style="width:100%;"
              v-model="form[k.prop]"
              @keyup.enter.native="handleQuery"
              :type="k.dateType||'date'"
              :format="k.format||'yyyy-MM-dd'"
              :value-format="k.valueFormat||'yyyy-MM-dd'"
              :placeholder="k.placeholder || `选择日期`"
            ></el-date-picker>
            <el-date-picker
              v-if="k.type=='date' && k.queryType==2"
              style="width:100%;"
              v-model="form[k.prop]"
              @keyup.enter.native="handleQuery"
              :type="k.dateType||'daterange'"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :format="k.format||'yyyy-MM-dd'"
              :value-format="k.valueFormat||'yyyy-MM-dd'"
            ></el-date-picker>
            <el-date-picker
              v-if="k.type=='datetime' && k.queryType ==1"
              style="width:100%;"
              v-model="form[k.prop]"
              @keyup.enter.native="handleQuery"
              :type="k.dateType||'datetime'"
              :format="k.format||'yyyy-MM-dd HH:mm:ss'"
              :value-format="k.valueFormat||'yyyy-MM-dd HH:mm:ss'"
              :placeholder="k.placeholder || `选择日期`"
            ></el-date-picker>
            <el-date-picker
              v-if="k.type=='datetime' && k.queryType==2"
              style="width:100%;"
              v-model="form[k.prop]"
              @keyup.enter.native="handleQuery"
              type="datetimerange"
              start-placeholder="开始日期时间"
              end-placeholder="结束日期时间"
              :format="k.format||'yyyy-MM-dd HH:mm:ss'"
              :value-format="k.valueFormat||'yyyy-MM-dd HH:mm:ss'"
            ></el-date-picker>
            <el-time-picker
              v-if="k.type=='time' && k.queryType ==1"
              v-model="form[k.prop]"
              @keyup.enter.native="handleQuery"
              style="width:100%;"
              :placeholder="k.placeholder || `选择时间点`"
            ></el-time-picker>
            <el-time-picker
              v-if="k.type=='time' && k.queryType==2"
              style="width:100%;"
              is-range
              v-model="form[k.prop]"
              @keyup.enter.native="handleQuery"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            ></el-time-picker>
            <el-autocomplete
              v-if="k.type=='auto'"
              style="width:100%;"
              v-model="form[k.prop]"
              trigger-on-focus="false"
              @keyup.enter.native="handleQuery"
              :fetch-suggestions="querySearch"
              clearable
              :placeholder="k.placeholder || `请填写${k.label}`"
            >
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
              </template>
            </el-autocomplete>
            <el-select
              v-if="k.type=='fuzzySearch' && k.queryType==2"
              @keyup.enter.native="handleQuery"
              v-model="form[k.prop]"
              multiple
              style="width:100%"
              size="small"
              class="sx_post_user"
              filterable
              remote
              reserve-keyword
              clearable
              :placeholder="k.placeholder || `请填写${k.label}`"
              :remote-method="(query)=>{dropFuzzySearch(query,k.prop)}"
              :loading="loading"
            >
              <el-option
                v-for="item in k.data"
                :key="item.id"
                :label="item.realName || `${item.label}`"
                :value="item.id || `${item.value}`"
              ></el-option>
            </el-select>
            <el-select
              v-if="k.type=='fuzzySearch' && k.queryType==1"
              @keyup.enter.native="handleQuery"
              v-model="form[k.prop]"
              style="width:100%"
              size="small"
              class="sx_post_user"
              filterable
              remote
              reserve-keyword
              clearable
              :placeholder="k.placeholder || `请填写${k.label}`"
              :remote-method="(query)=>{dropFuzzySearch(query,k.prop)}"
              :loading="loading"
            >
              <el-option
                v-for="item in k.data"
                :key="item.id"
                :label="item.realName || `${item.label}`"
                :value="item.id || `${item.value}`"
              ></el-option>
            </el-select>
            <el-checkbox-group v-if="k.type=='checkbox'" v-model="form[k.prop]">
              <el-checkbox
                v-for="(item,index) in k.list"
                :label="item.value"
                @keyup.enter.native="handleQuery"
                :key="index"
              >{{item.label}}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox
              v-if="k.type=='singlecheckbox'"
              v-model="form[k.prop]"
              @keyup.enter.native="handleQuery"
              true-label="1"
              false-label="0"
            ></el-checkbox>
            <el-radio-group v-if="k.type=='radio'" v-model="form[k.prop]">
                <el-radio v-for="(item,index) in k.list"
                          :label="item.value"
                          @keyup.enter.native="handleQuery"
                          :key="index">{{item.label}}</el-radio>
            </el-radio-group>
            <el-switch
            v-if="k.type=='switch'"
            v-model="form[k.prop]"
            :active-value=1
            @keyup.enter.native="handleQuery"
            :inactive-value=0
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="sx_search-right" v-if="option.rows.length  > 0">
        <el-button-group>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
          <el-dropdown @command="DropdownMenu">
            <el-button type="primary" size="small">
              <i class="el-icon-arrow-down"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="clear">清空</el-dropdown-item>
              <el-dropdown-item
                command="spread"
                v-if="option.rows.length > 1"
              >{{isShow ? '收起' : '展开'}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button-group>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {
      form: {},
      isShow: false,
      restaurants: [],
      loading: false,
      selectData: []
    };
  },
  props: {
    option: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    init() {
      var that = this;
      console.log(that.option.rows);

        that.option.rows.forEach(ele => {
        ele.forEach(el => {
          if (
            el.type == "select" ||
            el.type == "multipleSelect" ||
            el.type == "tree" ||
            el.type == "fuzzySearch" ||
            (el.type == "input" && el.queryType =="3") ||
            (el.type == "select" && el.queryType =="3") ||
            (el.type == "date" && el.queryType =="3") ||
            (el.type == "date" && el.queryType =="2") ||
            (el.type == "datetime" && el.queryType =="3") ||
            (el.type == "datetime" && el.queryType =="2") ||
            (el.type == "time" && el.queryType =="3") ||
            (el.type == "multipleSelect" && el.queryType =="3") ||
            (el.type == "number" && el.queryType =="3") ||
            el.type == "checkbox"  ||
            el.type == "radio"
          ) {
            that.$set(that.form, el.prop, []);
          } else if(
            el.type =="switch"
          ){
            that.$set(that.form, el.prop, 0);
          }else{
             that.$set(that.form, el.prop, "");
          }
        });
      });

      console.log(that.form)
    },
    //下拉模糊搜索
    dropFuzzySearch(query, prop) {
      let columnList = this.option.rows;
      let column = {};
      columnList.forEach(el => {
        el.forEach(e => {
          if (e.prop == prop) {
            column = e;
          }
        });
      });
      if (query !== "") {
        this.loading = true;
        this.axios.get(column.url + `${query}`).then(res => {
          column.data = res.data.data;
          this.loading = false;
        });
      } else {
        column.data = [];
      }
    },
    querySearch(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      return [{ value: "空" }];
    },
    //查询
    handleQuery() {
      this.$emit("search", this.form);
    },
    getQuery(){
      this.$emit("getQuery",this.form)
    },
    getObj() {
      return this.form;
    },
    //清空
    empty() {
      this.$refs["form"].resetFields();
      if (this.$refs["queryInput"]) {
        for (let i = 0; i < this.$refs["queryInput"].length; i++) {
          this.$refs["queryInput"][i].clear();
        }
      }
      if (this.$refs["querySelect"]) {
        for (let i = 0; i < this.$refs["querySelect"].length; i++) {
          this.$refs["querySelect"][i].clear();
        }
      }
    },
    //表单下拉菜单
    DropdownMenu(command) {
      switch (command) {
        case "clear":
          this.empty();
          break;
        case "spread":
          this.Doshow();
          break;
      }
    },
    Doshow() {
      if (this.isShow) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    //输入框值变化
    childGetValueInput(data, prop) {
      const selectData = this.conversionOperator(data);
      //this.form.prop = selectData;
      this.$set(this.form, prop, selectData);
    },
    //下拉框值变化
    childGetValueSelect(data, prop) {
      const selectData = this.conversionOperator(data);
      this.$set(this.form, prop, selectData);
    },
    //组合查询输入框弹框  -- 确认
    // childByValueInput(data) {
    //   const inputData = this.conversionOperator(data);
    //   this.form.inputQuery = inputData;
    // },
    //组合查询下拉框弹框  -- 确认
    // childByValueSelect(data) {
    //   const selectData = this.conversionOperator(data);
    //   this.form.selectQuery = selectData;
    // },
    //操作符转换
    conversionOperator(data) {
      data.map(item => {
        if (item.operator == "等于") {
          item.operator = "EQ";
        }
        if (item.operator == "不等于") {
          item.operator = "NE";
        }
        if (item.operator == "大于") {
          item.operator = "GT";
        }
        if (item.operator == "大于等于") {
          item.operator = "GE";
        }
        if (item.operator == "小于") {
          item.operator = "LT";
        }
        if (item.operator == "小于等于") {
          item.operator = "LE";
        }
        if (item.operator == "包含") {
          item.operator = "LIKE";
        }
        if (item.operator == "不包含") {
          item.operator = "NOTLIKE";
        }
        if (item.operator == "范围") {
          item.operator = "BT";
        }
        if (item.operator == "范围外") {
          item.operator = "NBT";
        }
      });
      return data;
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  watch: {}
};
</script>
<style lang='scss' scoped>
// .el-checkbox-group{
//   width: 100%;
//     display: flex;
//     justify-content: space-between;
// }
</style>
