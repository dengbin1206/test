<template>
   <basic-container>
     <Search :option="searchOption" @search="search"></Search>
     <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               @row-save="rowSave"
               @row-upDate="rowUpdate"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               :cell-style="cellStyle"
               :row-style="rowStyle">
        <!--<template slot="menuLeft">
          <el-button type="primary"
                    size="small"
                    icon="el-icon-printer"
                    @click="dyewm">报修
          </el-button>
          <el-button type="primary"
                    size="small"
                    icon="el-icon-printer"
                    @click="dianden">点检登记
          </el-button>
        </template>-->
        <template slot-scope="scope" slot="checkConclusion">
                <el-tag type="warning" v-if="scope.row.checkConclusion === 1"
                >未点检</el-tag
                >
                <el-tag type="success" v-if="scope.row.checkConclusion === 2"
                >已点检</el-tag
                >
                <el-tag type="danger" v-if="scope.row.checkConclusion === 3"
                >异常</el-tag
                >
        </template>
       <template slot-scope="scope" slot="menu">
         <el-button icon="el-icon-view" size="small" type="text"  @click="showDjView(scope.row)">查看点检结果</el-button>
       </template>
    </avue-crud>
    <el-dialog
      title="报修"
      v-dialog
      :visible.sync="printize"
      width="70%"
      append-to-body
    >
      <el-form  label-width="130px"  :model='wxForm' :rules="rules" ref="ruleForm">
        <el-row>
            <el-col :span='12'>
                <el-form-item label="关联单号:" prop='checkOrderNo'>
                    <el-input v-model="wxForm.checkOrderNo" placeholder="请输入关联单号"  size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="报修单号:" prop='repairCode'>
                  <el-input v-model="wxForm.repairCode" placeholder="请输入报修单号"  size="small" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='12'>
                <el-form-item label="报修班组:" prop='chargeTeam'>
                  <el-input v-model="wxForm.chargeTeam" placeholder="请输入报修班组"  size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item label="设备名称:" prop='equipName'>
                    <el-input v-model="wxForm.equipName" placeholder="请输入设备名称"  size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
              <el-col :span='12'>
                <el-form-item label="设备型号:" prop='modelNum'>
                  <el-input v-model="wxForm.modelNum" placeholder="请输入设备型号"  size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item label="设备编号:" prop='equipNum'>
                    <el-input v-model="wxForm.equipNum" placeholder="请输入设备编号"  size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='12'>
                <el-form-item label="报修人:" prop='equipPerson'>
                  <el-input v-model="wxForm.equipPerson" placeholder="请输入报修人"  size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item label="安装位置:" prop='installPosition'>
                    <el-input v-model="wxForm.installPosition" placeholder="请输入安装位置"  size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='12'>
                <el-form-item label="报修时间:" prop='equipNum'>
                    <el-input v-model="wxForm.equipNum" placeholder="请输入报修时间"  size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item label="故障反应:" prop='failureResponse'>
                    <el-input v-model="wxForm.failureResponse" placeholder="请输入故障反应"  size="small"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='12'>
                <el-form-item label="维修种类:" prop='repairType'>
                  <el-select size="small" style="width:100%" v-model='wxForm.repairType' clearable>
                                <el-option
                                    v-for="item in wxzlOption"
                                    :key="item.value"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item label="维修开始时间:" prop='repairStartTime'>
                  <el-date-picker
                                v-model="wxForm.repairStartTime"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style='width:100%'
                                placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='12'>
                <el-form-item label="维修结束时间:" prop='repairEndTime'>
                  <el-date-picker
                                v-model="wxForm.repairEndTime"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style='width:100%'
                                placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item label="更换配件:" prop='replacementParts'>
                    <el-input v-model="wxForm.replacementParts" placeholder="请输入更换配件"  size="small" />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='12'>
                <el-form-item label="维修内容:" prop='repairContent'>
                    <el-input v-model="wxForm.repairContent" placeholder="请输入维修内容"  size="small" />
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item label="维修方式:" prop='repairMode'>
                  <el-select size="small" style="width:100%" v-model='wxForm.repairMode'>
                      <el-option
                      v-for="item in wxfsOption"
                      :key="item.dictKey"
                      :label="item.dictValue"
                      :value="item.dictKey">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='12' v-show="hk">
                <el-form-item label="维修人员:" prop='repairUserList'>
                  <el-select v-model="wxForm.repairUserList" placeholder="搜索并选择维修人员" clearable multiple size="small" style="width:100%" filterable>
                              <el-option
                                v-for="item in userList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                <span style="float: left">{{ item.label}} ({{item.account}})-{{item.deptName}}</span>
                              </el-option>
                            </el-select>
                </el-form-item>
            </el-col>
            <el-col :span='12'  v-show="hk">
                <el-form-item label="维修负责人:" prop='repairCharge'>
                  <el-select size="small" style="width:100%" v-model='wxForm.repairCharge' clearable>
                                <el-option
                                v-for="item in userList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                <span style="float: left">{{ item.label}} ({{item.account}})-{{item.deptName}}</span>
                              </el-option>
                            </el-select>
                </el-form-item>
            </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="bxSubmit('ruleForm')" size="small" icon="el-icon-check">提交流程</el-button>
          <el-button @click="bxClose('ruleForm')" size="small" icon="el-icon-close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="点检登记"
      v-dialog
      :visible.sync="djdj"
      width="70%"
      append-to-body
    >
      <el-form  label-width="80px"  :model='djForm'>
        <el-row>
            <el-col :span='12'>
                <el-form-item label="点检单号:" prop='checkOrderNo'>
                    <el-input v-model="djForm.checkOrderNo"  size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="设备名称:" prop='equipName'>
                  <el-input v-model="djForm.equipName"   size="small" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
              <el-col :span='12'>
                <el-form-item label="设备型号:" prop='modelNum'>
                  <el-input v-model="djForm.modelNum"   size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item label="安装位置:" prop='installPosition'>
                    <el-input v-model="djForm.installPosition"  size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
              <el-col :span='24'>
                <el-form-item label="负责班组:" prop='chargeTeam'>
                  <el-input v-model="djForm.chargeTeam"   size="small" :disabled="true"/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='24'>
                <el-form-item label="备注:">
                  <el-input type="textarea" v-model='rightList.remarks' rows="3" placeholder="请输入"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='24'>
                <el-form-item label="附件上传:">
                  <fileUpload :data.sync="rightList.affixUpload"></fileUpload>
                </el-form-item>
            </el-col>
        </el-row>
      </el-form>
      <template>
        <el-table
          :data="rightList.standardList"
          :row-class-name="tableRowClassName"
          max-height='500'
          border size='small'
          style="width: 100%">
          <el-table-column
            label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="judgeBasic"
            label="基础判断">
          </el-table-column>
          <el-table-column
            prop="checkMethod"
            label="判断方法">
          </el-table-column>
          <el-table-column label="是否正常" prop='isNormal' width="50">
            <template slot-scope="scope"  style="text-align:center">
                <el-checkbox v-model="scope.row.isNormal" style="margin:0;"></el-checkbox>
            </template>
        </el-table-column>
        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit" size="small" icon="el-icon-check">点检完成</el-button>
        <el-button @click="djdj = false" size="small" icon="el-icon-close">取 消</el-button>
      </span>
    </el-dialog>
     <el-dialog
      v-dialog
      :fullscreen="fullscren"
      title="点检查看"
      v-if="djView"
      :visible.sync="djView"
      class='avue-dialog'
      width="75%"
      top='8vh'
      ref="dialog"
      append-to-body
      :close-on-click-modal='false'
      :close-on-press-escape="false"
     >
        <div slot="title" class="avue-crud__dialog__header">
              <span class="el-dialog__title">点检查看</span>
              <div class="avue-crud__dialog__menu">
                <i
                  @click="handleFullScreen"
                  class="el-dialog__close el-icon-full-screen"
                ></i>
              </div>
            </div>
            <div style="height:75vh;overflow-y:auto;overflow-x: hidden;padding:20px;">
                <el-form  label-width="100px"  :model='djViewForm' class="sx_formItem">
         <el-row>
           <el-col :span='12'>
             <el-form-item label="点检单号:" >
               <el-input v-model="djViewForm.checkOrderNo"  size="small" :disabled="true"/>
             </el-form-item>
           </el-col>
           <el-col :span='12'>
             <el-form-item label="设备名称:" >
               <el-input v-model="djViewForm.equipName"   size="small" :disabled="true"/>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span='12'>
             <el-form-item label="设备编号:">
               <el-input v-model="djViewForm.equipNum"   size="small" :disabled="true"/>
             </el-form-item>
           </el-col>
           <el-col :span='12'>
             <el-form-item label="设备型号:" >
               <el-input v-model="djViewForm.modelNum"  size="small" :disabled="true"/>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span='12'>
             <el-form-item label="安装位置:" >
               <el-input v-model="djViewForm.installPosition"  size="small" :disabled="true"/>
             </el-form-item>
           </el-col>
           <el-col :span='12'>
             <el-form-item label="点检人:">
               <el-input v-model="djViewForm.userNow"  size="small" :disabled="true"/>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span='12'>
             <el-form-item label="点检时间:">
               <el-input v-model="djViewForm.checkNow"   size="small" :disabled="true"/>
             </el-form-item>
           </el-col>
           <el-col :span='12'>
             <el-form-item label="负责班组:">
               <el-input v-model="djViewForm.chargeTeamName"   size="small" :disabled="true"/>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span='12'>
             <el-form-item label="班组负责人:">
               <el-input v-model="djViewForm.chargeUserName"   size="small" :disabled="true"/>
             </el-form-item>
           </el-col>
           <el-col :span='12'>
             <el-form-item label="结论:">
               <el-input v-model="djViewForm.checkConclusion"   size="small" :disabled="true"/>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span='24'>
             <el-form-item label="备注:">
               <el-input type="textarea" v-model='djViewForm.remarks' rows="3" :disabled="true"></el-input>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row style='margin-bottom:2px;padding: 0 5px;background:#fff;'>
           <el-col :span="24" style='text-align:left'>
             <el-form-item label="附件:">
               <el-upload
                 class="upload-demo"
                 action='aaa'
                 :disabled="true"
                 :on-preview="handlePreview"
                 :file-list="fileList"
               >
               </el-upload>
             </el-form-item>
           </el-col>
         </el-row>
       </el-form>
       <el-table :data="djViewForm.checkRegisterVOList" max-height='500' border size='small' class="sx_checkTab" :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}" :cell-style="{'text-align':'center'}">
         <el-table-column label='序号' type='index' width="50"></el-table-column>
         <el-table-column label="点检部位" prop='changePosition'>
           <template slot-scope="scope">{{ scope.row.standard.changePosition }}</template>
         </el-table-column>
         <el-table-column label="判断基础" prop='judgeBasic'>
           <template slot-scope="scope">{{ scope.row.standard.judgeBasic }}</template>
         </el-table-column>
         <el-table-column label="判断方法" prop='checkMethod'>
           <template slot-scope="scope">{{ scope.row.standard.checkMethod }}</template>
         </el-table-column>
         <el-table-column label="是否正常" prop='isNormal' width="100">
           <template slot-scope="scope">
             <el-checkbox v-model="scope.row.isNormal" style="margin:0;" :disabled="true"></el-checkbox>
           </template>
         </el-table-column>
       </el-table>
       <span slot="footer" class="dialog-footer" style="float:right;margin-top:10px;">
        <el-button @click="djView = false" size="small" icon="el-icon-close">取 消</el-button>
      </span>
            </div>
     </el-dialog>
   </basic-container>
