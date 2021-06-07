<template>
    <basic-container>
        <Search :option="searchOption" @search="search"></Search>
        <avue-crud  ref='crud' :data='data' :option='option' :table-loading="loading" :page="page"   @selection-change="selectionChange"  @size-change="sizeChange"  @current-change="currentChange" :cell-style="cellStyle" :row-style="rowStyle">
            <template slot-scope="scope" slot="menu">
                  <el-button type="text" size="small" icon="el-icon-setting" @click="confirmProcess(scope.row)">处理</el-button>
                  <el-button type="text" size="small" icon="el-icon-picture-outline" @click.stop="lookImg(scope.row)">流程监控图</el-button>
                  <el-button type="text" size="small" icon="el-icon-refresh" @click.stop="manage(scope.row)">转办</el-button>
            </template>
        </avue-crud>

        <fullScreenDialog
            ref="dialog"
            :visible.sync="visible"
            v-if='visible'
            dialogTitle="流程环节"
            >
            <slot slot="toolBar">
                <el-button size="mini" type="info" icon="el-icon-printer"></el-button>
                <el-button
                size="mini"
                type="primary"
                icon="el-icon-circle-close"
                @click="visible = false"
                >关 闭</el-button
                >
            </slot>
        <div class="content">
            <div class="top">
            <table class="gridtable">
                <tr>
                <td>事务编号:</td>
                <td>{{ BasicInfo.instId }}</td>
                <td>流程名称:</td>
                <td>{{ BasicInfo.flowName }}</td>
                <td>事务标题:</td>
                <td>{{ BasicInfo.title }}</td>
                <td>事务状态:</td>
                <td>
                    <el-tag type="warning" v-if="BasicInfo.status === 1"
                    >处理中</el-tag
                    >
                    <el-tag type="success" v-if="BasicInfo.status === 2"
                    >已完成</el-tag
                    >
                    <el-tag type="danger" v-if="BasicInfo.status === 3"
                    >已作废</el-tag
                    >
                </td>
                </tr>
                <tr>
                <td>申请人员:</td>
                <td>{{ BasicInfo.userName }}</td>
                <td>申请部门:</td>
                <td>{{ BasicInfo.deptName }}</td>
                <td>申请公司:</td>
                <td>{{ BasicInfo.companyName }}</td>
                <td>申请时间:</td>
                <td>{{ BasicInfo.createTime }}</td>
                </tr>
            </table>
            </div>
            <div class="middle">
            <el-tabs type="border-card">
                <el-tab-pane label="表单数据">
                <div class="form" style="height:100%;overflow-y:auto">
                  <sxForm v-if="formType=='M' || formType=='F'" :params="formParams"></sxForm>
                  <customPage  v-if="formType=='S'" :flowNode='flowKey' :nodeAlias='nodeAlias' :dataId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='4'></customPage>
                </div>
                </el-tab-pane>
            </el-tabs>
            </div>
            <div class="bottom">
            <el-tabs type="border-card">
                <el-tab-pane label="审批意见">
                <div class="process">
                    <table
                    class="gridtable"
                    style="margin-top: 5px"
                    v-for="(item, index) in flowActivityVOList"
                    :key="index"
                    >
                    <tr>
                        <td rowspan="3">{{ item.nodeName }}</td>
                        <td colspan="8" style="text-align: left;height:25px">
                        {{ item.assignComment }}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="6" v-if="item.flowFileList.length !== 0">
                        <div class="file_list">
                            <li class="files" v-for="(file, index) in item.flowFileList" :key="index" @click="handlePreview(file)" style="color:#409eff">
                                <i class="el-icon-document" style="color:#409eff"></i>
                                    {{ file.fileName }}
                            </li>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="width:5%">处理人:</td>
                        <td style="width:20%">{{ item.userName }}</td>
                        <td style="width:10%">环节开始时间:</td>
                        <td style="width:15%">{{ item.startTime }}</td>
                        <td style="width:10%">环节处理时间:</td>
                        <td style="width:15%">{{ item.assignTime }}</td>
                        <td style="width:5%">处理状态:</td>
                        <td style="width:15%">
                        <el-tag type="success" v-if="item.status==1">同意</el-tag>
                        <el-tag type="primary" v-else-if="item.status==2">转办</el-tag>
                        <el-tag type="info" v-else-if="item.status==3">回退</el-tag>
                        <el-tag type="danger" v-else-if="item.status==4">拒绝</el-tag>
                        <el-tag type="danger" v-else-if="item.status==5">作废</el-tag>
                        <el-tag type="warning" v-else-if="item.status==''">待处理</el-tag>
                        </td>
                    </tr>
                    </table>
                </div>
                </el-tab-pane>
            </el-tabs>
            </div>

            <div class="copyInfo" v-show="flowInstanceCopyList.length>0">
            <el-tabs type="border-card">
                <el-tab-pane label="抄送信息">
                <table
                    class="gridtable"
                    style="margin-top: 5px"
                    v-for="(item, index) in flowInstanceCopyList"
                    :key="index"
                    >
                    <tr>
                        <td rowspan="4">{{ item.taskName }}</td>
                    </tr>
                    <tr>
                        <td colspan="1" style="text-align:center;">留言</td>
                        <td colspan="20" style="text-align:left;">{{ item.memo }}</td>
                    </tr>
                        <td colspan="1" style="text-align:center;">回复</td>
                        <td colspan="20" style="text-align:left;">{{ item.reply }}</td>
                    <tr>
                        <td style="width:5%">被抄送人:</td>
                        <td style="width:20%">{{ item.delegateUserName }}</td>
                        <td style="width:10%">抄送人:</td>
                        <td style="width:15%">{{ item.createUserName }}</td>
                        <td style="width:10%">抄送时间:</td>
                        <td style="width:15%">{{ item.createTime }}</td>
                        <td style="width:5%">抄送状态:</td>
                        <td style="width:15%">
                        <el-tag type="danger" v-if="item.readStatus==0">未读</el-tag>
                        <el-tag type="success" v-else-if="item.readStatus==1">已读</el-tag>
                        </td>
                    </tr>
                    </table>
                </el-tab-pane>
            </el-tabs>
            </div>

            <div class="comment">
                <table class="gridtable" style="margin-top:20px;">
                    <tr  v-for="(item,index) in nextNodeDTOList" :key="index">
                    <td><span style="color:red;font-size:1px;margin-right:4px">{{`${item.isRequired ? '*' : ''}`}}</span>下一环节处理人({{item.nodeName}}):</td>
                    <td>
                        <el-select
                            style="width:100%"
                            v-model="item.userIds"
                            multiple
                            filterable
                            remote
                            size="small"
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="remoteMethod"
                            :loading="loading">
                            <el-option
                            v-for="item in zbOption"
                            :key="item.id"
                            :label="item.realName"
                            :value="item.id">
                            <p style="margin:0px 10px">{{item.realName}}({{item.account}}) — {{item.deptName}}</p>
                            </el-option>
                        </el-select>
                    </td>
                    </tr>
                    <tr>
                    <td>审批意见:</td>
                    <td>
                        <el-input
                        type="textarea"
                        :rows="5"
                        clearable
                        placeholder="请输入审批意见"
                        v-model="comment"
                        >
                        </el-input>
                    </td>
                    </tr>
                    <tr>
                    <td>附件上传:</td>
                    <td style="text-align: left" class="todoc">
                        <fileUpload :data.sync="fileItem"></fileUpload>
                    </td>
                    </tr>
                </table>
            </div>
        </div>
            <slot slot="footerBar">
                <el-button
                    style="margin:0 5px"
                    size="mini"
                    type="primary"
                    icon="el-icon-check"
                    @click="passTask"
                    >同意</el-button
                >
                <el-button
                v-show="backFlag==1"
                style="margin:0 5px"
                size="mini"
                type="warning"
                icon="el-icon-back"
                class="popconfirm"
                @click="backTasks"
                >回退</el-button
                >
                <el-popconfirm
                style="margin:0 5px"
                v-show="stopFlag==1"
                title="确定拒绝"
                placement="top"
                class="popconfirm"
                @confirm="rejectTasks"
                >
                <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-close"
                    slot="reference"
                    >拒绝</el-button
                >
                </el-popconfirm>
                <el-button
                style="margin:0 5px"
                size="mini"
                type="success"
                icon="el-icon-edit-outline"
                @click="copyTasks"
                >抄送</el-button
                >
                <el-button
                    style="margin:0 5px"
                    size="mini"
                    type="info"
                    icon="el-icon-refresh"
                    @click="manageTasks"
                    >转办</el-button
                >
                <el-button
                v-show="signForFlag==1"
                    size="mini"
                    style="background:#6532EF;color:#fff;margin:0 5px"
                    icon="el-icon-document-checked"
                    slot="reference"
                    @click="signTasks"
                    >签收</el-button
                >
            </slot>
        </fullScreenDialog>

            <!-- 抄送 -->
        <el-dialog
            title="抄送"
            width="60%"
            :show-close="false"
            :visible.sync="csVisible"
            append-to-body
            :close-on-click-modal="false"
            >
            <el-row style="width:100%">
                <el-col :span="2" style="text-align:right;line-height:32px;padding:0 10px 0 0"><div>抄送人:</div></el-col>
                <el-col :span="22">
                    <el-select
                        style="width:100%"
                        v-model="csState"
                        multiple
                        filterable
                        remote
                        size="small"
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading">
                        <el-option
                        v-for="item in zbOption"
                        :key="item.id"
                        :label="item.realName"
                        :value="item.id">
                        <p style="margin:0px 10px">{{item.realName}}({{item.account}}) — {{item.deptName}}</p>
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row style="width:100%">
                <el-col :span="2" style="text-align:right;line-height:32px;padding:0 10px 0 0"><div>留言:</div></el-col>
                <el-col :span="22">
                    <el-input
                        type="textarea"
                        :rows="5"
                        clearable
                        placeholder="请输入留言"
                        style="margin-top: 5px"
                        v-model="csText"
                    >
                    </el-input>
                </el-col>
            </el-row>
            <span slot="footer">
                <el-button
                size="mini"
                @click="csVisible = false"
                icon="el-icon-circle-close"
                >取 消</el-button
                >
                <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="csSub"
                >确 定</el-button
                >
            </span>
        </el-dialog>

            <!-- 转办 -->
        <el-dialog
            title="转办"
            width="60%"
            :show-close="false"
            :visible.sync="zbVisible"
            append-to-body
            :close-on-click-modal="false"
            >
            <el-row style="width:100%">
                <el-col :span="2" style="text-align:right;line-height:32px;padding:0 10px 0 0"><div>转办人:</div></el-col>
                <el-col :span="22">
                    <el-select
                        style="width:100%"
                        v-model="zbState"
                        multiple
                        filterable
                        remote
                        size="small"
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading">
                        <el-option
                        v-for="item in zbOption"
                        :key="item.id"
                        :label="item.realName"
                        :value="item.id">
                        <p style="margin:0px 10px">{{item.realName}}({{item.account}}) — {{item.deptName}}</p>
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row style="width:100%">
                <el-col :span="2" style="text-align:right;line-height:32px;padding:0 10px 0 0"><div>转办意见:</div></el-col>
                <el-col :span="22">
                    <el-input
                        type="textarea"
                        :rows="5"
                        clearable
                        placeholder="请输入转办意见"
                        style="margin-top: 5px"
                        v-model="zbText"
                    >
                    </el-input>
                </el-col>
            </el-row>
            <span slot="footer">
                <el-button
                size="mini"
                @click="zbVisible = false"
                icon="el-icon-circle-close"
                >取 消</el-button
                >
                <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="zbSub"
                >确 定</el-button
                >
            </span>
        </el-dialog>
        <el-dialog
            title="转办"
            width="60%"
            :show-close="false"
            :visible.sync="zbAload"
            append-to-body
            :close-on-click-modal="false"
            >
            <el-row style="width:100%">
                <el-col :span="2" style="text-align:right;line-height:32px;padding:0 10px 0 0"><div>转办人:</div></el-col>
                <el-col :span="22">
                    <el-select
                        style="width:100%"
                        v-model="zbState"
                        multiple
                        filterable
                        remote
                        size="small"
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading">
                        <el-option
                        v-for="item in zbOption"
                        :key="item.id"
                        :label="item.realName"
                        :value="item.id">
                        <p style="margin:0px 10px">{{item.realName}}({{item.account}}) — {{item.deptName}}</p>
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row style="width:100%">
                <el-col :span="2" style="text-align:right;line-height:32px;padding:0 10px 0 0"><div>转办意见:</div></el-col>
                <el-col :span="22">
                    <el-input
                        type="textarea"
                        :rows="5"
                        clearable
                        placeholder="请输入转办意见"
                        style="margin-top: 5px"
                        v-model="zbText"
                    >
                    </el-input>
                </el-col>
            </el-row>
            <span slot="footer">
                <el-button
                size="mini"
                @click="zbAload = false"
                icon="el-icon-circle-close"
                >取 消</el-button
                >
                <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="zbASub"
                >确 定</el-button
                >
            </span>
        </el-dialog>
        <el-dialog
            title="回退"
            width="60%"
            :show-close="false"
            :visible.sync="htAload"
            append-to-body
            :close-on-click-modal="false"
            >
            <el-row style="width:100%">
                <el-col :span="2" style="text-align:right;line-height:32px;padding:0 10px 0 0"><div>回退环节:</div></el-col>
                <el-col :span="22">
                    <el-select v-model="htvalue" placeholder="请选择" size="small" style="width:100%">
                        <el-option
                        v-for="item in htoption"
                        :key="item.nodeId"
                        :label="item.nodeName"
                        :value="item.nodeId">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row style="width:100%">
                <el-col :span="2" style="text-align:right;line-height:32px;padding:0 10px 0 0"><div>回退意见:</div></el-col>
                <el-col :span="22">
                    <el-input
                        type="textarea"
                        :rows="5"
                        clearable
                        placeholder="请输入回退意见"
                        style="margin-top: 5px"
                        v-model="htText"
                    >
                    </el-input>
                </el-col>
            </el-row>
            <span slot="footer">
                <el-button
                size="mini"
                @click="htAload = false"
                icon="el-icon-circle-close"
                >取 消</el-button
                >
                <el-button type="primary" size="mini" icon="el-icon-circle-check" @click="htSub"
                >确 定</el-button
                >
            </span>
        </el-dialog>
        <arrImg ref='aImg'></arrImg>
    </basic-container>
