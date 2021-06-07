<template>
  <div class="widget-form-container">

   <el-form
      :label-position="data.labelPosition || 'left'"
      :label-width="data.labelWidth ? `${data.labelWidth}px` : '100px'"
      :label-suffix="data.labelSuffix"
      :model="form"
      ref="widgetForm"
      size="small"
    >
      <el-row :gutter="data.gutter">
        <template v-for="(column, index) in options.column">
          <div
            class="widget-form-table"
            v-if="column.type == 'dynamic'"
            :key="index"
          ></div>
          <div
            class="widget-form-group"
            v-else-if="column.type == 'group'"
            :key="index"
          >
            <widget-group
              :data="data"
              :column="column"
              :index="index"
              :user="user"
            >
            </widget-group>
          </div>
          <el-col
            v-else
            :key="index"
            :md="column.span || 12"
            :xs="24"
            :offset="column.offset || 0"
          >
            <el-form-item
              class="widget-form-item"
              :label="column.label"
              :labelWidth="column.labelWidth"
              :prop="column.prop"
            >
              <widget-item :item="column" :user="user" :params="column.params"></widget-item>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <el-dialog width="70%" :visible.sync="dlgFormView" :append-to-body="true" :before-close="handleClose" modal-append-to-body="false">
      <form-view v-if="dlgFormView" :data="itemOption" :option="formOption" :srcFormId="this.data.id"></form-view>
    </el-dialog>
    <el-dialog width="70%" :visible.sync="dlgChoice" :append-to-body="true" :before-close="handleClose" modal-append-to-body="false">
      <search-choice v-if="dlgChoice" :data="itemOption" :option="formOption" :srcFormId="this.data.id"></search-choice>
    </el-dialog>
  </div>
  <!--  <div class="container">

  <avue-form
      v-if="show"
      ref="form"
      v-model="form"
      :option="options"
      class="preview-form qx-preview"
    >
      <template slot-scope="scope" slot="tabs">
        <el-tabs v-model="scope.value" :tab-position="scope.column.params.option.position" type="border-card" @tab-click="changeTab(scope)">
          <el-tab-pane v-for="item in scope.column.params.option.column" :label="item.label" :name="item.prop">
            <el-col v-for="data in item.children.column" :span="data.span">
              <widget-form-item  :item="data" :params="data.params"></widget-form-item>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </template>
      <template slot-scope="scope" slot="title">
        <el-col :span="scope.column.span" :style="scope.column.styles">
          <div> <i :class="scope.column.icon"></i> {{scope.value}} </div>
        </el-col>
      </template>
    </avue-form>
     <div class="drawer-foot">-->
  <!--      <el-button size="medium" type="primary" @click="handlePreviewSubmit">确定</el-button>-->
  <!--      <el-button size="medium" type="danger" @click="handleBeforeClose">取消</el-button>-->
  <!--    </div>-->

  </div>