</template>
<script>
import { checkList, detailSingle, getRegister,checkFinish,modelByName,detail ,getNo,djAdd,getSpotCheck} from "@/api/biz/sbgl";
import { getAll } from "@/api/flow/flow";
import {startFlow ,uploadList} from '@/api/tool/dynamic'
import { getDictBizByCode } from "@/api/system/dict";
import { mapGetters } from "vuex";
import fileUpload from "@/components/fileUpload";
import {getToken} from '@/util/auth';
import {dateFormat} from "@/util/date";
export default {
  components: {
    fileUpload
  },
  data() {
    return {
      rules:{
        failureResponse:[
          { required: true, message: '请输入故障反应', trigger: 'blur' }
        ],
        repairStartTime:[
          { required: true, message: '请输入维修开始时间', trigger: 'blur' }
        ],
        repairEndTime:[
          { required: true, message: '请输入维修结束时间', trigger: 'blur' }
        ],
        repairContent:[
          { required: true, message: '请输入维修内容', trigger: 'blur' }
        ],
      },
      fullscren:false,
      hk:false,
      wxzlOption:[],
      wxfsOption:[],
      dataId:'',
      num: 0,
      rightList: {},
      djForm: {},
      fileList:[],
      userList: [],
      //查询参数
      djdj: false,
      printize: false,
      djView:false,
      wxForm: {},
      selectQuery: {},
      djViewForm:{
        checkRegisterList:[]
      },
      searchOption: {
        rows: [
          [
            {
              type: "input",
              queryType: "1",
              prop: "equipName",
              label: "设备名称:",
              placeholder: "请输入设备名称"
            },
            {
              type: "input",
              queryType: "1",
              prop: "equipNum",
              label: "设备编号:",
              placeholder: "请输入设备编号"
            }
          ],
          [
            {
              type: "input",
              queryType: "1",
              prop: "chargeTeam",
              label: "负责班组:",
              placeholder: "请输入负责班组"
            },
            {
              type: "date",
              queryType: "2",
              prop: "checkNow",
              label: "实际点检时间:",
              placeholder: "实际点检时间"
            },
            {
              type: "date",
              queryType: "2",
              prop: "createTime",
              label: "创建时间:",
              placeholder: "创建时间"
            },
            {
              type: "checkbox",
              prop: "checkConclusion",
              label: "结论:",
              placeholder: "结论",
              list: [
                {
                  label: "未点检",
                  value: 1
                },
                {
                  label: "已点检",
                  value: 2
                },
                {
                  label: "异常",
                  value: 3
                }
              ],
            }
          ]
        ]
      },
      clickquery: "",
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      data: [],
      option: {
        viewBtn:false,
        editBtn:false,
        addBtn:true,
        delBtn:false,
        menuWidth:120,
        tip: false,
        page: true,
        index: true,
        refreshBtn: false,
        border: true,
        columnBtn: false,
        cancelBtn: false,
        selection: true,
        searchBtn: false,
        deleteBtn:false,
        stripe: true,
        selectClearBtn: false,
        reserveSelection: true,
        align: "center",
        menuAlign: "center",
        headerAlign: "center",
        labelWidth: 120,
        column: [
          {
            label: "点检单号",
            prop: "checkOrderNo",
            width:120,
            addDisplay:false,
            editDisplay:false,
          },
          {
            label: "设备名称",
            prop: "equipName",
            width:200,
            addDisplay:false,
            editDisplay:false,
          },
          {
            label: "设备编号",
            prop: "equipNum",
            addDisplay:true,
            editDisplay:false,
          },
          {
            label: "设备型号",
            prop: "modelNum",
            width:200,
            addDisplay:false,
            editDisplay:false,
          },
          {
            label: "安装位置",
            prop: "installPosition",
            width:200,
            addDisplay:false,
            editDisplay:false,
          },
          {
            label:'点检人',
            prop:'userNow',
            width:70,
            type: "select",
            dicUrl: "/api/blade-user/getAll",
            filterable: true,
            addDisplay:false,
            editDisplay:false,
            props: {
              label: "realName",
              value: "id"
            }
          },
          {
            label:'点检时间',
            prop:'checkNow',
            addDisplay:false,
            editDisplay:false,
            width:150,
            type: "date",
          },
          {
            label: "负责班组",
            prop: "chargeTeamName",
            width:130,
            type: "select",
            dicUrl: "/api/blade-user/getAll",
            filterable: true,
            addDisplay:false,
            editDisplay:false,
            props: {
              label: "realName",
              value: "id"
            }
          },
          {
            label:'班组负责人',
            prop:'chargeUserName',
            type: "select",
            width:70,
            dicUrl: "/api/blade-user/getAll",
            filterable: true,
            addDisplay:false,
            editDisplay:false,
            props: {
              label: "realName",
              value: "id"
            }
          },
          {
            label:'创建时间',
            prop:'createTime',
            width:140,
            type: "select",
            dicUrl: "/api/blade-user/getAll",
            filterable: true,
            addDisplay:false,
            editDisplay:false,
            props: {
              label: "realName",
              value: "id"
            }
          },
          {
            label: "结论",
            prop: "checkConclusion",
            type: "select",
            dicData: [
              {
                label: "未点检",
                value: 1
              },
              {
                label: "已点检",
                value: 2
              },
              {
                label: "异常",
                value: 3
              }
            ],
            slot: true
          },
          {
            label:'审批状态',
            prop:'flowStatus',
            type: "select",
            addDisplay:false,
            dicUrl:`/api/blade-system/dict/dictionary?code=flow_status`,
            props:{
              label:'dictValue',
              value:'dictKey'
            },
          },
        ]
      }
    };
  },
  methods: {
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
    search(val) {
      this.selectQuery = val;
      this.loading = true;
      let obj = {
        current: this.clickquery == 1 ? this.page.currentPage : 1,
        size: this.page.pageSize,
        extQueryList: [
          {
            field: "equipName",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.equipName,
                upperValue: ""
              }
            ]
          },
          {
            field: "equipNum",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.equipNum,
                upperValue: ""
              }
            ]
          },
          {
            field: "chargeTeam",
            expressionList: [
              {
                operator: "EQ",
                lowerValue: val.chargeTeam,
                upperValue: ""
              }
            ]
          },
          {
            field: "checkNow",
            dataFormat:'yyyy-MM-dd',
            expressionList: [
              {
                operator: "BT",
                lowerValue: val.checkNow?val.checkNow[0]:"",
                upperValue: val.checkNow?val.checkNow[1]:""
              }
            ]
          },
          {
            field: "createTime",
            dataFormat:'yyyy-MM-dd',
            expressionList: [
              {
                operator: "BT",
                lowerValue: val.createTime?val.createTime[0]:"",
                upperValue: val.createTime?val.createTime[1]:""
              }
            ]
          },
          {
            field: "checkConclusion",
            expressionList: [
              {
                operator: "IN",
                lowerValue: val.checkConclusion,
                upperValue: ""
              }
            ]
          }
        ]
      };
      checkList(obj).then(res => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
      });
      this.clickquery = "";
    },
    api() {
      this.loading = true;
      var obj = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        extQueryList: []
      };
      checkList(obj).then(res => {
        this.data = res.data.data.records;
        this.data.forEach(item=>{
            item.chargeTeam=item.chargeTeamName
            item.chargeUser=item.chargeUserName
          })
        this.loading = false;
        this.page.total = res.data.data.total;
      });
    },
    rowSave(row, done, loading) {
      getNo(row.equipNum).then((res)=>{
        // 验证设备是否报废
        if ((res.data.code = 200)) {
          if(!res.data.data){
            this.$message({
              type: "error",
              message: "没找到"+row.equipNum+" 设备"
            });
            loading();
            return;
          }
          let scrapDate = res.data.data.scrapDate;
          if (scrapDate) {
            let now = dateFormat(new Date(), 'yyyy-MM-dd');
            if (now > scrapDate) {
              this.$message({
                type: "error",
                message: "设备已经超过报废期，不能点检"
              });
              loading();
              return;
            }
          }
        }
        djAdd(row).then(
          () => {
            this.api();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            done();
          },
          error => {
            window.console.log(error);
            loading();
          }
        );
      },(res)=>{
        loading();
      });
    },
    rowUpdate(row, index, done, loading) {
      djAdd(row).then(
        () => {
          this.api();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.api();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    //报修数据
    showDjView(row){
      getSpotCheck(row.id).then(res => {
        if (res.data.code == "200") {
          this.djViewForm = res.data.data;
          if(this.djViewForm.checkConclusion=="1"){
            this.djViewForm.checkConclusion="未点检";
          }
          if(this.djViewForm.checkConclusion=="2"){
            this.djViewForm.checkConclusion="已点检";
          }
          if(this.djViewForm.checkConclusion=="3"){
            this.djViewForm.checkConclusion="异常";
          }
          if (this.djViewForm.checkRegisterVOList.length > 0) {
            this.djViewForm.checkRegisterVOList.forEach(item => {
              if (item.isNormal == 1) {
                item.isNormal = true;
              } else {
                item.isNormal = false;
              }
            });
          }
          this.loadFile(this.djViewForm.id);
        } else {
          this.$message.error("数据获取失败");
        }
      });
      this.djView = true;
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    rowStyle(){
      return 'height: 35px';
    },
    cellStyle(){
      return 'padding: 0';
    },
    //当前页
    currentChange(currentPage) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.search(this.selectQuery);
    },
    //当前条数
    sizeChange(pageSize) {
      this.clickquery = 1;
      this.page.currentPage = currentPage;
      this.search(this.selectQuery);
    },
    //点检登记
    dianden() {
      if (this.selectionList.length == 1) {
        this.djdj = true;
        this.getData(this.selectionList[0].id);
      } else {
        this.$message({
          message: "请选择一条数据",
          type: "warning"
        });
      }
    },
    //点检登记数据
    getData(a) {
      detailSingle(a).then(res => {
        if (res.data.code == "200") {
          this.djForm = res.data.data;
          this.getRight(this.selectionList[0].equipNum, res.data.data.id);
        } else {
          this.$message.error("数据获取失败");
        }
      });
    },
    getRight(a, b) {
      getRegister(a, b).then(res => {
        if (res.data.code == "200") {
          this.rightList = res.data.data;
          this.rightList.standardList.forEach(item => {
            if (item.isNormal == 1) {
              item.isNormal = true;
            } else {
              item.isNormal = false;
            }
          });
        } else {
          this.$message.error("数据获取失败");
        }
      });
    },
    bxClose(formName){
      this.printize = false
      this.$refs[formName].resetFields();
    },
    //点检提交流程
    submit() {
      this.num += 1;
      if (this.num == 1) {
        this.$confirm("进行二次确认, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.rightList.checkRegisterVOList.forEach((item, index) => {
              if (item.isNormal == true) {
                item.isNormal = 1;
              } else {
                item.isNormal = 0;
              }
            });
            checkFinish(this.rightList).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "点检完成!"
                });
                this.getModel("DART_DJ",1);
                this.dataId = res.data.data;
                this.getData(this.selectionList[0].id);
                this.num = 0;
                this.rightList.standardList.forEach(item => {
                  if (item.isNormal == 1) {
                    item.isNormal = true;
                  } else {
                    item.isNormal = false;
                  }
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消点检"
            });
            this.num = 0;
          });
      }
    },
    //获取模型Id
        getModel(a,b){
            modelByName(a).then(res=>{
                if(res.data.code==200){
                  if(b==1){
                    this.startFlow(res.data.data.id)
                  }
                  if(b==2){
                    this.startFlowBx(res.data.data.id)
                  }
                }

            })
        },
        //点检启动流程
        startFlow(a){
            startFlow({
                        flowKey:'SBGL_DJ_DART',
                        formType:'S',
                        modelId:a,
                        dataId:this.dataId,
                        variables: {
                          functionPath:this.$route.fullPath
                        }
                    }).then(res=>{
                        if(res.data.code=200){
                            this.$message({
                                type: "success",
                                message: res.data.msg
                            });
                            this.printize=false
                            this.djdj=false
                        }
                 })
        },
    //提示行
    tableRowClassName({ row, rowIndex }) {
      if (!row.isNormal && this.num == 1) {
        return "danger-row";
      }
    },
    //报修班组
    getUserList() {
      getAll().then(res => {
        this.userList = res.data.data;
        this.userList.forEach(ele => {
          (ele.label = ele.realName), (ele.value = ele.id);
        });
      });
    },
    //维修方式
    wxtype(a) {
      getDictBizByCode(a).then(res => {
        this.wxfsOption = res.data.data;
      });
    },
    //维修种类
    wxzl(a) {
      getDictBizByCode(a).then(res => {
        this.wxzlOption = res.data.data;
      });
    },
    //上传附件
    loadFile(dataId) {
      let obj = {
        dataId: dataId,
        dataSrcId: "DART_DJ",
        affixType: "DART_DJ#AFFIX_UPLOAD"
      };
      this.fileList = [];
      uploadList(obj).then(res => {
        if (res.data.data.length > 0) {
          res.data.data.forEach(ele => {
            this.fileList.push({
              name: ele.originalFileName,
              fileId: ele.id,
              affixType: ele.affixType,
              dataSrcId: ele.dataSrcId,
              dataId: this.mainId,
              isEdit: 0
            });
          });
        }
      });
    },
    handlePreview(file) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&dataId=${file.dataId || ""}&affixId=${file.fileId ||
        file.raw.fileId}&dataSrcId=${file.dataSrcId ||
        ""}&affixType=${file.affixType || ""}`
      );
    },
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.client_add),
        viewBtn: this.vaildData(this.permission.client_view),
        delBtn: this.vaildData(this.permission.client_delete),
        editBtn: this.vaildData(this.permission.client_edit)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  created() {
    this.api();
  }
};
</script>

<style lang="scss" scoped>
.sx_checkTab{
  .el-table__header-wrapper{
    border-bottom: 1px solid rgb(235,238,245)
  }
  .cell{
    text-align: center;
  }
}
.el-form-item__content{
  line-height: 0;
}
</style>
