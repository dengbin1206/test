<template>
    <el-dialog
            v-dialog
            :fullscreen="fullscren"
            :title="title"
            v-if="dialogBfh"
            :visible.sync="dialogBfh"
            class='avue-dialog'
            width="75%"
            top='8vh'
            ref="dialog"
            append-to-body
            :close-on-click-modal='false'
            :close-on-press-escape="false">
            <div slot="title" class="avue-crud__dialog__header">
              <span class="el-dialog__title">{{ title }}</span>
              <div class="avue-crud__dialog__menu">
                <i
                  @click="handleFullScreen"
                  class="el-dialog__close el-icon-full-screen"
                ></i>
              </div>
            </div>
            <div style="height:75vh;overflow-y:auto;overflow-x: hidden;padding:20px;">
                <el-form :model="addList"  :rules="rules" ref="ruleForm" label-width="120px"   class="sx_formItem">
                <el-row :gutter="20">
                    <h4>基本信息</h4>
                    <el-col :span="12">
                        <el-form-item label="申请号:" prop="signNum">
                            <el-input size="small" v-model="addList.signNum" disabled  placeholder="自动生成"></el-input>
                        </el-form-item>
                        <el-form-item label="创建人:" prop="createUserName">
                            <el-input size="small" v-model="addList.createUserName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="回单次数:" prop="repairTimes">
                            <el-select size="small" v-model="addList.repairTimes"placeholder="请选择回单次数" style="width:100%" clearable>
                                <el-option
                                    v-for="item in repairTimess"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="合同运费(元):" prop="contractFreight">
                            <el-input size="small" v-model="addList.contractFreight" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="协议单价(元):" prop="agreementPrice">
                            <el-input size="small" v-model="addList.agreementPrice" placeholder="请输入协议单价" type="number" @input="priceChange"></el-input>
                        </el-form-item>
                        <el-form-item label="重量(T):" prop="weight">
                            <el-input size="small" v-model="addList.weight" placeholder="请输入重量" type="number" @input="priceChange"></el-input>
                        </el-form-item>
                        <el-form-item label="公里数:" prop="kilometers">
                            <el-input size="small" v-model="addList.kilometers" placeholder="请输入公里数" type="number" @input="priceChange"></el-input>
                        </el-form-item>
                        <el-form-item label="协议价(元):" prop="agreementNum">
                            <el-input size="small" v-model="addList.agreementNum" type="number" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="补发货单号:" prop="repairDeliveryNum">
                            <el-input size="small" v-model="addList.repairDeliveryNum" disabled  placeholder="自动生成"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间:" prop="createTime">
                            <el-date-picker
                                disabled
                                v-model="addList.createTime"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="选择审创建时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="回单日期:" prop="repairDate">
                            <el-date-picker
                                v-model="addList.repairDate"
                                type="date"
                                size='small'
                                format='yyyy-MM-dd'
                                value-format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="请选择回单日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="运费已支出(元):" prop="expenseFreight">
                            <el-input size="small" v-model="addList.expenseFreight" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="物流公司:" prop="logisticsCompany">
                            <el-input size="small" v-model="addList.logisticsCompany"></el-input>
                        </el-form-item>
                        <el-form-item label="超出运费:" prop="extendFreight">
                            <el-input size="small" v-model="addList.extendFreight" type="number" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="费用承担部门:" prop="costBearDeptInfo">
                            <el-select size="small" v-model="addList.costBearDeptInfo" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="fycdbm" style="width:100%">
                                <el-option
                                    v-for="item in CostBearDeptIds"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="三超说明:" prop="tripleSuper">
                        <el-input type="textarea" rows="3" size="small" v-model="addList.tripleSuper" placeholder="请输入三超说明"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="费用超出说明:" prop="extendRemarks">
                        <el-input type="textarea" rows="3" size="small" v-model="addList.extendRemarks" placeholder="请输入费用超出说明"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="上传附件:">
                                <el-upload
                                    class="upload-demo"
                                    :http-request="uploadAction"
                                    action="upLoadUrl"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :before-remove="beforeRemove"
                                    :before-upload="beforeUpload"
                                    :on-success="uploadSuccessFile"
                                    :file-list="fileList"
                                    >
                                    <el-button size="small" type="primary" v-if="show">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip"></div>
                                </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <h4>产品信息</h4>
                    <el-col :span="24">
                        <el-table
                            class="sx_htps_cpxx"
                            :data="addList.detailedListVOS"
                            :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                            :cell-style="{'text-align':'center'}"
                            border
                            max-height="370"
                            style="width:100%"
                            size='small'>
                            <el-table-column
                            type='index'
                            width="55">
                            </el-table-column>
                            <el-table-column
                            prop="rowProjectNum"
                            label="原行项目号"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="materialCode"
                            label="物料号"
                            width="200">
                            </el-table-column>
                            <el-table-column
                            prop="materialRemarks"
                            label="物料描述"
                            width="200">
                            </el-table-column>
                            <el-table-column
                            prop="deliveryNum"
                            label="发货数量"
                            width="120">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.deliveryNum" size="small" placeholder="请输入发货数量" type="number"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="isRepairFinish"
                            label="是否补发完成"
                            width="120">
                                <template slot-scope="scope">
                                    <el-select size="small" v-model="scope.row.isRepairFinish"placeholder="请选择是否补发完成" style="width:100%" clearable>
                                        <el-option label="已完成" value="1"></el-option>
                                        <el-option label="未完成" value="2"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="deliveryRemarks"
                            label="发货说明">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.deliveryRemarks" size="small" placeholder="请输入发货说明"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="show" style="float:right">
                <el-button @click="close('ruleForm')" size="small" icon="el-icon-close" >取 消</el-button>
                <el-button type="primary" @click="addBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check">保存</el-button>
            </div>
            </div>
        </el-dialog>
