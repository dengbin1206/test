<template>
   <basic-container>
     <el-form :inline="true" label-width="130px" class="sx_model_search sx_formItem">
            <el-row>
                <el-col :span='10'>
                    <el-form-item label="设备名称:" style="width:100%">
                        <el-input v-model="search_form.equipName" placeholder="请输入设备名称" clearable size="small" style="width:100%"/>
                    </el-form-item>
                </el-col>
                <el-col :span='10'>
                    <el-form-item label="设备编号:" style="width:100%">
                        <el-input v-model="search_form.equipNum" placeholder="请输入设备编号" clearable size="small" style="width:100%"/>
                    </el-form-item>
                </el-col>
                <el-col :span='4'>
                  <el-button-group>
                  <el-button type="primary" icon="el-icon-search" size="small" @click="searchChange()">查询</el-button>
                  <el-dropdown @command="dropdownMenu">
                        <el-button type="primary" size="small"><i class="el-icon-arrow-down"></i></el-button>
                        <el-dropdown-menu slot="dropdown" >
                        <el-dropdown-item command="clear">清空</el-dropdown-item >
                        <el-dropdown-item command="spread">{{isShow ? '收起' : '展开'}}</el-dropdown-item>
                        </el-dropdown-menu>
                  </el-dropdown>
                  </el-button-group>
               </el-col>
            </el-row>
            <div v-show='isShow'>
               <el-row>
                  <el-col :span="10">
                     <el-form-item label="种类名称:" style="width:100%">
                        <el-input v-model="search_form.equipCateName" placeholder="请输入种类名称" style="width:100%" size="small" clearable />
                     </el-form-item>
                  </el-col>
                  <el-col :span="10">
                     <el-form-item label="负责班组:" style="width:100%">
                       <el-input v-model="search_form.chargeTeamName" placeholder="请输入报修班组" style="width:100%" size="small" clearable />
                     </el-form-item>
                  </el-col>
               </el-row>
            </div>
    </el-form>
     <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               @row-del="rowDel"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange">
        <template slot="menuLeft">
          <el-button type="primary"
                     size="small"
                     icon="el-icon-plus"
                     v-if="buttonList.sbjc_add"
                     @click.stop="handleAdd()">新增
          </el-button>
          <el-button type="primary"
                    size="small"
                    icon="el-icon-printer"
                     v-if="buttonList.sbjc_qrcode"
                    @click="dyewm">打印二维码
          </el-button>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button type="text"
                    size="small"
                     v-if="buttonList.sbjc_edit"
                    @click="edit(scope.row,scope.index)"
                    icon="el-icon-edit">编辑
          </el-button>
          <el-button type="text"
                    size="small"
                    style="color:red"
                    @click="rowdel(scope.row)"
                    icon="el-icon-delete">删除
          </el-button>
        </template>
        <template slot-scope="scope" slot="nowStatus">
                <el-tag type="warning" v-if="scope.row.nowStatus === 1" >未点检</el-tag>
                <el-tag type="success" v-if="scope.row.nowStatus === 2" >已点检</el-tag>
                <el-tag type="danger" v-if="scope.row.nowStatus === 3" >异常</el-tag>
                <el-tag type="info" v-if="scope.row.nowStatus === 4" >已报废</el-tag>
        </template>
        <template slot-scope="scope" slot="chargeTeamNameForm">
          <el-select
            v-model="scope.row.chargeTeam"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :change="teamOld(scope.row)"
            :loading="loading">
            <el-option
              v-for="item in teamOptions"
              :key="item.id"
              :label="item.checkTeam"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
       <template slot-scope="scope" slot="equipCateForm">
         <el-select
           v-model="scope.row.equipCate"
           filterable
           remote
           placeholder="请输入关键词"
           :remote-method="searchEquipCate"
           :change="selectEquipCate(scope.row)"
           :loading="loading">
           <el-option
             v-for="item in equipTypeOptions"
             :key="item.equipCate"
             :label="item.equipCateName"
             :value="item.equipCate">
           </el-option>
         </el-select>
       </template>
        <template slot="uploadFilesForm">
          <el-upload
            class="upload-demo"
            :http-request="uploadAction"
            :action="upLoadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            :on-success="uploadSuccessFile"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </template>
    </avue-crud>
    <el-dialog :visible.sync="imgVisible" append-to-body class="sx_imgBle">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog
      v-dialog
      :title="title"
      :visible.sync="printize"
      width="30%"
      :close-on-click-modal='false'
      append-to-body
      class="sx_dialog"
    >
      <img :src="imgSrc" alt="" style="width:100%;">
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="download"
          size="small"
          icon="el-icon-circle-check"
        >下载</el-button>
        <el-button @click="printize = false" size="small" icon="el-icon-circle-close">取 消</el-button>
      </span>
    </el-dialog>
   </basic-container>
