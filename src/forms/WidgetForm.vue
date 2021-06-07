<template>
  <div class="widget-form-container">
    <el-form :label-position="data.labelPosition || 'left'"
             :label-width="data.labelWidth ? `${data.labelWidth}px` : '100px' "
             :label-suffix="data.labelSuffix"
             :model="form"
             ref="widgetForm"
             size="small">
      <el-row :gutter="data.gutter">
        <draggable class="widget-form-list"
                   :list="data.column"
                   :group="{ name: 'form' }"
                   ghost-class="ghost"
                   :animation="300"
                   @add="handleWidgetAdd"
                   @end="$emit('change')">
          <template v-for="(column, index) in data.column">
            <div class="widget-form-table"
                 v-if="column.type == 'dynamic'"
                 :key="index"
                 :class="{ active: selectWidget.prop == column.prop }"
                 @click="handleSelectWidget(index)">
              <widget-form-table :data="data"
                                 :column="column"
                                 :index="index"
                                 :select.sync="selectWidget"
                                 @change="$emit('change')"></widget-form-table>
            </div>
            <div class="widget-form-group"
                 v-else-if="column.type == 'group'"
                 :key="index"
                 :class="{ active: selectWidget.prop == column.prop }"
                 @click="handleSelectWidget(index)">
              <widget-form-group :data="data"
                                 :column="column"
                                 :index="index"
                                 :select.sync="selectWidget"
                                 @change="$emit('change')">
              </widget-form-group>
            </div>
            <!--<div class="widget-form-tabs"
                 v-else-if="column.type == 'tabs'"
                 :key="index"
                 :class="{ active: selectWidget.prop == column.prop }"
                 @click="handleSelectWidget(index)">
              <widget-form-tabs :data="data"
                                 :column="column"
                                 :index="index"
                                 :select.sync="selectWidget"
                                 @change="$emit('change')">
              </widget-form-tabs>
            </div>-->                 
            <el-col v-else-if="column.type == 'tabs'" :key="index"
                    :md="column.span || 12"
                    :xs="24"
                    :offset="column.offset || 0">
                <el-tabs type="border-card"  :tab-position="column.params.option.position" :class="{active: selectWidget.prop == column.prop}">
                  <el-tab-pane :label="tab.label" v-for="(tab,i) in column.params.option.column" :key="i">
                    <div class="widget-form-group"
                          style="min-height: 100px"
                         @click="handleSelectWidget(index)">
                      <widget-form-tabs1
                          :data="data"
                          :column="tab"
                          :index="index"
                          :select.sync="selectWidget"
                          @change="$emit('change')">
                      </widget-form-tabs1>
                    </div>
                  </el-tab-pane>
                </el-tabs>
                <el-button title="删除"
                           @click.stop="handleWidgetDelete(index)"
                           class="widget-action-delete"
                           v-if="selectWidget.prop == column.prop"
                           circle
                           plain
                           size="small"
                           type="danger">
                  <i class="iconfont icon-delete"></i>
                </el-button>
                <el-button title="复制"
                           @click.stop="handleWidgetClone(index)"
                           class="widget-action-clone"
                           v-if="selectWidget.prop == column.prop"
                           circle
                           plain
                           size="small"
                           type="primary">
                  <i class="iconfont icon-copy"></i>
                </el-button>
            </el-col>
            <el-col v-else
                    :key="index"
                    :md="column.span || 12"
                    :xs="24"
                    :offset="column.offset || 0">
              <el-form-item class="widget-form-item"
                            :label="column.label"
                            :labelWidth="column.labelWidth"
                            :prop="column.prop"
                            :class="{ active: selectWidget.prop == column.prop, 'required': column.required }"
                            @click.native="handleSelectWidget(index)">
                <widget-form-item :item="column" :params="column.params"></widget-form-item>
                <el-button title="删除"
                           @click.stop="handleWidgetDelete(index)"
                           class="widget-action-delete"
                           v-if="selectWidget.prop == column.prop"
                           circle
                           plain
                           size="small"
                           type="danger">
                  <i class="iconfont icon-delete"></i>
                </el-button>
                <el-button title="复制"
                           @click.stop="handleWidgetClone(index)"
                           class="widget-action-clone"
                           v-if="selectWidget.prop == column.prop"
                           circle
                           plain
                           size="small"
                           type="primary">
                  <i class="iconfont icon-copy"></i>
                </el-button>
              </el-form-item>
            </el-col>
          </template>
        </draggable>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import WidgetFormItem from './WidgetFormItem'
