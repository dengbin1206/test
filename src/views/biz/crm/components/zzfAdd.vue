<template>
    <el-dialog
            v-dialog
            :fullscreen="fullscren"
            :title="title"
            v-if="dialogzzf"
            :visible.sync="dialogzzf"
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
                <el-form :model="addList"  :rules="rules" ref="ruleForm" label-width="130px"   class="sx_formItem">
                <el-row :gutter="20">
                    <h4>基本信息</h4>
                    <el-col :span="12">
                        <el-form-item label="直发单号:" prop="deliveryFormNum">
                            <el-input size="small" v-model="addList.deliveryFormNum" disabled placeholder="自动生成"></el-input>
                        </el-form-item>
                        <el-form-item label="纸质合同号:" prop="paperContractNo">
                            <el-input size="small" v-model="addList.paperContractNo" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="计划期:" prop="planDate">
                            <el-date-picker
                                v-model="addList.planDate"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd'
                                value-format='yyyy-MM-dd'
                                style="width:100%"
                                placeholder="选择计划期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="客户名称:" prop="clientName">
                            <el-input size="small" v-model="addList.clientName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="收货人:" prop="receiveContact">
                            <el-input size="small" v-model="addList.receiveContact" placeholder="请输入收货人"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话:" prop="telephone">
                            <el-input size="small" v-model="addList.telephone"  placeholder="请输入联系电话"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请人:" prop="signPersonInfo">
                            <el-select size="small" v-model="addList.signPersonInfo" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="fzyg" style="width:100%" @change="fzygChange">
                                <el-option
                                    v-for="item in signPersons"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.value">
                                    <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请部门:" prop="departmentName">
                            <el-input size="small" v-model="addList.departmentName" disabled placeholder="申请人带出"></el-input>
                        </el-form-item>
                        <el-form-item label="创建人:" prop="createUserName">
                            <el-input size="small" v-model="addList.createUserName" disabled></el-input>
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
                        <el-form-item label="审批状态:" prop="flowStatus">
                            <el-select size="small" v-model="addList.flowStatus"  placeholder="请选择审批状态"  style="width:100%" clearable disabled>
                                <el-option
                                    v-for="item in statusOption"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审批结束时间:" prop="flowCompletedTime">
                            <el-date-picker
                                v-model="addList.flowCompletedTime"
                                type="datetime"
                                size='small'
                                disabled
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="审批通过自动生成">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="收货地址:" prop="receiveAddress">
                        <el-input size="small" type="textarea" rows="3" v-model="addList.receiveAddress" placeholder="请输入收货地址"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="申请原因及说明:" prop="reasonRemarks">
                        <el-input type="textarea" rows="3" size="small" v-model="addList.reasonRemarks" placeholder="请输入申请原因及说明"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <h4>明细清单</h4>
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
                            prop="buyOrderNum"
                            label="采购订单号"
                            width="150">
                            </el-table-column>
                            <el-table-column
                            prop="buyOrderRow"
                            label="采购订单行号"
                            width="150">
                            </el-table-column>
                            <el-table-column
                            prop="materialCode"
                            label="物料编号"
                            width="150">
                            </el-table-column>
                            <el-table-column
                            prop="materialRemarks"
                            label="物料描述"
                            width="200">
                            </el-table-column>
                            <el-table-column
                            prop="productNum"
                            label="数量"
                            width="120">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.productNum" size="small" placeholder="请输入发货数量" type="number"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="meteringUnit"
                            label="计量单位"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="requireDeliveryDate"
                            label="要求到货日期"
                            width="150">
                                <template slot-scope="scope">
                                    <el-date-picker
                                        v-model="scope.row.requireDeliveryDate"
                                        type="date"
                                        size='small'
                                        format='yyyy-MM-dd'
                                        value-format='yyyy-MM-dd'
                                        style="width:100%"
                                        placeholder="选择要求到货日期">
                                    </el-date-picker>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="actualDeliveryDate"
                            label="实际到货日期"
                            width="150">
                                  <template slot-scope="scope">
                                    <el-date-picker
                                        v-model="scope.row.actualDeliveryDate"
                                        type="date"
                                        size='small'
                                        format='yyyy-MM-dd'
                                        value-format='yyyy-MM-dd'
                                        style="width:100%"
                                        placeholder="选择实际到货日期">
                                    </el-date-picker>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="回单上传:">
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
                                    <el-button size="small" type="primary" v-if='show'>点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip"></div>
                                </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="show" style="float:right">
                <el-button @click="close('ruleForm')" size="small" icon="el-icon-close">取 消</el-button>
                <el-button type="primary" @click="addBtn('ruleForm')" :loading="btnLoading" size="small" icon="el-icon-check">保存</el-button>
            </div>
            </div>
        </el-dialog>