</template>
<script>
import { getBizDictList,getDictList, getChildList,getBizChildList,getCity } from "@/api/tool/form";
import formView from "@/components/formView/formView";
import searchChoice from "@/components/formView/searchChoice";
import eventBus from '@/forms/utils/eventBus'
import { formById,formSave,formSearchNoPage,formSearchPage } from "@/api/tool/analysis";
import WidgetGroup from "./widgetGroup";
import WidgetItem from "./widgetItem";
import getLocation from "../../utils/getlocation";
export default {
  name: "formView",
  props: ["data","options","srcFormId"],
  components: {
    WidgetGroup,
    WidgetItem,
    formView
  },
  data() {
    return {
      form: {},
      user: {},
      previewVisible: true,
      options: {},
      formOption:{},
      oldOptions:{},
      show: false,
      dlgFormView: false,
      itemOption:{},
      oldFormData: {},
      formData: {},
      oldFormData: {},
      dlgChoice: false,
    };
  },
  watch: {
    data: function (vl) {
      this.data = vl;
      //this.init();
    },
  },
  created() {
    this.init();
  },
  mounted() {
    console.log("formView-mounted:"+JSON.stringify(this.options));
    //this.$set(this, "oldOptions", this.deepClone(this.options));
    window.$bus.$on("changeValue", (fn) => {
      fn(this.options.column, this.form, (obj) => {
        this.form = obj;
      });
    });
    window.$bus.$on("changeOption", (fn) => {
      fn(this.options.column, (key, value) => {
        this.form[key] = value;
      });
    });
    window.$bus.$on('btnSave', (item) => {
      console.log("EventBus-btnSave:"+JSON.stringify(item));
      console.log("EventBus-openView-dataId:"+JSON.stringify(this.data.id));
      console.log("EventBus-openView-srcFormId:"+JSON.stringify(this.srcFormId));
      if(this.data.id!=item.formId){

      }
      this.dlgFormView=false;
      if(this.data.id==item.formId){
        let obj = {
          dataId: this.data.id,
          dataType:'F',
          mainModel:this.formData
        };
        formSave(obj).then((res) => {
          console.log("res=>:" + JSON.stringify(res));
        });
        //this.dlgFormView=false;
      }
    })
    eventBus.$on('btnReset', (item) => {
      if(this.data.id==item.formId){
        console.log("EventBus:"+JSON.stringify(item));
        this.$set(this, "options", this.oldOptions);
        this.$set(this, "formData", this.oldFormData);
      }
    })
    window.$bus.$on('btnDlgChoice', (item) => {
      if(this.data.id==item.formId){
        this.dlgChoice=true
      }
    })
    window.$bus.$on('currentRow', (item) => {
      this.currentRow(item)
    })
    eventBus.$on('btnSearch', (item) => {
      console.log("EventBus-btnSearch:"+JSON.stringify(this.formData));
      console.log("EventBus-btnSearch-item:"+JSON.stringify(this.item));
      console.log("EventBus-btnSearch-item:"+JSON.stringify(item.crudId));
      if(this.data.id==item.formId){
        this.searchTable(item)
      }
    })
    eventBus.$on('openView', (item) => {
      console.log("EventBus-openView:"+JSON.stringify(item));
      console.log("EventBus-openView-dataId:"+JSON.stringify(this.data.id));
      console.log("EventBus-openView-srcFormId:"+JSON.stringify(this.srcFormId));
      if(this.data.id==item.formId){
        this.openView(item)
        /*
        this.itemOption = {
            id: item.assRuleCode,
        };
        if(item.crudId){
          this.itemOption.dataId=0;
        }
        this.dlgFormView=true;
        */
      }
    })
    eventBus.$on('set-input-val', (val) => {
      //console.log("set-input-val:"+JSON.stringify(val));
      this.$set(this.formData, val.fieldName, val.fieldVal);
      //console.log("formData:"+JSON.stringify(this.formData));
    })
    eventBus.$on('set-item-value', (val) => {
      this.$set(this.formData, val.fieldName, val.fieldVal);
      console.log("formData:"+JSON.stringify(this.formData));
    })

  },
  beforeDestroy() {
    window.$bus.$off("changeValue");
    window.$bus.$off('changeOption')
    eventBus.$off('btnSave')
    eventBus.$off('btnReset')
    eventBus.$off('btnSearch')
    //eventBus.$off('openView')
    eventBus.$off('set-input-val')
    eventBus.$off('set-item-value')
  },
  methods: {
    currentRow(item){
      if(item){
        this.$set(this.data, 'currentRow', item);
      }
    },
    changeTab(col) {
      col.column.change && col.column.change();
    },
    openView(item) {
      console.log("openView:"+JSON.stringify(item));
      this.itemOption = {
        id: item.assRuleCode,
      };
      if(item.crud){
        if(this.data.currentRow){
          for(let key  in this.data.currentRow){
            console.log(key + '---' + this.data.currentRow[key])
            if(key.indexOf("#id")>0||key.indexOf("#Id")>0||key.indexOf("#ID")>0||key.indexOf("#iD")>0){
              this.$set(this.itemOption, 'dataId', this.data.currentRow[key]);//this.data.currentRow.ID
            }
          }
          if(this.data.currentRow.ID){
          }
        }
      }
      this.dlgFormView=true;
    },
    searchBtn(item) {
      console.log("searchBtn:"+JSON.stringify(this.item));
      let fieldList =[]
      let tableItem ={}
      this.options.column.forEach((cItem) => {
        if(cItem.type=='crud'){
          console.log("searchBtn:"+JSON.stringify(cItem));
          if(item.crudId==cItem.prop){
            tableItem=cItem
            console.log("cItem-eq:"+JSON.stringify(cItem));
            cItem.params.option.column.forEach((fieldItem) => {
              fieldList.push(fieldItem.prop)
            })
          }
        }else if(cItem.type=='group'){
          cItem.children.column.forEach((subItem) => {
            if(subItem.type=='crud'){
              //console.log("subItem-crud:"+JSON.stringify(subItem));
              if(item.crudId==subItem.prop){
                tableItem=subItem
                //console.log("subItem-eq:"+JSON.stringify(subItem));
                subItem.params.option.column.forEach((fieldItem) => {
                  fieldList.push(fieldItem.prop)
                })
              }
            }
          })
        }
      });
      let obj = {
        formId: this.data.id,
        modelId: item.modelId,
        size: tableItem.pageSize,
        current:1,
        fieldList:fieldList,
        queryMap:this.formData
      };
      if(tableItem.pageTurning){//支持翻页
        formSearchPage(obj).then((res) => {
          console.log("res=>:" + JSON.stringify(res));
          tableItem.params.data=res.data.data.records;
          let resObj = [];
          for(var i=0,l=res.data.data.records.length;i<l;i++){
        　　for(var key in res.data.data.records[i]){
              //console.log("subDataItem:"+JSON.stringify(res.data.data[i][key]));
              fieldList.forEach((fItem) => {
                if(key==fItem){

                }
              })
        　　}
          }
        });
      }else{
        formSearchNoPage(obj).then((res) => {
          console.log("res=>:" + JSON.stringify(res));
          tableItem.params.data=res.data.data;
          let resObj = [];
          for(var i=0,l=res.data.data.length;i<l;i++){
        　　for(var key in res.data.data[i]){
              //console.log("subDataItem:"+JSON.stringify(res.data.data[i][key]));
              fieldList.forEach((fItem) => {
                if(key==fItem){

                }
              })
        　　}
          }
        });
      }
    },
    searchTable(item) {
      console.log("searchTablew:"+JSON.stringify(this.item));
      let fieldList =[]
      let tableItem ={}
      this.options.column.forEach((cItem) => {
        if(cItem.type=='crud'){
          console.log("searchTablew:"+JSON.stringify(cItem));
          if(item.crudId==cItem.prop){
            tableItem=cItem
            console.log("cItem-eq:"+JSON.stringify(cItem));
            cItem.params.option.column.forEach((fieldItem) => {
              fieldList.push(fieldItem.prop)
            })
          }
        }else if(cItem.type=='group'){
          cItem.children.column.forEach((subItem) => {
            if(subItem.type=='crud'){
              //console.log("subItem-crud:"+JSON.stringify(subItem));
              if(item.crudId==subItem.prop){
                tableItem=subItem
                //console.log("subItem-eq:"+JSON.stringify(subItem));
                subItem.params.option.column.forEach((fieldItem) => {
                  fieldList.push(fieldItem.prop)
                })
              }
            }
          })
        }
      });
      let obj = {
        formId: this.data.id,
        modelId: item.modelId,
        size: tableItem.pageSize,
        current:1,
        fieldList:fieldList,
        queryMap:this.formData
      };
      if(tableItem.pageTurning){//支持翻页
        formSearchPage(obj).then((res) => {
          console.log("res=>:" + JSON.stringify(res));
          tableItem.params.data=res.data.data.records;
          let resObj = [];
          for(var i=0,l=res.data.data.records.length;i<l;i++){
        　　for(var key in res.data.data.records[i]){
              //console.log("subDataItem:"+JSON.stringify(res.data.data[i][key]));
              fieldList.forEach((fItem) => {
                if(key==fItem){

                }
              })
        　　}
          }
        });
      }else{
        formSearchNoPage(obj).then((res) => {
          console.log("res=>:" + JSON.stringify(res));
          tableItem.params.data=res.data.data;
          let resObj = [];
          for(var i=0,l=res.data.data.length;i<l;i++){
        　　for(var key in res.data.data[i]){
              //console.log("subDataItem:"+JSON.stringify(res.data.data[i][key]));
              fieldList.forEach((fItem) => {
                if(key==fItem){

                }
              })
        　　}
          }
          /*
          res.data.forEach((dataItem) => {
            let iObj = [];
            dataItem.forEach((subDataItem) => {
              console.log("subDataItem:"+JSON.stringify(subDataItem));
            })
            fieldList.forEach((fItem) => {
              if(dataItem==fItem){

              }
            })
            resObj.push(iObj)
          }) */
          //tableItem.data=resObj;
        });
      }
    },
    validate() {
      this.$refs.form.validate();
    },
    resetForm() {
      this.$refs.form.resetForm();
    },
    toBoole(num) {
      return num == 1;
    },
    transformToAvueOptions(obj) {
      return new Promise((resolve, reject) => {
        try {
          const data = this.deepClone(obj);
          for (let i = 0; i < data.column.length; i++) {
            const col = data.column[i];
            if (
              col.type == "dynamic" &&
              col.children &&
              col.children.column &&
              col.children.column.length > 0
            ) {
              const c = col.children.column;
              c.forEach((item) => {
                delete item.subfield;
              });
              this.transformToAvueOptions(col.children).then((res) => {
                col.children = res;
              });
            } else if (col.type == "group") {
              if (!data.group) data.group = [];
              const group = {
                label: col.label,
                icon: col.icon,
                prop: col.prop,
                arrow: col.arrow,
                collapse: col.collapse,
                display: col.display,
              };
              this.transformToAvueOptions(col.children).then((res) => {
                group.column = res.column;
                data.group.push(group);
                //data.column.push(group);
              });
              //data.column.splice(i, 1);
              //i--;
            } else if (
              ["checkbox", "radio", "tree", "cascader", "select"].includes(
                col.type
              )
            ) {
              if (col.dicOption == "static") {
                delete col.dicUrl;
                delete col.dicMethod;
                delete col.dicQuery;
                delete col.dicQueryConfig;
              } else if (col.dicOption == "remote") {
                delete col.dicData;
                if (col.dicQueryConfig && col.dicQueryConfig.length > 0) {
                  const query = {};
                  col.dicQueryConfig.forEach((q) => {
                    if (q.key && q.value) query[q.key] = q.value;
                  });
                  col.dicQuery = query;
                  delete col.dicQueryConfig;
                } else delete col.dicQueryConfig;
              }
              /*
              if (col.type == 'select') {
                if (col.assRuleCode == "biz-dict") {
                  let params = {
                    parentId: col.assRuleVal,
                  };
                  getBizChildList(Object.assign(params, this.query)).then((res) => {
                    let dicData = [];
                    for (let i = 0; i < res.data.data.records.length; i++) {
                      let params = {
                        label: res.data.data.records[i].dictValue,
                        value: res.data.data.records[i].id,
                      };
                      dicData.push(params);
                    }
                    this.$set(data, "dicData", dicData);
                  });
                }
              }

              if (col.type == "select") {
                if(col.assignType=='ass_rule'){
                   let params={
                     parentId:col.assRuleVal
                   };
                   console.log("select-assignType-ass_rule=>:" + col.assignType);
                   if (col.assRuleCode == "sys-dict") {
                      getChildList(
                        Object.assign(params, this.query)
                      ).then((res) => {
                        console.log("getChildList=>:" + res);
                        this.$set(col,'subRuleList',res.data.data.records)
                      });
                   }
                   if (col.assRuleCode == "biz-dict") {
                      getBizChildList(
                        Object.assign(params, this.query)
                      ).then((res) => {
                        let dicData=[]
                        for (let i = 0; i < res.data.data.records.length; i++) {
                          let params={
                            label:res.data.data.records[i].dictValue,
                            value:res.data.data.records[i].id
                          };
                          dicData.push(params);
                        }
                        this.$set(col,'dicData',dicData)
                        this.$set(data,'dicData',dicData)
                        //this.data.subRuleList = res.data.data.records;
                      });

                   }
                }
              }*/
              delete col.dicOption;
            } else if (["upload"].includes(col.type)) {
              if (col.headersConfig && col.headersConfig.length > 0) {
                const headers = {};
                col.headersConfig.forEach((h) => {
                  if (h.key && h.value) headers[h.key] = h.value;
                });
                col.headers = headers;
              } else delete col.headers;
              delete col.headersConfig;

              if (col.dataConfig && col.dataConfig.length > 0) {
                const data = {};
                col.dataConfig.forEach((h) => {
                  if (h.key && h.value) data[h.key] = h.value;
                });
                col.data = data;
              } else delete col.data;
              delete col.dataConfig;
            } else if (["tabs", "button"].includes(col.type)) {
              if (obj.column[i].change) {
                col.event.change = eval(col.change);
              }
              if (obj.column[i].click) {
                col.event.click = eval(col.click);
              }
              if (col.type == "tabs") {
                col.value = col.params.option.column[0].prop;
                for (let j = 0; j < col.params.option.column.length; j++) {
                  this.transformToAvueOptions(
                    col.params.option.column[j].children
                  ).then((res) => {
                    col.params.option.column[j].children = res;
                    for (
                      let k = 0;
                      k < col.params.option.column[j].children.column.length;
                      k++
                    ) {
                      let demodata =
                        col.params.option.column[j].children.column[k];
                      if (demodata.type2 && demodata.type2 == "省市级") {
                        setTimeout(() => {
                          getCity({ dataLevel: demodata.dataLevel }).then(
                            (res) => {
                              this.options.column[i].params.option.column[
                                j
                              ].children.column[k].dicData = res.data.data;
                            }
                          );
                        }, 1000);
                      }
                    }
                  });
                }
              }
            } else if (col.type == "map") {
              if (col.value) {
                let location = eval(col.value);
                this.$set(this.form, col.prop, location);
                col.value = location;
                col.params.params.center = location;
              }
              if (col.defaultLocation) {
                getLocation((mydata) => {
                  col.value = [
                    mydata.position.R,
                    mydata.position.Q,
                    mydata.formattedAddress,
                  ];
                  this.$set(this.form, col.prop, [
                    mydata.position.R,
                    mydata.position.Q,
                    mydata.formattedAddress,
                  ]);
                  this.options.column[i].params.params.center = [
                    mydata.position.R,
                    mydata.position.Q,
                  ];
                });
              }
            }
            if (col.type2 && col.type2 == "省市级") {
              getCity({ dataLevel: col.dataLevel }).then((res) => {
                this.options.column[i].dicData = res.data.data;
              });
            }
            if (col.change) col.change = eval(col.change);
            else delete col.change;

            if (col.click) col.click = eval("(" + col.click + ")");
            else delete col.click;

            if (col.focus) col.focus = eval(col.focus);
            else delete col.focus;

            if (col.blur) col.blur = eval(col.blur);
            else delete col.blur;
            if (col.hideLable) {
              //console.log('col.hideLable==0=>:' +(col.hideLable==0))
              //console.log('col.hideLable=>:' +JSON.stringify(col))
              if (col.hideLable==0) {
                col.labelWidth = "0px";
                col.label = "";
              }
            }
            if (col.hasOwnProperty("disabled")) {
              col.disabled = this.toBoole(col.disabled);
            }
            if (col.hasOwnProperty("readonly")) {
              col.readonly = this.toBoole(col.readonly);
            }
            data.readonly = this.toBoole(data.readonly);
            data.disabled = this.toBoole(data.disabled);
            data.emptyBtn = this.toBoole(data.emptyBtn);
            data.detail = this.toBoole(data.detail);
            data.menuBtn = this.toBoole(data.menuBtn);
            data.submitBtn = this.toBoole(data.submitBtn);
            data.tabs = this.toBoole(data.tabs);
          }
          console.log('transformToAvueOptions:')//+JSON.stringify(data));
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    },
    init() {
      //初始化 解析表单
      if (!this.data || Object.keys(this.data).length === 0) {
        return;
      }
      if(!this.data.id){
        this.options = this.deepClone(this.data);
        this.show = true;
        return;
      }
      let obj = {};
      obj.formId = this.data.id;
      obj.dataId = this.data.dataId;
      formById(obj).then((res) => {
        console.log("formById-:" + JSON.stringify(obj));
        if (res.data && res.data.code == 200 && res.data.data.column) {
          let obj = res.data.data; //JSON.parse(res.data.data.formVO.jsonText);
          this.user = res.data.data.user;
          this.formData = res.data.data.modelData;
          this.oldFormData = this.deepClone(res.data.data.modelData);
          this.transformToAvueOptions(obj).then((data) => {
            this.options = this.deepClone(data);
            this.oldOptions = this.deepClone(data);
            this.show = true;
          });
        }
      });
      /*
      formDetail(this.data.id).then(res => {
        if (res.data && res.data.code == 200 &&  res.data.data.formVO.jsonText) {
          let obj = JSON.parse(res.data.data.formVO.jsonText);
          console.log("jsonText:"+JSON.stringify(obj));
          this.transformToAvueOptions(obj).then(data=>{
            this.options  = this.deepClone(data);
            this.show = true;
          })
        }
      })*/
    },
    handlePreviewSubmit(form, done) {
      if (done) {
        this.$alert(this.form)
          .then(() => {
            done();
          })
          .catch(() => {});
      } else {
        this.$refs.form.validate((valid, done) => {
          if (valid)
            this.$alert(this.form)
              .then(() => {
                done();
              })
              .catch(() => {});
        });
      }
    },
    handleBeforeClose(bool) {
      this.previewVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
// @import "../../styles/form.scss";
.container {
  width: 100%;
  height: 100%;
}
.form-designer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.sx_form_header {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #ccc;
  .headerLeft {
    float: left;
    line-height: 50px;
    padding: 0 30px;
  }
  .headerRight {
    float: right;
    line-height: 50px;
    padding: 0 30px;
  }
}
.form-designer .widget-config-container .el-tabs__header {
  width: 100%;
}
</style>