import WidgetFormGroup from './WidgetFormGroup'
import WidgetFormTable from './WidgetFormTable'
import WidgetFormTabs1 from './WidgetFormTabs1'
import Draggable from 'vuedraggable'
import {findFieldsById} from "@/api/tool/form";

export default {
  name: 'widget-form',
  components: {Draggable, WidgetFormItem, WidgetFormGroup, WidgetFormTable, WidgetFormTabs1},
  props: ['data', 'select', 'del'],
  data() {
    return {
      selectWidget: this.select,
      //delData:this.del,
      delId: [],
      form: {}
    }
  },
  methods: {
    //首次通过后台的modelId查模型字段
    findFields(index) {
      if (this.data.modelId) {
        findFieldsById(this.data.modelId).then(res => {
          let arr = []
          res.data.data.forEach(ele => {
            arr.push({id: ele.id,fieldName:ele.fieldName, combinationName: ele.combinationName})
          })
          this.$nextTick(() => {
            this.$set(this.data, 'modelData', arr)
            this.handleSelectWidget(index)
          })
        })
      }
    },
    // 中间内容变化的时候
    handleSelectWidget(index) {
      this.selectWidget = this.data.column[index];
      console.log(this.selectWidget)
    },
    //往中间添加控件
    handleWidgetAdd(evt) {
      console.log('handleWidgetAdd:'+evt)
      const newIndex = evt.newIndex
      const data = this.deepClone(this.data.column[newIndex])
       if (!data.prop) data.prop = data.type + "_" + Date.now() + Math.ceil(Math.random() * 99999)
      //data.prop = data.type + "_" + Date.now() + Math.ceil(Math.random() * 99999)
      delete data.icon
      delete data.subfield
      if(data.type == 'crud'){
        if(this.data.modelList){
          this.data.modelList.push(this.data.modelIdData)
          this.$set(data, "modelList", this.data.modelList);
        }else{
          var modelList=[]
          modelList.push(this.data.modelIdData)
          this.$set(this.data, "modelList", modelList);
          this.$set(data, "modelList", this.data.modelList);
        }
        this.$set(data, "modelData", this.data.modelData);     
        this.$set(data, "model", this.data.modelIdData);   
      }
      if (data.type == 'title') {
        delete data.label
        this.form[data.prop] = data.value
      }
      if(data.type == "table"){
        data.dicMethod = "get"
      }
      this.$set(this.data.column, newIndex, data)
      this.handleSelectWidget(newIndex)
      this.$emit("change")
    },
    //删除控件
    handleWidgetDelete(index) {
      if (this.data.column.length - 1 === index) {
        if (index === 0) this.selectWidget = {}
        else this.handleSelectWidget(index - 1)
      } else this.handleSelectWidget(index + 1)
      //  console.log(this.data.column[index])
      //  console.log(this.del)

      //  this.del.forEach(ele=>{
      //    if(ele.editorId == this.data.column[index].prop){
      //          this.delId.push(ele.id)
      //    }
      //  })

      this.$nextTick(() => {
        // console.log(this.delData)
        this.delData.push(this.data.column[index].fieldId)
        this.data.column.splice(index, 1)
        this.$emit("change")
        //this.$emit('getDelId',this.delId)
      })
    },
    //拷贝控件
    handleWidgetClone(index) {
      let cloneData = this.deepClone(this.data.column[index])
      cloneData.prop = cloneData.type + "_" + Date.now() + Math.ceil(Math.random() * 99999)
      this.data.column.splice(index, 0, cloneData)
      this.$nextTick(() => {
        this.handleSelectWidget(index + 1)
        this.$emit("change")
      })
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    },
    del: {
      handler(val) {
        this.delData = val
      },
      immediate: true,
    }
  }
}
</script>