</template>
<script>
import { getDictBizByCode,getDictByCode } from "@/api/system/dict";
import { deptByLabel,zfSave,zfDetail } from "@/api/biz/crm/fhsq";
import { getUserInfoBySearch } from "@/api/biz/crm/xmbd";
import { uploadList,asyncUploadAction } from "@/api/tool/dynamic";
export default {
  data() {
    return {
      fullscren:false,
      title:'转直发',
      btnLoading:false,
      show:true,
      dialogzzf: false,
      addList:{},
      dataList:[],
      fileList:[],
      signPersons:[],
      statusOption:[],
      dataSrcId: "CRM_SALES_ZZF",
      affixType: "CRM_SALES_ZZF#AFFIX_UPLOAD",
      rules:{
        receiveContact: [
          { required: true, message: "请输入收货人", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        signPerson: [
          { required: true, message: "请选择申请人", trigger: "blur" }
        ],
        receiveAddress: [
          { required: true, message: "请输入收货地址", trigger: "blur" }
        ],
        reasonRemarks: [
          { required: true, message: "请输入申请原因及说明", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleFullScreen() {
      this.$refs.dialog.$refs.dialog.style.cssText = `margin-top: 15vh; width: 75%; top: 0px;`;
      this.fullscren = !this.fullscren;
    },
    open(dialogzzf,addList,detailedList,rowId) {
      this.btnLoading=false
      this.dialogzzf=dialogzzf
      this.addList={}
      this.fileList=[]
      this.signPersons=[]
      if(rowId==''){
        this.show=true
        this.addList=addList
        this.dialogzzf = dialogzzf;
        this.addList.detailedListVOS=detailedList
        this.addList.detailedListVOS.forEach(item=>{
            this.$set(item,'productNum','')
            this.$set(item,'requireDeliveryDate','')
            this.$set(item,'actualDeliveryDate','')
        })
        this.$set(this.addList,'id','')
      }else{
        this.show=false
        zfDetail(rowId).then(res=>{
          this.addList=res.data.data
          this.mainId=rowId
          this.init()
          if(this.addList.signPersonInfo!={}){
            this.signPersons.push(this.addList.signPersonInfo)
            this.signPersons.forEach(item=>{
              let arr = {
                realName: item.realName,
                id: item.id
              };
              item.label = item.realName;
              item.value = arr;
            })
          }
        })
      }
    },
    //申请人
    fzyg(query) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.signPersons = res.data.data;
          this.signPersons.forEach(item => {
            let arr = {
              realName: item.realName,
              id: item.id
            };
            item.label = item.realName;
            item.value = arr;
          });
        });
      } else {
        this.signPersons = [];
      }
    },
    fzygChange() {
      this.signPersons.forEach(item => {
        if (this.addList.signPersonInfo.id == item.id) {
          this.addList.departmentName = item.deptName;
        }
      });
    },
    //审批状态
    getStatus() {
      getDictByCode("flow_status").then(res => {
        this.statusOption = res.data.data;
      });
    },
    close(formName){
      this.dialogzzf=false
      this.$refs[formName].resetFields();
      this.addList={}
    },
    //保存
    addBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading=true
          this.addList.receiptUploadList = this.fileList;
          zfSave(this.addList).then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.dialogzzf=false
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
    this.getStatus()
  }
};
</script>
<style scoped>
@import "./xmbdStyle/htps.scss";
</style>
