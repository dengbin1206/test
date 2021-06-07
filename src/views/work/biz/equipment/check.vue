<template>
  <el-container
    style="background: rgba(249, 249, 249, 1); width: 100%; height: 100%"
  >
    <el-main v-if="pc == false" style="height: 100%">
      <div style="width: 100%; height: 50px">
        <el-button-group
          style="width: 100%; margin: 0; height: 100%"
          class="sx_check_btns"
        >
          <el-button
            class="btn1 active"
            size="small"
            style="
              width: 50%;
              border-top-left-radius: 7px;
              border-bottom-left-radius: 7px;
              height: 100%;
              font-size: 15px;
            "
            @click="tabs(1)"
            >设备信息</el-button
          >
          <el-button
            class="btn2"
            size="small"
            style="
              width: 50%;
              border-top-right-radius: 7px;
              border-bottom-right-radius: 7px;
              height: 100%;
              font-size: 15px;
            "
            @click="tabs(2)"
            >点检登记</el-button
          >
        </el-button-group>
      </div>
      <div style="width: 100%" v-if="disvis == true">
        <el-row style="width: 100%; margin: 0; border: none">
          <el-col
            style="
              background: rgb(245, 245, 245);
              padding: 15px 10px;
              margin-bottom: 1px;
              border-top-left-radius: 7px;
              border-top-right-radius: 7px;
            "
          >
            <span style="float: left">点检单号</span>
            <span style="float: right">{{ conData.checkOrderNo }}</span>
          </el-col>
          <el-col
            style="
              background: rgb(245, 245, 245);
              padding: 15px 10px;
              margin-bottom: 1px;
            "
          >
            <span style="float: left">设备名称</span>
            <span style="float: right">{{ conData.equipName }}</span>
          </el-col>
          <el-col
            style="
              background: rgb(245, 245, 245);
              padding: 15px 10px;
              margin-bottom: 1px;
            "
          >
            <span style="float: left">设备编号</span>
            <span style="float: right">{{ conData.equipNum }}</span>
          </el-col>
          <el-col
            style="
              background: rgb(245, 245, 245);
              padding: 15px 10px;
              margin-bottom: 1px;
            "
          >
            <span style="float: left">设备型号</span>
            <span style="float: right">{{ conData.modelNum }}</span>
          </el-col>
          <el-col
            style="
              background: rgb(245, 245, 245);
              padding: 15px 10px;
              margin-bottom: 1px;
            "
          >
            <span style="float: left">安装位置</span>
            <span style="float: right">{{ conData.installPosition }}</span>
          </el-col>
          <el-col
            style="
              background: rgb(245, 245, 245);
              padding: 15px 10px;
              margin-bottom: 1px;
            "
          >
            <span style="float: left">点检人</span>
            <span style="float: right">{{ conData.userNow }} </span>
          </el-col>
          <el-col
            style="
              background: rgb(245, 245, 245);
              padding: 15px 10px;
              margin-bottom: 1px;
            "
          >
            <span style="float: left">点检时间</span>
            <span style="float: right">{{ conData.checkTime }}</span>
          </el-col>
          <el-col
            style="
              background: rgb(245, 245, 245);
              padding: 15px 10px;
              margin-bottom: 1px;
            "
          >
            <span style="float: left">负责班组</span>
            <span style="float: right">{{ conData.chargeTeamName }} </span>
          </el-col>
          <el-col
            style="
              background: rgb(245, 245, 245);
              padding: 15px 10px;
              margin-bottom: 1px;
            "
          >
            <span style="float: left">班组负责人</span>
            <span style="float: right">{{ conData.chargeUserName }} </span>
          </el-col>
          <el-col
            style="background: #fff; padding: 12px 0px; margin-bottom: 3px"
          >
            <p
              style="
                border-left: 3px solid rgb(55, 96, 149);
                padding: 3px 0px;
                margin: 0;
                font-weight: 600;
              "
            >
              点检部位图示
            </p>
            <span
              v-for="(item, index) in imgList"
              :key="index"
              style="margin: 5px"
            >
              <img
                :src="'data:image/jpeg;base64,' + item.url"
                width="97%"
                alt=""
                style="margin-top: 5px"
              />
            </span>
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%; height: 500px" v-if="disvis == false">
        <div
          style="width: 100%"
          v-for="(item, index) in conData.checkRegisterVOList"
          :key="index"
        >
          <el-row
            style="
              width: 100%;
              padding: 0 5px;
              background: #fff;
              margin-bottom: 2px;
            "
            class="sx_lis"
          >
            <el-col :span="15">
              <p
                style="
                  margin: 6px;
                  font-size: 16px;
                  white-space: nowrap;
                  font-weight: 600;
                "
              >
                {{ item.standard.changePosition }}
              </p>
              <p
                style="
                  margin: 6px;
                  font-size: 14px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                "
              >
                {{ item.standard.judgeBasic }}
              </p>
            </el-col>
            <el-col :span="9">
              <p style="text-align: right; padding-right: 10px; margin: 0 6px">
                {{ item.standard.checkMethod }}
              </p>
              <p style="text-align: right">
                <el-checkbox
                  v-model="item.isNormal"
                  true-label="1"
                  false-label="0"
                  :disabled="!editFlag"
                  :checked="item.isNormal == 1"
                  >正常</el-checkbox
                >
              </p>
            </el-col>
          </el-row>
        </div>
        <el-row style="margin-bottom: 2px; padding: 0 5px; background: #fff">
          <el-col :span="24" style="text-align: left">
            <p>上传附件</p>
            <el-upload
              class="upload-demo"
              :http-request="uploadAction"
              action="null"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :before-upload="beforeUpload"
              :on-success="uploadSuccessFile"
              :file-list="fileList"
            >
              <el-button size="small" type="primary" :disabled="!editFlag"
                >点击上传</el-button
              >
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </el-col>
        </el-row>
        <el-row style="background: #fff; padding: 5px 10px" class="textare">
          <el-col :span="24">备注:</el-col>
          <el-col :span="24">
            <el-input
              type="textarea"
              v-model="conData.remarks"
              rows="3"
              :disabled="!editFlag"
            ></el-input>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin: 10px 0">
        <el-col>
          <el-button
            type="primary"
            size="small"
            v-show="editFlag"
            style="width: 100%; height: 50px; font-size: 15px"
            @click="sub(conData)"
            >保存</el-button
          >
        </el-col>
      </el-row>
    </el-main>
    <el-main v-if="pc == true">
      <el-form label-width="100px" :model="conData" class="sx_formItem">
        <el-row>
          <el-col :span="12">
            <el-form-item label="点检单号:">
              <el-input v-model="conData.checkOrderNo" size="small" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称:">
              <el-input v-model="conData.equipName" size="small" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编号:">
              <el-input v-model="conData.equipNum" size="small" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备型号:">
              <el-input v-model="conData.modelNum" size="small" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="安装位置:">
              <el-input
                v-model="conData.installPosition"
                size="small"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="点检人:">
              <el-input v-model="conData.userNow" size="small" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="点检时间:">
              <el-input v-model="conData.checkNow" size="small" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责班组:">
              <el-input
                v-model="conData.chargeTeamName"
                size="small"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="班组负责人:">
              <el-input
                v-model="conData.chargeUserName"
                size="small"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结论:">
              <el-select
                size="small"
                v-model="conData.checkConclusion"
                style="width: 100%"
                disabled
              >
                <el-option
                  v-for="item in jlOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="24"
            style="background: #fff; padding: 12px 0px; margin-bottom: 3px"
          >
            <p
              style="
                border-left: 3px solid rgb(55, 96, 149);
                padding: 3px 0px;
                margin: 0;
                font-weight: 600;
              "
            >
              点检部位图示
            </p>
            <span
              v-for="(item, index) in imgList"
              :key="index"
              style="margin: 5px"
            >
              <img
                :src="'data:image/jpeg;base64,' + item.url"
                width="8%"
                alt=""
                style="margin-top: 5px"
                @click="look(item)"
              />
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:">
              <el-input
                type="textarea"
                v-model="conData.remarks"
                rows="3"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件上传:">
              <el-upload
                class="upload-demo"
                :http-request="uploadAction"
                action="null"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :before-upload="beforeUpload"
                :on-success="uploadSuccessFile"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <p slot="tip" class="el-upload__tip"></p>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="conData.checkRegisterVOList"
        max-height="500"
        border
        size="small"
        class="sx_checkTab"
      >
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="点检部位" prop="changePosition" width="100">
          <template slot-scope="scope">{{
            scope.row.standard.changePosition
          }}</template>
        </el-table-column>
        <el-table-column label="判断基础" prop="judgeBasic">
          <template slot-scope="scope">{{
            scope.row.standard.judgeBasic
          }}</template>
        </el-table-column>
        <el-table-column label="判断方法" prop="checkMethod">
          <template slot-scope="scope">{{
            scope.row.standard.checkMethod
          }}</template>
        </el-table-column>
        <el-table-column label="是否正常" prop="isNormal" width="50">
          <template slot-scope="scope" style="text-align: center">
            <el-checkbox
              v-model="scope.row.isNormal"
              style="margin: 0"
              true-label="1"
              false-label="0"
              :checked="scope.row.isNormal == 1"
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin: 10px 0">
        <el-col>
          <el-button
            type="primary"
            size="small"
            style="float: right"
            v-show="editFlag"
            @click="sub(conData)"
            >保存</el-button
          >
        </el-col>
      </el-row>
    </el-main>
    <el-dialog
      title="查看点检部位图片"
      :visible.sync="dialogVisible"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <img :src="'data:image/jpeg;base64,' + imgSrc.url" alt="" width="100%" />
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="download"
          size="small"
          icon="el-icon-circle-check"
          >下载</el-button
        >
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import {
  detailSingle,
  checkFinish,
  modelByName,
  singleDownloadByte,
  register,
} from "@/api/biz/sbgl";
import { startFlow } from "@/api/tool/dynamic";
import { getAll } from "@/api/flow/flow";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList } from "@/api/tool/dynamic";
import * as dd from "dingtalk-jsapi";
import { getSpotCheck } from "@/api/biz/sbgl";
import func from "@/util/func";
export default {
  props: ["dataId", "nodeAlias", "editFlag"],
  data() {
    return {
      imgSrc: "",
      dialogVisible: false,
      pc: true,
      disvis: true,
      checked: 1,
      fileItem1: [],
      fileItem2: [],
      equipNum: "",
      checkId: "",
      conData: {},
      rightList: {},
      num: 0,
      dataId: "",
      userList: [],
      fileList: [],
      dataList: [],
      dataSrcId: "DART_DJ",
      affixType: "DART_DJ#AFFIX_UPLOAD",
      imgList: [],
      jlOption: [
        {
          label: "未点检",
          value: 1,
        },
        {
          label: "已点检",
          value: 2,
        },
        {
          label: "异常",
          value: 3,
        },
      ],
    };
  },
  methods: {
    //查看图片
    look(item) {
      this.dialogVisible = true;
      this.imgSrc = item;
    },
    //下载图片
    download() {
      window.open(
        `/api/blade-resource/affix/singleDownload?${
          this.website.tokenHeader
        }=${getToken()}&affixId=${this.imgSrc.id}`
      );
    },
    //保存
    sub(a) {
      a.affixList = this.dataList;
      checkFinish(a).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "保存完成!",
          });
        }
      });
    },
    tabs(old) {
      document.querySelector(".active").classList.remove("active");
      let btn = ".btn" + old;
      document.querySelector(btn).classList.add("active");
      if (old == 1) {
        this.disvis = true;
        this.num = 0;
      } else if (old == 2) {
        this.disvis = false;
      }
    },
    //获取数据
    getLeft(a) {
      getSpotCheck(a).then((res) => {
        if (res.data.code == 200) {
          this.conData = res.data.data;
          this.equipNum = a;
          if (this.conData.fieldIds.length > 0) {
            this.conData.fieldIds.forEach((item) => {
              this.getImg(item);
            });
          }
          this.dataList = res.data.data.affixList;
          this.mainId = res.data.data.id;
          this.init();
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg,
          });
        }
      });
    },
    //点检部位图
    getImg(a) {
      singleDownloadByte(a).then((res) => {
        this.imgList.push({ id: a, url: res.data.data });
      });
    },
    //报修班组负责人
    getUserList() {
      getAll().then((res) => {
        this.userList = res.data.data;
        this.userList.forEach((ele) => {
          (ele.label = ele.realName), (ele.value = ele.id);
        });
      });
    },
    //上传附件
    init() {
      let obj = {
        dataId: this.mainId,
        dataSrcId: this.dataSrcId,
        affixType: this.affixType,
      };
      this.fileList = [];
      this.dataList = [];
      uploadList(obj).then((res) => {
        if (res.data.data.length > 0) {
          res.data.data.forEach((ele) => {
            this.fileList.push({
              name: ele.originalFileName,
              fileId: ele.id,
              affixType: ele.affixType,
              dataSrcId: ele.dataSrcId,
              dataId: this.mainId,
              isEdit: 1,
            });
            this.dataList.push({
              fileId: ele.id,
              isDeleted: 0,
            });
          });
        }
      });
    },
    uploadAction(param) {
      console.log(param);
      let fileObj = param.file;
      let form = new FormData();
      form.append("file", fileObj);
      form.append("dataSrcId", this.dataSrcId);
      form.append("affixType", this.affixType);
      asyncUploadAction(form)
        .then((res) => {
          if (res.data.code == 200) {
            this.$message.success("上传成功");
            this.fileList.push({
              name: param.file.name,
              uid: param.file.uid,
              fileId: res.data.data.id,
              affixType: this.affixType,
              dataSrcId: this.dataSrcId,
              fileName: res.data.data.originalFileName,
            });
            this.dataList.push({
              fileId: res.data.data.id,
              isDeleted: 0,
              fileName: res.data.data.originalFileName,
              affixType: this.affixType,
              dataSrcId: this.dataSrcId,
            });
            param.file.fileId = res.data.data.id;
          }
        })
        .catch((err) => {
          param.onError(err);
        });
    },
    handleRemove(file, fileList) {
      this.dataList.forEach((ele) => {
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
        }=${getToken()}&dataId=${file.dataId || ""}&affixId=${
          file.fileId || file.raw.fileId
        }&dataSrcId=${file.dataSrcId || ""}&affixType=${file.affixType || ""}`
      );
    },
    beforeRemove(file, fileList) {
      if (file.size / 1024 / 1024 < 30 || file.dataId) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    beforeUpload(file) {
      this.loading = true;
      const fileSize = file.size / 1024 / 1024 < 30;
      if (!fileSize) {
        this.loading = false;
        this.$message.error("上传文件大小不能超过 30MB!");
      }
      return fileSize;
    },
    uploadSuccessFile(response, file, fileList) {
      console.log(response);
    },
  },
  created() {
    console.log(this.editFlag);
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.pc = false;
    } else {
      this.pc = true;
    }
    this.getLeft(this.dataId);
  },
};
</script>
<style lang="scss" scoped>
body {
  font-size: 15px;
}
.sx_check_btns {
  .btn1 {
    color: #409eff;
  }
  .btn2 {
    color: #409eff;
  }
  .active {
    background: #409eff !important;
    color: #fff !important;
  }
}

.textare .el-textarea__inner {
  border: none !important;
}
.bored {
  border: 1px solid red;
}
.sx_checkTab {
  .el-table__header-wrapper {
    border-bottom: 1px solid rgb(235, 238, 245);
  }
  .cell {
    text-align: center;
  }
}
</style>
