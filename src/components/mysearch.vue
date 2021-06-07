<template>
  <div>
    <el-form ref="form" @submit.native.prevent :model="form" :label-width="option.labelWidth || '80px'" :size="option.size||'medium'" :label-position="option.labelPosition || 'right'">
      <el-row :gutter="24">
        <el-col v-for="(k,i) in option.column" :key="i" :span="k.span || 6">
          <el-form-item :label="k.label" :prop="k.prop">
              <el-input v-if="k.type=='input' || !k.type" clearable v-model="form[k.prop]" :placeholder="k.placeholder || `请填写${k.label}`"></el-input>
              <el-select v-if="k.type=='select'" v-model="form[k.prop]" :placeholder="k.placeholder || `请选择${k.label}`" style="width:100%">
                  <el-option
                  v-for="item in k.dicList"
                  :key="item.prop"
                  :label="item.label"
                  :value="item.prop">
                  </el-option>
              </el-select>
              <el-date-picker
              v-if="k.type=='date'"
              style="width:100%;"
              v-model="form[k.prop]"
              :type="k.dateType||'date'"
              :format="k.format||'yyyy-MM-dd'"
              :value-format="k.valueFormat||'yyyy-MM-dd'"
              :placeholder="k.placeholder || `选择日期`">
              </el-date-picker>
              <el-date-picker
              v-if="k.type=='daterange'"
              style="width:100%;"
              v-model="form[k.prop]"
              :type="k.dateType||'daterange'"
              :start-placeholder="k.startPlaceholder || '开始日期'"
              :end-placeholder="k.endPlaceholder || '结束日期'"
              :format="k.format||'yyyy-MM-dd'"
              :value-format="k.valueFormat||'yyyy-MM-dd'">
              </el-date-picker>
             <el-date-picker
              v-if="k.type=='datetime'"
              style="width:100%;"
              v-model="form[k.prop]"
              :type="k.dateType||'datetime'"
              :format="k.format||'yyyy-MM-dd'"
              :value-format="k.valueFormat||'yyyy-MM-dd'"
              :placeholder="k.placeholder || `选择日期`">
              </el-date-picker>
              <el-autocomplete
                      v-if="k.type=='auto'"
                      style="width:100%;"
                      v-model="form[k.prop]"
                      trigger-on-focus="false"
                      :fetch-suggestions="querySearch"
                      clearable
                      :placeholder="k.placeholder || `请填写${k.label}`">
                  <template slot-scope="{ item }">
                      <div class="name">{{ item.value }}</div>
                  </template>
              </el-autocomplete>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <div style="float:right;">
            <el-button type="primary" :size="option.size||'medium'" native-type="submit"  @click="submit">搜 索</el-button>
            <el-button :size="option.size||'medium'"  @click="empty">清 空</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
    components: {

    },
    data () {
        return {
            form: {},
            restaurants:[]
        };
    },
    /*
    option格式
    option: {
        LabelWidth: '100px' 默认为80px
        size: '' 默认medium
        labelPosition: '' 默认right
        参照ele配置
        column: [
        {
            label: 'label文字'
            prop: '绑定字段'
            type: '输入框/选择框等'   默认为input
            placeholder: ''
            dicList: [
                当type为select的时为必须
                {
                    label: '显示的文字'
                    prop: '绑定唯一ID'
                }
            ]
            当type为date的时为必须
            dateType: ''默认为date
            formatter: ''默认为yyyy-MM-dd
            valueFormat: ''默认为yyyy-MM-dd
        }
        ]
    }
    */
    props: {
        option: {
            type: Object,
            default: function(){
                return {}
            }
        }
    },
    computed: {
        ...mapGetters(['permissions'])
    },
    methods: {
        init(){
            var me = this;
            for (let k in me.option.column){
                if(me.option.column[k].type == 'select' || me.option.column[k].dateType == 'daterange'){
                    me.$set(me.form,me.option.column[k].prop,[])
                } else {
                    me.$set(me.form,me.option.column[k].prop,'')
                }
                
            }
        },

        querySearch(queryString, cb) {
            let restaurants = this.restaurants;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },

        loadAll() {
            return [
                {"value":"空"},
            ]
        },

        submit(){
            this.$emit('search', this.form)
        },
        getObj(){
            return this.form
        },
        empty(){
            this.$refs['form'].resetFields()
        },

    },
    created() {
        this.init()
    },

    mounted() {
        this.restaurants = this.loadAll();
    },

    watch: {},
}
</script>

<style lang='scss' scoped>
    .el-row{
        margin-left: 0!important;
        margin-right: 0!important;
    }
</style>