</template>
<script>
import {
  getList,
  add,
  update,
  remove,
  generateUrlNew,
  search,
  searchEquipType
} from "@/api/biz/sbgl";
import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList } from "@/api/tool/dynamic";
import { dataExport } from "@/util/widget";
export default {
  data() {
    return {
      teamOptions: [],
      equipTypeOptions: [],
      buttonList: { sbjc_add: true, sbjc_edit: true, sbjc_qrcode: true },
      fieldPower: {},
      loading: false,
      disabledImg: false,
      dialogImageUrl: "",
      imgVisible: false,
      fileList: [],
      dataList: [],
      dataSrcId: "SBJC",
      affixType: "SBJC#DATA_UPLOAD",
      title: "",
      form: {},
      loading: false,
      upLoadUrl: "/api/blade-resource/affix/asyncUpload",
      search_form: {
        equipName: "",
        equipNum: "",
        equipCateName: "",
        chargeTeam: ""
      },
      isShow: false,
      printize: false,
      imgSrc: "",
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      userList: [],
      data: [],
      option: {
        tip: false,
        excelBtn: true,
        page: true,
        index: true,
        addBtn: false,
        refreshBtn: false,
        border: true,
        delBtn: false,
        editBtn: false,
        columnBtn: false,
        cancelBtn: false,
        selection: true,
        searchBtn: false,
        stripe: true,
        selectClearBtn: false,
        dialogClickModal: false,
        reserveSelection: true,
        align: "center",
        updateBtnTitle: "保存",
        menuAlign: "center",
        headerAlign: "center",
        labelWidth: 120,
        menuWidth: 150,
        column: [
          {
            label: "资产编号",
            prop: "assetNum"
          },
          {
            label: "设备名称",
            prop: "equipName",
            width: 120
          },
          {
            label: "设备等级",
            prop: "equipGrade",
            type: "select",
            dicData: [
              {
                label: "A",
                value: "A"
              },
              {
                label: "B",
                value: "B"
              },
              {
                label: "C",
                value: "C"
              },
              {
                label: "D",
                value: "D"
              }
            ]
          },
          {
            label: "种类名称",
            prop: "equipCateName",
            width: 120,
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "设备种类",
            prop: "equipCate",
            type: "select",
            hide: true,
            remote: true,
            props: {
              label: "equipCateName",
              value: "equipCate"
            },
            dicUrl: `api/blade-biz/check/selectEquipCate?search={{key}}`,
            width: 120,
            formslot: true
          },
          {
            label: "型号",
            prop: "modelNum"
          },
          {
            label: "规格",
            prop: "makeStandard"
          },
          {
            label: "特种设备",
            prop: "specialEquip"
          },
          {
            label: "设备编号",
            prop: "equipNum"
          },
          {
            label: "出厂制造编号",
            prop: "makeNo",
            width: 150
          },
          {
            label: "制造日期",
            prop: "makeDate",
            width: 150,
            type: "date",
            valueFormat: "yyyy-MM-dd"
          },
          {
            label: "登记日期",
            prop: "registerDate",
            width: 150,
            type: "date",
            valueFormat: "yyyy-MM-dd"
          },
          {
            label: "厂家",
            prop: "factory",
            width: 200
          },
          {
            label: "安装位置",
            prop: "installPosition",
            width: 150
          },
          {
            label: "点检周期(天)",
            prop: "checkCycle",
            type: "number",
            minRows: 1
          },
          {
            label: "维修次数",
            prop: "fixTimes",
            type: "number",
            editDisplay: false,
            addDisplay: false
          },
          {
            label: "目前设备状态",
            prop: "nowStatus",
            addDisplay: false,
            editDisplay: false,
            width: 150,
            slot: true,
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
              },
              {
                label: "已报废",
                value: 4
              }
            ]
          },
          {
            label: "负责班组",
            prop: "chargeTeamName",
            type: "select",
            remote: true,
            props: {
              label: "chargeTeamName",
              value: "chargeTeam"
            },
            dicUrl: `api/blade-biz/checkTeam/search?search={{key}}`,
            width: 130,
            formslot: true
          },
          {
            label: "班组负责人",
            prop: "chargeUserName",
            width: 130,
            //type:'select',
            //dicUrl:'/api/blade-user/getAll',
            disabled: true
            /*props:{
                label:'realName',
                value:'id'
              }*/
          },
          {
            label: "车间",
            prop: "workShop",
            width: 100
          },
          {
            label: "报废日期",
            prop: "scrapDate",
            width: 150,
            type: "date",
            valueFormat: "yyyy-MM-dd"
          },
          {
            label: "设备详细资料",
            prop: "uploadFiles",
            span: 24,
            formslot: true,
            hide: true
          }
        ]
      }
    };
  },
  mounted() {
    if (this.mainId) {
      this.init();
    }
  },
  methods: {
    selectEquipCate(row) {
      this.equipTypeOptions.forEach(item => {
        if (row.equipCate == item.equipCate) {
          row.equipCateName = item.equipCateName;
        }
      });
    },
    searchEquipCate(query) {
      if (query != "") {
        searchEquipType(query).then(res => {
          this.equipTypeOptions = res.data.data;
        });
      } else {
        this.equipTypeOptions = [];
      }
    },
    remoteMethod(query) {
      if (query != "") {
        search(query).then(res => {
          this.teamOptions = res.data.data;
        });
      } else {
        this.teamOptions = [];
      }
    },
    teamOld(row) {
      this.teamOptions.forEach(item => {
        if (row.chargeTeam == item.id) {
          row.chargeTeamName = item.checkTeam;
          row.chargeUserName = item.checkTeamLeaderName;
          //row.chargeTeam=item.id;
        }
      });
    },
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
      search("").then(res => {
        this.teamOptions = res.data.data;
      });
    },
    handleAdd() {
      this.teamOptions = [];
      this.fileList = [];
      this.dataList = [];
      this.$refs.crud.rowAdd();
      this.$set(this.form, "checkCycle", 1);
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
      this.dataList.forEach(ele => {
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
      let i = 0;
      for (let index in this.fileList) {
        let f = this.fileList[index];
        if (f.fileId == file.fileId) {
          i = index;
        }
      }
      this.fileList.splice(i, 1);
    },
    handlePreview(file) {
      if (this.disabled == true) {
        return false;
      } else {
        window.open(
          `/api/blade-resource/affix/singleDownload?${
            this.website.tokenHeader
          }=${getToken()}&dataId=${file.dataId || ""}&affixId=${file.fileId ||
            file.raw.fileId}&dataSrcId=${file.dataSrcId ||
            ""}&affixType=${file.affixType || ""}`
        );
      }
    },
    beforeRemove(file, fileList) {
      if (file.size / 1024 / 1024 < 30 || file.dataId) {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    beforeUpload(file) {
      const fileSize = file.size / 1024 / 1024 < 30;
      if (!fileSize) {
        this.$message.error("上传文件大小不能超过 30MB!");
      }
      return fileSize;
    },
    uploadSuccessFile(response, file, fileList) {},
    onLoad(page, params = {}) {
      this.loading = true;
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        data.records.forEach(row => {
          if (row.scrapFlag == 1) {
            row.nowStatus = 4;
          }
        });
        this.data = data.records;
        this.loading = false;
      });
    },
    rowSave(row, done, loading) {
      row.chargeUserName = "";
      row.uploadFiles = this.fileList;
      add(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        },
        error => {
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      row.uploadFiles = this.dataList;
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        },
        error => {
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
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    rowdel(row) {
      this.$refs.crud.rowDel(row);
    },
    edit(row, index) {
      this.mainId = row.id;
      this.init();
      this.$refs.crud.rowEdit(row, index);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page,this.search_form);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page,this.search_form);
    },
    //打印二维码
    dyewm() {
      if (this.selectionList.length == 1) {
        this.printize = true;
        this.title =
          this.selectionList[0].equipName +
          " " +
          this.selectionList[0].equipNum;
        this.print();
      } else {
        this.$message({
          message: "请选择一条数据",
          type: "warning"
        });
      }
    },
    //二维码下载
    download() {
      var link = document.createElement("a");
      link.href = this.imgSrc;
      link.download = "qrCode.jpg";
      link.click();
      document.body.removeChild(link);
    },
    print() {
      generateUrlNew(this.selectionList[0].equipNum).then(res => {
        if (res.data.code == 200) {
          this.imgSrc = "data:image/jpeg;base64," + res.data.data;
        }
      });
    },
    //搜索下拉菜单
    dropdownMenu(command) {
      switch (command) {
        case "clear":
          this.clearSearch();
          break;
        case "spread":
          this.Doshow();
          break;
      }
    },
    //搜索模块清空
    clearSearch() {
      for (let i in this.search_form) {
        this.search_form[i] = "";
      }
    },
    //搜索的展开收起
    Doshow() {
      if (this.isShow) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    //查询
    searchChange() {
      this.page.currentPage=1;
      this.onLoad(this.page, this.search_form);
    },
    dataExport() {
      let param = {
        dataId: "1359352717467619330",
        dataType: "M",
        ids: "1362757160593272834,1362936270770671617",
        queryPage: {
          current: 1,
          size: 10,
          extQueryList: []
        }
      };
      dataExport(param).then(res => {
        this.$message({
          message: "下载成功！",
          type: "success"
        });
      });
    }
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
    this.searchChange();
  }
};
</script>
<style scoped>
@import "../../../styles/model/model.css";
</style>