</template>

<script>
import { getDeptTree } from "@/api/system/dept";
import { myToDoList,flowInfo, getHistoryTaskBack, backToTask,historyInfo ,completeTask,delegateTask,claimTask,userBySearch,copyTask,stopTask,getBackNode,getUserInfoBySearch} from "@/api/work/todo";
import fileUpload from "@/components/fileUpload";
import { loadavg } from 'os';
import { getToken } from "@/util/auth";
import website from "@/config/website";
import arrImg from './arrImg'
import modelAnalysis from "@/views/modelAnalysis/modelForm"
import sxForm from "@/views/modelAnalysis/sxForm"
import formTranslate from "@/views/formTranslate/index"
import customPage from './biz/customPage'
const confirmMessage = [
  {
    notice: "此操作将同意, 是否继续?",
  },
  {
    title: "提示",
  },
  {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    roundButton: true,
    closeOnClickModal: false,
    showClose: false,
  },
];
export default {
    components: {
      fileUpload,
      modelAnalysis,
      arrImg,
      customPage,
      formTranslate,
      sxForm
    },
    data() {
        return {
            nodeAlias:'',
            flowKey:'',
            dataId:'',
            formType:'',
            formId:'',
            proDefId:'',
            nodeCode:'',
            functionId:'',
            editFlag:false,
            routeName:'',
            imgLod:true,
            formParams:{},
            searchOption: {
                rows: [
                [
                    {
                    type: "input",
                    queryType :'1',
                    prop: "instId",
                    label: "事务编号:",
                    placeholder: "请输入事务编号"
                    },
                    {
                    type: "date",
                    queryType :'2',
                    prop: "taskCreateTime",
                    label: "环节到达日期:",
                    placeholder: "环节到达日期"
                    }
                ],
                [
                    {
                    type: "input",
                    queryType:'1',
                    prop: "title",
                    label: "事务标题:",
                    placeholder: "请输入事务标题",
                    },
                    {
                    type: "date",
                    queryType :'2',
                    prop: "createTime",
                    label: "流程发起日期:",
                    placeholder: "环节到达日期"
                    }
                ],
                [
                    {
                    type: "input",
                    queryType:'1',
                    prop: "userName",
                    label: "发起人姓名:",
                    placeholder: "请输入发起人姓名",
                    },
                    {
                    type: "fuzzySearch",
                    queryType:'1',
                    prop: "procAlias",
                    label: "流程名称:",
                    placeholder: "请输入流程名称",
                    url: "/api/blade-flow/model/getFlowModelBySearch?search=",
                    data: []
                    }
                ],
                [
                    {
                    type: "tree",
                    prop: "deptId",
                    label: "发起部门:",
                    dic: this.treedata,
                    placeholder: "请输入发起部门"
                    },
                ],
                ]
            },
            treedata:[],
            data:[],
            selectQuery: {},
            zbVisible:false,
            option:{
                menuWidth:230,
                menuFixed:'right',
                tip: false,
                addBtn: false,
                delBtn: false,
                page: true,
                index: true,
                refreshBtn: false,
                border: true,
                columnBtn: false,
                cancelBtn: false,
                editBtn: false,
                selection: true,
                searchBtn: false,
                stripe: true,
                selectClearBtn: false,
                reserveSelection: true,
                indexLabel: "序号",
                align: "center",
                menuAlign: "center",
                headerAlign: "center",
                column: [
                    {
                        label: '流程名称',
                        prop: 'procDefName',
                        width:150,
                    },
                    {
                        label: '当前环节',
                        prop: 'taskName',
                        width:100
                    },
                    {
                        label: '事务编号',
                        prop: 'instId',
                        width:80
                    },
                    {
                        label: '事务标题',
                        prop: 'title',
                        width:250
                    },
                    {
                        label: '发起人',
                        prop: 'userName',
                        width:80
                    },
                    {
                        label: '发起部门',
                        prop: 'deptName',
                        width:120
                    },
                    {
                        label: '上一处理人',
                        prop: 'lastUserName',
                        width:90
                    },
                    {
                        label: '环节到达日期',
                        prop: 'taskCreateTime',
                        width:150
                    },
                    {
                        label: '流程发起日期',
                        prop: 'createTime',
                        width:150
                    },
                    {
                        label: '发起公司',
                        prop: 'companyName',
                        width:180
                    },
                ]
            },
            loading:false,
            page:{
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            clickquery: "",
            selectionList:[],
            visible: false,
            backVisible: false,
            csVisible: false,
            zbState:'',
            zbloading:false,
            zbOption:[],
            zbText:'',
            zbARow:{},
            zbAload:false,
            textarea: "",
            showFileColumns: true,
            tableData: [],
            fileItem: [],
            BasicInfo: {
                instId: "",
                procDefName: "",
                title: "",
                status: "",
                userName: "",
                deptName: "",
                companyName: "",
                createTime: ""
            },
            flowActivityVOList:[],
            flowInstanceCopyList:[],
            nextNodeDTOList:[],
            taskId: "",
            proInstId:'',
            taskName:'',
            actFiles:[],
            csState:[],
            csText:"",
            comment: "",
            processInstanceId: "",
            copyTask: {},
            HistoryTask: [],
            backTask: {
                taskId: "",
                nodeKey: "",
                assignee: "",
                comment: "",
            },
            signForFlag:'',
            backFlag:'',
            stopFlag:'',
            htAload:false,
            htvalue:'',
            htoption:[],
            htText:''
        }
    },
    methods: {
        //发起部门树回调地狱
        treeChildren(child) {
            if (child) {
                child.forEach(ele => {
                    ele.label = ele.title;
                    if (ele.children) {
                        this.treeChildren(ele.children);
                    }
                });
            }
        },
        //多选
        selectionChange(list){
            this.selectionList = list;
        },
        //每页条数
        sizeChange(pageSize){
            this.clickquery = 1;
            this.page.currentPage = 1;
            this.page.pageSize = pageSize;
            this.search(this.selectQuery);
        },
        //当前页
        currentChange(currentPage){
            this.clickquery = 1;
            this.page.currentPage = currentPage;
            this.search(this.selectQuery);
        },
        //列表接口，获取数据
        api() {
        this.loading = true;
        var obj = {
            current: this.page.currentPage,
            size: this.page.pageSize,
            extQueryList: []
        };
        myToDoList(obj).then(res => {
            this.data = res.data.data.records;
            this.loading = false;
            this.page.total = res.data.data.total;
        });
        },
        //查询
        search(val) {
            this.selectQuery = val;
            this.loading = true;
            let obj = {
                data: {
                    userIds: []
                },
                current: this.clickquery == 1 ? this.page.currentPage : 1,
                size: this.page.pageSize,
                extQueryList: [
                    {
                    field: "instId",
                    expressionList: [
                        {
                        operator: "EQ",
                        lowerValue: val.instId,
                        upperValue: ""
                        }
                    ]
                    },
                    {
                    field: "taskCreateTime",
                    expressionList: [
                        {
                        operator: "BT",
                        lowerValue: val.taskCreateTime?val.taskCreateTime[0]:'',
                        upperValue: val.taskCreateTime?val.taskCreateTime[1]:'',
                        }
                    ]
                    },
                    {
                    field: "title",
                    expressionList: [
                        {
                        operator: "EQ",
                        lowerValue: val.title,
                        upperValue: ""
                        }
                    ]
                    },
                    {
                    field: "createTime",
                    expressionList: [
                        {
                        operator: "BT",
                        lowerValue: val.createTime?val.createTime[0]:'',
                        upperValue: val.createTime?val.createTime[1]:''
                        }
                    ]
                    },
                    {
                    field: "userName",
                    expressionList: [
                        {
                        operator: "EQ",
                        lowerValue: val.userName,
                        upperValue: ""
                        }
                    ]
                    },
                    {
                    field: "procAlias",
                    expressionList: [
                        {
                        operator: "EQ",
                        lowerValue: val.procAlias,
                        upperValue: ""
                        }
                    ]
                    },
                    {
                    field: "deptId",
                    expressionList: [
                        {
                        operator: "EQ",
                        lowerValue: val.deptId,
                        upperValue: ""
                        }
                    ]
                    },
                ]
            };
            myToDoList(obj).then(res => {
                this.data = res.data.data.records;
                this.loading = false;
                this.page.total = res.data.data.total;
            });
            this.clickquery = "";
    },
    //处理
    confirmProcess(row) {
      this.BasicInfo={}
      this.flowActivityVOList=[]
      this.flowInstanceCopyList=[]
      this.signForFlag=''
      this.backFlag=''
      this.stopFlag=''
      this.taskId=''
      this.actFiles=[]
      this.formParams = {}
      this.formId=''
      this.formType=''
      this.dataId=''
      this.taskName=''
      this.proInstId=''
      this.comment=''
      this.zbText=''
      this.zbState=[]
      var params={
          proInstId:row.proInstId,
          taskId:row.taskId
      }
      historyInfo(params).then(res=>{
          if(res.data.data.taskId==''){
              this.$message.error('该流程已被处理');
              this.api()
          }else{
              this.BasicInfo = res.data.data.flowInstanceVo;
          this.flowActivityVOList=res.data.data.flowActivityVOList
          this.flowInstanceCopyList=res.data.data.flowInstanceCopyList
          this.signForFlag=res.data.data.signForFlag
          this.backFlag=res.data.data.flowNodeVo.backFlag
          this.stopFlag=res.data.data.flowNodeVo.stopFlag
          this.taskId=res.data.data.taskId
          this.actFiles=res.data.data.flowInstanceVo.actFiles
          this.taskName=res.data.data.flowNodeVo.nodeName
          this.proInstId=res.data.data.proInstId
          this.dataId = res.data.data.flowInstanceVo.dataId;
          this.formType = res.data.data.flowProcessForm.formType;
          this.formId = res.data.data.flowProcessForm.formId;
          this.proDefId  = res.data.data.flowInstanceVo.proDefId;
          this.nodeCode = res.data.data.flowNodeVo.nodeCode;
          this.functionId=res.data.data.flowInstanceVo.functionId;
          this.editFlag = res.data.data.editFlag;
          this.routeName = res.data.data.flowProcessForm.routeName;
          this.nextNodeDTOList=res.data.data.nextNodeDTOList;
          this.flowKey=res.data.data.flowInstanceVo.flowKey;
          this.nodeAlias=res.data.data.flowNodeVo.nodeAlias;
          if(this.formType == "M"){
            this.formParams = {
              actionType: this.editFlag ? 'edit' : 'view',
              formType: this.formType,
              mainModelId: this.formId,
              dataId: this.dataId,
              functionId: this.functionId,
              proDefId: this.proDefId,
              nodeCode: this.nodeCode,
            }
          } else if(this.formType == "F"){
            this.formParams = {
              actionType: this.editFlag ? 'edit' : 'view',
              formType: this.formType,
              formId: this.formId,
              dataId: this.dataId,
              functionId: this.functionId,
              proDefId: this.proDefId,
              nodeCode: this.nodeCode,
            }
          }

          this.visible = true;
          }
      });
    },
    //刷新
    sadsa(){
        var params={
          proInstId:this.proInstId,
          taskId:this.taskId
      }
      historyInfo(params).then(res=>{
          if(res.data.data.taskId==''){
              this.$message.error('该流程已被处理');
              this.api()
          }else{
              this.BasicInfo = res.data.data.flowInstanceVo;
          this.flowActivityVOList=res.data.data.flowActivityVOList
          this.flowInstanceCopyList=res.data.data.flowInstanceCopyList
          this.signForFlag=res.data.data.signForFlag
          this.backFlag=res.data.data.flowNodeVo.backFlag
          this.stopFlag=res.data.data.flowNodeVo.stopFlag
          this.taskId=res.data.data.taskId
          this.actFiles=res.data.data.flowInstanceVo.actFiles
          this.taskName=res.data.data.flowNodeVo.nodeName
          this.proInstId=res.data.data.proInstId
          this.dataId = res.data.data.flowInstanceVo.dataId;
          this.formType = res.data.data.flowProcessForm.formType;
          this.formId = res.data.data.flowProcessForm.formId;
          this.proDefId  = res.data.data.flowInstanceVo.proDefId;
          this.nodeCode = res.data.data.flowNodeVo.nodeCode;
          this.functionId=res.data.data.flowInstanceVo.functionId;
          this.editFlag = res.data.data.editFlag;
          this.routeName = res.data.data.flowProcessForm.routeName;
          if(this.formType == "M"){
            this.formParams = {
              actionType: this.editFlag ? 'edit' : 'view',
              formType: this.formType,
              mainModelId: this.formId,
              dataId: this.dataId,
              functionId: this.functionId,
              proDefId: this.proDefId,
              nodeCode: this.nodeCode,
            }
          } else if(this.formType == "F"){
            this.formParams = {
              actionType: this.editFlag ? 'edit' : 'view',
              formType: this.formType,
              formId: this.formId,
              dataId: this.dataId,
              functionId: this.functionId,
              proDefId: this.proDefId,
              nodeCode: this.nodeCode,
            }
          }
          this.visible = true;
          }
      });
    },
    // 同意
    passTask() {
      if(this.comment==""){
        this.$message({
          message: '请填写审批意见！',
          type: 'warning'
        });
        return ;
      }
        if(this.nextNodeDTOList.length>0){
            for(var i=0;i<this.nextNodeDTOList.length;i++){
                if(this.nextNodeDTOList[i].userIds.length<1 && this.nextNodeDTOList[i].isRequired){
                    this.$message({
                        message: '请选择下一环节处理人',
                        type: 'warning'
                    });
                    return
                }
            }
            let payload = {
                    taskId: this.taskId,
                    actFiles: this.fileItem,
                    nextNodeDTOList:this.nextNodeDTOList,
                    comment: this.comment
            };
            completeTask(payload).then(res=>{
            if(res.data.code=='200'){
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.visible = false;
                    this.comment=''
                    this.nextNodeDTOList=[]
                    this.api()
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        }else{
            let payload = {
                    taskId: this.taskId,
                    actFiles: this.fileItem,
                    nextNodeDTOList:this.nextNodeDTOList,
                    comment: this.comment
                };
                completeTask(payload).then(res=>{
                    if(res.data.code=='200'){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.visible = false;
                        this.comment=''
                        this.nextNodeDTOList=[]
                        this.api()
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
        }

    },
    // 回退
    backTasks() {
      this.htvalue='',
      this.htoption=[],
      this.htText=''
      var params={
          taskId:this.taskId
      }
      getBackNode(params).then(res=>{
          if(res.data.data.length<1){
              this.$message({
                message: '没有可回退环节',
                type: 'warning'
             });
           }else{
              this.htoption=res.data.data
              this.htAload = true;
          }
      })
    },
    //回退确认
    htSub(){
        backToTask(this.taskId,this.htvalue,this.htText).then(res=>{
            if(res.data.code=='200'){
              this.$message({
                message: res.data.msg,
                type: 'success'
            });
            this.htAload = false;
            this.visible = false;
            this.api()
          }else{
              this.$message.error(res.data.msg);
          }
        })
    },

    // 拒绝
    rejectTasks() {
        var params={
            taskId:this.taskId,
            comment:this.comment
        }
      stopTask(params).then(res=>{
          if(res.data.code=='200'){
              this.$message({
                message: res.data.msg,
                type: 'success'
            });
            this.visible = false;
            this.api()
          }else{
              this.$message.error(res.data.msg);
          }
      })
    },

    cellStyle(){
      return 'padding: 0'
    },

    rowStyle(){
      return 'height: 35px'
    },
    //转办弹框
    manageTasks(){
        this.zbVisible = true;
    },
    manage(row){
        this.zbAload = true;
        this.zbARow=row
    },
    //转办确定
    zbSub(){
        var params={
            taskId:this.taskId,
            comment:this.zbText,
            userIds:this.zbState,
            actFiles:this.actFiles
        }
        delegateTask(params).then(res=>{
            if(res.data.code=='200'){
              this.$message({
                message: res.data.msg,
                type: 'success'
            });
            this.zbVisible = false;
            this.visible=false
            this.taskId=''
            this.zbText=''
            this.zbState=[]
            this.actFiles=[]
            this.api()
          }else{
              this.$message.error(res.data.msg);
          }
        })
    },
    zbASub(){
        var params={
            taskId:this.zbARow.taskId,
            comment:this.zbText,
            userIds:this.zbState,
            actFiles:this.zbARow.actFiles
        }
        delegateTask(params).then(res=>{
            if(res.data.code=='200'){
              this.$message({
                message: res.data.msg,
                type: 'success'
            });
            this.zbAload = false;
            this.visible=false
            this.zbText=''
            this.zbState=[]
            this.rows={}
            this.api()
          }else{
              this.$message.error(res.data.msg);
          }
        })
    },
    //转办远程搜索
    remoteMethod(query){
        if(query!=''){
            var params={
               search:query
            }
            this.zbloading=true
            setTimeout(() => {
              this.zbloading = false;
              getUserInfoBySearch(params).then(res=>{
                    this.zbOption=res.data.data
              })
          }, 200);
        }else{
            this.zbOption=[]
        }
    },
    //签收
    signTasks(){
        var params={
            taskId:this.taskId
        }
        claimTask(params).then(res=>{
            if(res.data.code=='200'){
              this.$message({
                message: res.data.msg,
                type: 'success'
            });
            this.sadsa()
          }else{
              this.$message.error(res.data.msg);
          }
        })
    },
    // 抄送弹框
    copyTasks() {
      this.csVisible = true;
    },
    //抄送确定
    csSub(){
        var params={
            taskId:this.taskId,
            actFiles:this.actFiles,
            comment:this.comment,
            userIds:this.csState,
            flowInstanceCopy:{
                 proInstId:this.proInstId,
                 taskId:this.taskId,
                 taskName:this.taskName,
                 memo:this.csText
            }
        }
        copyTask(params).then(res=>{
            if(res.data.code=='200'){
              this.$message({
                message: res.data.msg,
                type: 'success'
            });
            this.csVisible = false;
            this.sadsa()
          }else{
              this.$message.error(res.data.msg);
          }
        })
      },
      handlePreview(file) {
           window.open(
                `/api/blade-resource/affix/singleDownload?${
                this.website.tokenHeader
                }=${getToken()}&affixId=${file.fileId || ""}`
            );
      },
      lookImg(row){
        this.$refs.aImg.open(this.imgLod,row)
      }
    },
    created() {
        //发起部门
        getDeptTree().then(res => {
          this.treedata = res.data.data;
          this.treedata.forEach(ele => {
            ele.label = ele.title;
            if (ele.children) {
            this.treeChildren(ele.children);
            }
         });
         this.searchOption.rows[3][0].dic = this.treedata;
        });
        this.api()
    },
    watch:{
        visible(newVisible,oldVisible){
            if(newVisible==false){
                this.zbVisible=false
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.searchBox {
  width: 100%;
}

@mixin tableStyle {
  table.gridtable {
    width: 100%;
    font-family: verdana, arial, sans-serif;
    font-size: 12px;
    color: #60626d;
    border-width: 1px;
    border-color: #ebeef5;
    border-collapse: collapse;
  }
  table.gridtable td {
    border-width: 1px;
    padding: 8px;
    width: 100px;
    text-align: center;
    border-style: solid;
    border-color: #ebeef5;
    background-color: #ffffff;
  }

  table.gridtable td:nth-of-type(even) {
    width: 400px;
  }

  table.gridtable .file_list li {
    list-style: none !important;
    text-align: left;
    margin-top: 2px;

    a {
      color: #0079fe;
    }
  }
}

.top {
  border: 1px dashed #ccc;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 10px;
  @include tableStyle;
}

.middle {
  margin-top: 10px;
}

.bottom {
  margin-top: 10px;
  .process {
    @include tableStyle;
  }
}

.copyInfo {
  margin-top: 10px;
  @include tableStyle;
}

.sx_jnnf{
    margin-top: 10px;
    @include tableStyle;
}

.comment {
  @extend .top;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  table.gridtable td:nth-of-type(odd) {
    width: 100px !important;
  }
}
@import url("../../styles/work/todoc.css");

</style>