</template>
<script>
import { getDictBizByCode } from "@/api/system/dict";
import { deptByLabel,bfSave ,bfDetail} from "@/api/biz/crm/fhsq";
import { uploadList,asyncUploadAction } from "@/api/tool/dynamic";
export default {
  data() {
    return {
      title:'补发货',
      fullscren:false,
      btnLoading:false,
      show:true,
      dialogBfh: false,
      addList: {},
      dataList: [],
      fileList: [],
      mainId: "",
      dataSrcId: "CRM_SALES_BFH",
      affixType: "CRM_SALES_BFH#AFFIX_UPLOAD",
      repairTimess: [],
      CostBearDeptIds: [],
      rules:{
        weight: [
          { required: true, message: "请输入重量", trigger: "blur" }
        ],
        kilometers: [
          { required: true, message: "请输入公里数", trigger: "blur" }
        ],
        logisticsCompany: [
          { required: true, message: "请选择物流公司", trigger: "blur" }
        ],
        agreementPrice: [
          { required: true, message: "请输入协议单价(公里/元)", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
    open(dialogBfh,addList,detailedList,rowId) {
      this.btnLoading=false
      this.dialogBfh = dialogBfh;
      this.addList={};
      this.dataList=[];
      this.fileList=[];
      this.CostBearDeptIds=[];
      if(rowId==''){
        this.show=true
        this.addList=addList;
        this.addList.detailedListVOS=detailedList
        this.addList.detailedListVOS.forEach(item=>{
          this.$set(item,'deliveryNum','')
          this.$set(item,'isRepairFinish','')
          this.$set(item,'deliveryRemarks','')
          this.$set(item,'rowProjectNum',item.rowProject+item.outCategoryNum)
        })
        this.$set(this.addList,'id','')
      }else{
        this.show=false
        bfDetail(rowId).then(res=>{
          this.addList=res.data.data
          this.mainId=rowId
          this.init()
          if(this.addList.costBearDeptInfo!={}){
            this.CostBearDeptIds.push(this.addList.costBearDeptInfo)
            this.CostBearDeptIds.forEach(item=>{
              item.value = { label: item.label, id: item.id };
            })
          }
        })
      }
    },
    getrepairTimess() {
      getDictBizByCode("crm_repair_times").then(res => {
        this.repairTimess = res.data.data;
      });
    },
    //费用承担部门
    fycdbm(query) {
      if (query != "") {
        deptByLabel(query).then(res => {
          this.CostBearDeptIds = res.data.data;
          this.CostBearDeptIds.forEach(item => {
            item.value = { label: item.label, id: item.id };
          });
        });
      }else{
        this.CostBearDeptIds=[]
      }
    },
    //协议价
    priceChange(){
        delete this.addList.agreementNum
        if(this.addList.weight!==''&&this.addList.kilometers!==''&&this.addList.agreementPrice!==''&&this.addList.weight!==undefined&&this.addList.kilometers!==undefined&&this.addList.agreementPrice!==undefined){
            this.addList.agreementNum=this.addList.weight*this.addList.kilometers*this.addList.agreementPrice
        }
    },
    close(formName){
      this.dialogBfh=false
      this.$refs[formName].resetFields();
      this.addList={}
    },
    //保存
    addBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true
          this.addList.affixUploadList = this.fileList;
          bfSave(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.dialogBfh=false
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
              this.btnLoading=false
            }
          });
        }
      });
    },
    //上传附件
    init() {
      let obj = {
        dataId: this.mainId,
        dataSrcId: this.dataSrcId,
        affixType: this.affixType
      };
      this.fileList = [];
      this.dataList = [];
      uploadList(obj).then(res => {
        if (res.data.data.length > 0) {
          res.data.data.forEach(ele => {
            this.fileList.push({
              name: ele.originalFileName,
              fileId: ele.id,
              affixType: ele.affixType,
              dataSrcId: ele.dataSrcId,
              dataId: this.mainId,
              isEdit: 1
            });
            this.dataList.push({
              fileId: ele.id,
              isDeleted: 0
            });
          });
        }
      });
    },
    uploadAction(param) {
      let fileObj = param.file;
      let form = new FormData();
      form.append("file", fileObj);
      form.append("dataSrcId", this.dataSrcId);
      form.append("affixType", this.affixType);
      asyncUploadAction(form)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("上传成功");
            this.fileList.push({
              name: param.file.name,
              uid: param.file.uid,
              fileId: res.data.data.id,
              affixType: this.affixType,
              dataSrcId: this.dataSrcId,
              fileName: res.data.data.originalFileName
            });
            this.dataList.push({
              fileId: res.data.data.id,
              isDeleted: 0,
              fileName: res.data.data.originalFileName,
              affixType: this.affixType,
              dataSrcId: this.dataSrcId
            });
            param.file.fileId = res.data.data.id;
          }
        })
        .catch(err => {
          param.onError(err);
        });
    },
    handleRemove(file, fileList) {
      this.fileList.forEach(ele => {
        if (file.isEdit == 1) {
          if (ele.fileId == file.fileId) {
            ele.isDeleted = 1;
          }
        } else {
          if (ele.fileId == file.fileId) {
            ele.isDeleted = 1;
          }
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
    beforeRemove(file, fileList) {
      if (file.size / 1024 / 1024 < 30 || file.dataId) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    beforeUpload(file) {
      const fileSize = file.size / 1024 / 1024 < 100;
      if (!fileSize) {
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return fileSize;
    },
    uploadSuccessFile(response, file, fileList) {
      console.log(response);
    }
  },
  created() {
    this.getrepairTimess();
  }
};
</script>
<style scoped>
@import "./xmbdStyle/htps.scss";
</style>
