<template>
    <div  style="width:100%;height:100%;display: flex;flex-direction: column;"  class="sx_sj">
            <div style='width:100%' v-if='headShow'>
                <van-nav-bar
                title="测试委托单"
                left-arrow
                @click-left="onClickLeft"
                />
            </div>
            <div style='flex:1;overflow:auto'>
                <div style='width:100%;height:50px'>
                    <el-button-group style='width:100%;margin:0;height:100%' class="sx_equip_btns">
                        <el-button class='btn1 active' size='small' style='width:50%;border-top-left-radius:7px;border-bottom-left-radius:7px;height:100%;fonst-size:15px' @click="tabs(1)">委托信息</el-button>
                        <el-button class='btn2' size='small' style='width:50%;border-top-right-radius:7px;border-bottom-right-radius:7px;height:100%;fonst-size:15px' @click="tabs(2)">测试记录</el-button>
                    </el-button-group>
                </div>
                <div style="width:100%" v-show="disvis==true">
                    <el-row style="width:100%;margin:0;border-radius:5px;">
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                            <span style="float:left">申请出具报告</span>
                            <span style="float:right">{{dataList.testType}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                            <span style="float:left">委托单号</span>
                            <span style="float:right">{{dataList.entrustCode}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                            <span style="float:left;">委托部门</span>
                            <span style="float:right">{{dataList.entrustDeptName}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                            <span style="float:left">计划期</span>
                            <span style="float:right">{{dataList.planPeriod}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                            <span style="float:left">合同号</span>
                            <span style="float:right">{{dataList.contractNum}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                            <span style="float:left">风机型号</span>
                            <span style="float:right">{{dataList.fanModel}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                            <span style="float:left">风机数量(台)</span>
                            <span style="float:right">{{dataList.fanTotal}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                            <span style="float:left">产品编号</span>
                            <span style="float:right">{{dataList.productCode}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                            <span style="float:left">供应商</span>
                            <span style="float:right">{{dataList.supplier}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;" v-if="requiredB">
                            <span style="float:left">生产厂家</span>
                            <span style="float:right">{{dataList.factoryName}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;" v-if="requiredB">
                            <span style="float:left">炉号</span>
                            <span style="float:right">{{dataList.heatNumber}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;" v-if="requiredB">
                            <span style="float:left">样品名称</span>
                            <span style="float:right">{{dataList.templateName}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;" v-if="requiredB">
                            <span style="float:left">规格型号</span>
                            <span style="float:right">{{dataList.modelNum}}</span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                            <span style="float:left;width:30%;text-align:left;line-height:32px;">风机类型</span>
                            <span style="float:left;width:70%;">
                                <el-select v-model="dataList.fanType" size="small" placeholder="请选择风机类型" disabled>
                                        <el-option
                                            v-for="item in fanTypeOption"
                                            :key="item.dictKey"
                                            :label="item.dictValue"
                                            :value="item.dictKey">
                                        </el-option>
                                    </el-select>
                            </span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;" v-if="weiy">
                            <span style="float:left;width:30%;text-align:left;line-height:32px;"><span style="font-size:15px;color:red">*</span>是否需要委外</span>
                            <span style="float:left;width:70%;">
                                <el-select v-model="dataList.isOutSource " size="small" placeholder="请选择是否委外" @change="isOutSourceChange" :disabled="sourceDis">
                                      <el-option label="需要" value="1"></el-option>
                                      <el-option label="不需要" value="2"></el-option>
                                </el-select>
                            </span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;" v-if="cesren">
                            <span style="float:left;width:30%;text-align:left;line-height:32px;"><span style="font-size:15px;color:red" v-if="nodeAlias=='3'">*</span>测试人员</span>
                            <span style="float:left;width:70%;">
                                <el-select size="small" v-model="dataList.testPeopleId"  filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="gettestPeopleId"  style="width:100%" :disabled="csDis">
                                  <el-option
                                      v-for="item in testPeopleIdOption"
                                      :key="item.id"
                                      :label="item.realName"
                                      :value="item.id">
                                  </el-option>
                              </el-select>
                            </span>
                        </el-col>
                        <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;" v-if="jhsyrq">
                            <span style="float:left;width:30%;text-align:left;line-height:32px;"><span style="font-size:15px;color:red" v-if="nodeAlias=='3'">*</span>计划试验日期</span>
                            <span style="float:left;width:70%;">
                                <el-date-picker
                                    :disabled="jhDis"
                                    v-model="dataList.planTestDate"
                                    type="datetime"
                                    size='small'
                                    format='yyyy-MM-dd'
                                    value-format='yyyy-MM-dd'
                                    style='width:100%'
                                    placeholder="选择计划试验日期">
                                </el-date-picker>
                            </span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:9px 10px;margin-bottom:1px;" class="textare">
                            <p>检测目的</p>
                            <p>
                                <el-input type='textarea'  rows='3' maxlength="100" show-word-limit v-model="dataList.testPurpose"  size='small' disabled></el-input>
                            </p>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:9px 10px;margin-bottom:1px;" class="textare">
                            <p>试验要求</p>
                            <p>
                                <el-input type='textarea'  rows='3' maxlength="100" show-word-limit v-model="dataList.testRequire"  size='small' disabled></el-input>
                            </p>
                        </el-col>    
                        <el-col style="background:rgb(242, 242, 242);padding:9px 10px;margin-bottom:1px;" class="textare">
                            <p>判定依据</p>
                            <p>
                                <el-input type='textarea'  rows='3' maxlength="100" show-word-limit v-model="dataList.pdyjArea"  size='small' disabled></el-input>
                            </p>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:9px 10px;margin-bottom:1px;" class="textare">
                            <p>试验设施</p>
                            <p>
                                <el-select size="small" v-model="dataList.testFacilityIds"  filterable multiple remote reserve-keyword style="width:100%" disabled>
                                  <el-option
                                    v-for="item in testFacilitys"
                                    :key="item.id"
                                    :label="item.facilityName"
                                    :value="item.id">
                                  </el-option>
                                </el-select>
                            </p>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:9px 10px;margin-bottom:1px;" class="textare">
                            <p>备注</p>
                            <p>
                                <el-input type='textarea'  rows='3' maxlength="100" show-word-limit v-model="dataList.otherRequire"  size='small' disabled></el-input>
                            </p>
                        </el-col>
                        <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;" class="textare">
                            <p>附件</p>
                            <p class="files" v-for="(file, index) in fileList" :key="index" @click="handlePreview(file)" style="color:#409eff;margin:5px 0;">
                                <i class="el-icon-document" style="color:#409eff"></i>{{ file.name }}
                            </p>
                        </el-col>
                    </el-row>
                </div>
                <div style="width:100%" v-show="disvis==false">
                    <el-row style="width:100%;margin:0;border-radius:5px;" v-if="csShow">
                        <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;">
                            <span style="float:left;width:30%;text-align:left;line-height:32px;">检测项目</span>
                            <span style="float:left;width:70%;">
                                <el-select size="small" v-model="dataList.checkRecordVO.checkItemIdList" multiple  @change="testChange(0)">
                                    <el-checkbox v-model="checked"
                                      :indeterminate="isIndeterminate"
                                      @change='selectAll'>全选
                                    </el-checkbox>
                                    <el-option
                                        v-for="item in checkOption"
                                        :key="item.id"
                                        :label="item.checkProject"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </span>
                        </el-col>
                        <el-col style="background:rgb(242, 242, 242);padding:15px 10px;margin-bottom:1px;">
                            <span style="float:left">试验记录人</span>
                            <span style="float:right">{{dataList.checkRecordVO.checkPerson}}</span>
                        </el-col>
                        <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;">
                            <span style="float:left;width:30%;text-align:left;line-height:32px;">试验次数</span>
                            <span style="float:left;width:70%;">
                                <el-select v-model="arrList.testTimes" size="small" placeholder="请选择试验次数" @change="testChange(1)">
                                        <el-option
                                            v-for="item in sycsOption"
                                            :key="item.dictKey"
                                            :label="item.dictValue"
                                            :value="item.dictKey">
                                        </el-option>
                                    </el-select>
                            </span>
                        </el-col>
                        <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;">
                            <span style="float:left;width:30%;text-align:left;line-height:32px;">记录序号</span>
                            <span style="float:left;width:70%;">
                                <el-select v-model="arrList.recordTimes" size="small" placeholder="请选择记录序号"  @change="testChange(2)">
                                        <el-option
                                            v-for="item in jlcsOption"
                                            :key="item.dictKey"
                                            :label="item.dictValue"
                                            :value="item.dictKey">
                                        </el-option>
                                    </el-select>
                            </span>
                        </el-col>
                        <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;">
                            <span style="float:left;width:30%;text-align:left;line-height:32px;">记录时间</span>
                            <span style="float:left;width:70%;">
                              <el-date-picker
                                v-model="arrList.recordDate"
                                type="datetime"
                                size='small'
                                format='yyyy-MM-dd HH:mm:ss'
                                value-format='yyyy-MM-dd HH:mm:ss'
                                style="width:100%"
                                placeholder="选择记录时间">
                              </el-date-picker>
                            </span>
                        </el-col>
                        <el-col style="background:#fff;padding:15px 10px;margin-bottom:7px;" v-for="(item,index) in arrList.itemDetailVOS" :key="index">
                            <h4>{{item.testTitle}}</h4>
                            <li style='width:100%;list-style:none;margin-bottom:5px;height:32px;' v-for="(ele,inded) in item.checkItemDetailVOS" :key="inded">
                                <span style="float:left;width:30%;text-align:left;line-height:32px;">{{ele.itemParam}}:</span>
                                <span style="float:left;width:70%;">
                                    <el-input size='small' v-model='ele.itemParamValue'></el-input>
                                </span>
                            </li>
                        </el-col>
                        <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;">
                            <span style="float:left;width:30%;text-align:left;line-height:32px;">合格确认</span>
                            <span style="float:left;width:70%;">
                                <el-select size="small" v-model="arrList.isStandard">
                                    <el-option label="合格" value="1"></el-option>
                                    <el-option label="不合格" value="2"></el-option>
                                </el-select>
                            </span>
                        </el-col>
                        <el-col style="background:#fff;padding:9px 10px;margin-bottom:1px;" class="textare">
                            <p>备注</p>
                            <p>
                                <el-input type='textarea'  rows='3' maxlength="100" show-word-limit v-model="arrList.remarks"  size='small'></el-input>
                            </p>
                        </el-col>
                    </el-row>
                </div>
                <div>
                  <el-row style="width:100%" v-if="subShow">
                        <el-col>
                            <el-button type="primary" size="small" style="width:100%;height:50px;font-size:15px;" @click="rowSave" >保存</el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>
    </div>
</template>
<script>
import {
  detail,
  standardByReportId,
  selectCheck,
  save
} from "@/api/biz/guarantee/orderTicket";
import { getDictBizByCode } from "@/api/system/dict";
import { uploadList } from "@/api/tool/dynamic";
import { getToken } from "@/util/auth";
import website from "@/config/website";
import { addDefaultVaule } from "@/api/biz/crm/xmbd";
import { getUserInfoBySearch } from "@/api/biz/crm/xmbd";
export default {
  props: ["nodeAlias", "detailId", "editFlag"],
  data() {
    return {
      isIndeterminate: false,
      checked: false,
      jhDis: false,
      csDis: true,
      csShow: false,
      sourceDis: false,
      requiredB: false,
      weiy: false,
      cesren: false,
      jhsyrq: false,
      headShow: true,
      subShow: true,
      dataList: {
        checkRecordVO: {
          checkItemIdList: []
        }
      },
      disvis: true,
      testOption: [],
      fanTypeOption: [],
      fileList: [],
      testFacilitys: [],
      sycsOption: [],
      jlcsOption: [],
      checkOption: [],
      testPeopleIdOption: [],
      dataSrcId: "CRM_CSWT",
      affixType: "CRM_CSWT#AFFIX_UPLOAD",
      mainId: "",
      arrList: {
        recordTimes: "1",
        testTimes: "1",
        isStandard: ""
      }
    };
  },
  methods: {
    getList(id) {
      this.testPeopleIdOption = [];
      this.mainId = id;
      this.init();
      detail(id).then(res => {
        this.dataList = res.data.data;
        if (this.dataList.judgeBasic == 1) {
          this.dataList.pdyjArea = "按试验大纲执行";
          if (this.dataList.specialRequire == 1) {
            this.dataList.pdyjArea =
              "按试验大纲执行;       " + this.dataList.requireContent;
          }
        } else {
          this.dataList.pdyjArea = this.dataList.requireContent;
        }
        if (
          this.dataList.checkRecordVO.checkTimeVOS &&
          JSON.stringify(this.dataList.checkRecordVO.checkTimeVOS) != "{}"
        ) {
          this.arrList = this.dataList.checkRecordVO.checkTimeVOS;
        }
        this.checkSearch();
        if (res.data.data.testPeopleId != "") {
          this.testPeopleIdOption.push({
            realName: res.data.data.testPeopleName,
            id: res.data.data.testPeopleId
          });
        }
        addDefaultVaule("CRM_CSWT").then(res => {
          this.$set(
            this.dataList.checkRecordVO,
            "checkPerson",
            res.data.data.CREATE_USER_NAME
          );
        });
        if (this.dataList.testFacilityIds.length > 0) {
          this.testFacilitys = this.dataList.testFacilityObjs;
        }
        if (this.dataList.testCode == "B") {
          this.requiredB = true;
        } else {
          this.requiredB = false;
        }
        if (this.nodeAlias != "1") {
          if (this.dataList.isOutSource && this.dataList.isOutSource == "2") {
            this.cesren = true;
          }
        }
      });
    },
    selectAll() {
      this.dataList.checkRecordVO.checkItemIdList = [];
      if (this.checked) {
        this.checkOption.map(item => {
          this.dataList.checkRecordVO.checkItemIdList.push(item.id);
        });
        this.isIndeterminate = false;
        this.testChange(0);
      } else {
        this.dataList.checkRecordVO.checkItemIdList = [];
        this.isIndeterminate = false;
        this.arrList.itemDetailVOS = [];
        this.$message({
          message: "请选择检测项目",
          type: "warning"
        });
      }
    },
    testChange(i) {
      if (
        this.dataList.checkRecordVO.checkItemIdList.length ===
        this.checkOption.length
      ) {
        this.checked = true;
        this.isIndeterminate = false;
      } else if (
        this.dataList.checkRecordVO.checkItemIdList.length &&
        this.dataList.checkRecordVO.checkItemIdList.length <
          this.checkOption.length
      ) {
        this.checked = false;
        this.isIndeterminate = true;
      } else {
        this.checked = false;
        this.isIndeterminate = false;
      }
      if (
        this.dataList.checkRecordVO.checkItemIdList &&
        this.dataList.checkRecordVO.checkItemIdList.length > 0
      ) {
        selectCheck({
          testTimes: this.arrList.testTimes,
          recordTimes: this.arrList.recordTimes,
          checkRecordId: this.dataList.checkRecordVO.id,
          entrustId: this.dataList.id,
          checkItemIdList: this.dataList.checkRecordVO.checkItemIdList,
          alterTime: i,
          rightFlag: this.arrList.isStandard
        }).then(res => {
          this.arrList = res.data.data;
          if (this.arrList.recordDate == "") {
            addDefaultVaule("CRM_CSWT").then(res => {
              this.$set(this.arrList, "recordDate", res.data.data.CREATE_TIME);
            });
          }
        });
      } else {
        this.arrList.itemDetailVOS = [];
        this.$message({
          message: "请选择检测项目",
          type: "warning"
        });
      }
    },
    rowSave() {
      this.dataList.checkRecordVO.checkTimeVOS = this.arrList;
      save(this.dataList).then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.getList(this.dataList.id);
        }
      });
    },
    gettestPeopleId(query) {
      if (query != "") {
        getUserInfoBySearch(query).then(res => {
          this.testPeopleIdOption = res.data.data;
        });
      } else {
        this.testPeopleIdOption = [];
      }
    },
    isOutSourceChange() {
      this.dataList.testPeopleId = "";
      if (this.dataList.isOutSource == "2") {
        this.cesren = true;
      } else {
        this.cesren = false;
      }
    },
    getFanType() {
      getDictBizByCode("crm_product_type").then(res => {
        this.fanTypeOption = res.data.data;
      });
    },
    getSycs() {
      getDictBizByCode("crm_test_time").then(res => {
        this.sycsOption = res.data.data;
      });
    },
    getJlcs() {
      getDictBizByCode("crm_record_times").then(res => {
        this.jlcsOption = res.data.data;
      });
    },
    init() {
      let obj = {
        dataId: this.mainId,
        dataSrcId: this.dataSrcId,
        affixType: this.affixType
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
              isEdit: 1
            });
          });
        }
      });
    },
    handlePreview(file) {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&affixId=${file.fileId || ""}`
      );
    },
    tabs(old) {
      document.querySelector(".active").classList.remove("active");
      let btn = ".btn" + old;
      document.querySelector(btn).classList.add("active");
      if (old == 1) {
        this.disvis = true;
      } else if (old == 2) {
        this.disvis = false;
      }
    },
    checkSearch() {
      standardByReportId(this.dataList.testTypeId).then(res => {
        this.checkOption = res.data.data;
        if (this.dataList.checkRecordVO.checkItemIdList) {
          if (
            this.dataList.checkRecordVO.checkItemIdList.length ===
            this.checkOption.length
          ) {
            this.checked = true;
            this.isIndeterminate = false;
          } else if (
            this.dataList.checkRecordVO.checkItemIdList.length &&
            this.dataList.checkRecordVO.checkItemIdList.length <
              this.checkOption.length
          ) {
            this.checked = false;
            this.isIndeterminate = true;
          } else {
            this.checked = false;
            this.isIndeterminate = false;
          }
        }
      });
    },
    onClickLeft() {
      window.location.href = "javascript:history.go(-1)";
    }
  },
  created() {
    this.getFanType();
    this.getSycs();
    this.getJlcs();
    if (this.detailId) {
      this.headShow = false;
      this.subShow = this.editFlag;
      this.getList(this.detailId);
    } else {
      this.headShow = true;
      this.subShow = false;
      this.getList(this.$route.query.id);
    }
    if (this.nodeAlias == "2") {
      this.weiy = true;
      this.csDis = false;
      this.jhsyrq = true;
    }
    if (this.nodeAlias == "3") {
      this.weiy = true;
      this.jhsyrq = true;
      this.sourceDis = true;
      this.csDis = false;
      this.jhDis = false;
    }
    if (this.nodeAlias == "4") {
      this.weiy = true;
      this.csShow = true;
      this.sourceDis = true;
      this.jhsyrq = true;
    }
    if (this.nodeAlias == "9") {
      this.jhsyrq = true;
      this.weiy = true;
      this.sourceDis = true;
      this.csShow = true;
    }
    if (this.nodeAlias == "8") {
      this.jhsyrq = true;
      this.weiy = true;
      this.sourceDis = true;
    }
    if (!this.nodeAlias) {
      this.jhsyrq = true;
      this.weiy = true;
      this.sourceDis = true;
      this.csShow = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.sx_sj {
  font-size: 15px;
  color: #000;
  background: rgb(235, 235, 235);
}
.sx_equip_btns {
  .btn1 {
    color: #409eff;
    font-size: 15px !important;
  }
  .btn2 {
    color: #409eff;
    font-size: 15px !important;
  }
  .active {
    background: #409eff !important;
    color: #fff !important;
  }
}

.textare .el-textarea__inner {
  border: none !important;
}
</style>