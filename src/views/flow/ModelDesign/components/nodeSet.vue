<!--
 * @Date: 2021-01-04 11:50:33
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-10 10:20:33
 * @FilePath: /SX-DTBF-VIEW/src/views/flow/ModelDesign/components/nodeSet.vue
 * @Description:
-->
<template>
  <div class="node_set">
    <el-row :gutter="10">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <div class="flow_node_name">
          <div class="title">流程节点名称</div>
          <div class="flow_timeline">
            <el-timeline>
              <el-timeline-item icon="el-icon-arrow-down" color="#409EFF">
                <div class="flow_node_select start" title="开始节点无法配置">
                  <span><i class="el-icon-video-play"></i>开始</span>
                </div>
              </el-timeline-item>
              <el-timeline-item
                icon="el-icon-arrow-down"
                color="#409EFF"
                v-for="(item, index) in nodeTreeList"
                :key="index"
              >
                <div
                  class="flow_node_select"
                  :class="{ active: currentIndex === index }"
                  @click="handleClick(index, item)"
                >
                  <span><i class="el-icon-user"></i>{{ item.nodeName }}</span>
                </div>
              </el-timeline-item>
              <el-timeline-item icon="el-icon-arrow-down" color="#409EFF">
                <div class="flow_node_select end" title="结束节点无法配置">
                  <span><i class="el-icon-circle-check"></i>结束</span>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </el-col>
      <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
        <div class="flow_set">
          <el-collapse-transition>
            <div class="flow_set_cover" v-show="firstLoad">
              <div class="empty_box">
                <img src="@/assets/image/empty.png" alt="" />
                <p>请点击节点名称查看</p>
              </div>
            </div>
          </el-collapse-transition>

          <div>
            <el-tabs>
              <el-tab-pane label="选项配置">
                <div class="topArea">
                  <el-form
                    label-position="right"
                    :model="topForm"
                    label-width="100px"
                  >
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="节点名称:">
                          <el-input
                            v-model="nodeName"
                            size="mini"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="节点别名:">
                          <el-input
                            size="mini"
                            placeholder="请输入节点别名"
                            v-model="topForm.nodeAlias"
                            clearable
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="节点属性:">
                          <el-radio-group
                            v-model="topForm.signFlag"
                            fill="#13ce66"
                          >
                            <el-radio
                              :label="0"
                              border
                              size="mini"
                              style="margin-right: 10px"
                              >审批节点</el-radio
                            >
                            <el-radio :label="1" border size="mini"
                              >会签节点</el-radio
                            >
                            <el-radio :label="2" border size="mini"
                              >抄送节点</el-radio
                            >
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="自动处理:">
                          <el-select
                            size="mini"
                            v-model="topForm.jumpFlag"
                            style="width: 100%"
                            placeholder="请选择"
                            clearable
                          >
                            <el-option
                              v-for="item in tgOption"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="自动跳过规则:">
                          <el-select
                            size="mini"
                            v-model="topForm.skipRule"
                            style="width: 100%"
                            placeholder="请选择跳过规则"
                            clearable
                          >
                            <el-option
                              v-for="item in skipRuleOption"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="允许作废:" label-width="100px">
                          <el-radio-group
                            v-model="topForm.stopFlag"
                            fill="#13ce66"
                          >
                            <el-radio
                              :label="1"
                              border
                              size="mini"
                              style="margin-right: 10px"
                              >是</el-radio
                            >
                            <el-radio :label="0" border size="mini"
                              >否</el-radio
                            >
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="允许回退:" label-width="100px">
                          <el-radio-group
                            v-model="topForm.backFlag"
                            fill="#13ce66"
                          >
                            <el-radio
                              :label="1"
                              border
                              size="mini"
                              style="margin-right: 10px"
                              >是</el-radio
                            >
                            <el-radio :label="0" border size="mini"
                              >否</el-radio
                            >
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label="可回退环节:"
                          label-width="100px"
                          v-if="topForm.backFlag == 1"
                        >
                          <el-select
                            v-model="topForm.backActivityList"
                            multiple
                            placeholder="请选择"
                            size="small"
                            style="width: 100%"
                          >
                            <el-option
                              v-for="item in htOption"
                              :key="item.nodeCode"
                              :label="item.nodeName"
                              :value="item.nodeCode"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <div class="checkboxgroup">
                      <el-checkbox v-model="topForm.nodeEndEventFlag"
                        >节点结束需要执行事件</el-checkbox
                      >
                      <el-checkbox v-model="topForm.nodeEndEventFlag"
                        >节点结束需要执行事件</el-checkbox
                      >
                    </div>
                  </el-form>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div style="margin-top: 20px">
            <el-tabs>
              <el-tab-pane label="审批人员">
                <div class="topArea">
                  <el-form
                    label-position="right"
                    :model="topForm"
                    label-width="100px"
                  >
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item label="找人方式:">
                          <el-radio-group
                            v-model="topForm.findUserType"
                            fill="#13ce66"
                            @change="changeRadio"
                          >
                            <el-radio
                              :label="0"
                              border
                              size="mini"
                              style="margin-right: 10px"
                              >固定找人</el-radio
                            >
                            <el-radio :label="1" border size="mini"
                              >动态找人</el-radio
                            >
                            <el-radio :label="2" border size="mini"
                              >上一环节选择人员</el-radio
                            >
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="找人限制规则:">
                          <el-checkbox v-model="topForm.findUserLimitRules"
                            >发起人公司内</el-checkbox
                          >
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="radio === 0">
                        <el-form-item
                          label="固定用户:"
                          label-width="100px"
                          class="userInput"
                        >
                          <el-select
                            v-model="topForm.userIds"
                            placeholder="搜索并选择固定用户"
                            clearable
                            multiple
                            size="mini"
                            style="width: 100%"
                            filterable
                          >
                            <el-option
                              v-for="item in userList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                              <span style="float: left"
                                >{{ item.label }} ({{ item.account }})-{{
                                  item.deptName
                                }}</span
                              >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="radio === 0">
                        <el-form-item label="岗位:">
                          <el-select
                            v-model="topForm.stationIds"
                            placeholder="搜索并选择岗位"
                            clearable
                            multiple
                            size="mini"
                            style="width: 100%"
                            filterable
                          >
                            <el-option
                              v-for="item in postList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                              <span style="float: left"
                                >{{ item.label }} ({{ item.postCode }})</span
                              >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="radio === 0">
                        <el-form-item label="角色:">
                          <el-select
                            v-model="topForm.roleIds"
                            placeholder="搜索并选择角色"
                            clearable
                            multiple
                            size="mini"
                            style="width: 100%"
                            filterable
                          >
                            <el-option
                              v-for="item in roleList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                              <span style="float: left"
                                >{{ item.label }} ({{ item.roleAlias }})</span
                              >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="radio === 0">
                        <el-form-item label="部门:">
                          <avue-input-tree
                            default-expand-all
                            v-model="topForm.orgIds"
                            placeholder="请选择部门"
                            type="tree"
                            :dic="deptList"
                            size="mini"
                            style="width: 100%"
                            multiple
                          ></avue-input-tree>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="radio === 0">
                        <el-form-item label="群组:">
                          <el-select
                            v-model="topForm.groupIds"
                            placeholder="搜索并选择群组"
                            clearable
                            multiple
                            size="mini"
                            style="width: 100%"
                            filterable
                          >
                            <el-option
                              v-for="item in groupList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                              <span style="float: left"
                                >{{ item.label }} ({{ item.groupCode }})</span
                              >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" v-if="radio === 1">
                        <el-form-item
                          label="找人方法:"
                          label-width="100px"
                          class="userInput"
                        >
                          <el-radio-group
                            v-model="topForm.findUserMethod"
                            size="mini"
                            @change="thodForm"
                          >
                            <el-radio label="1000" border>流程发起人</el-radio>
                            <el-radio label="1010" border>直接上级</el-radio>
                            <el-radio label="1020" border>高二级</el-radio>
                            <el-radio label="1030" border>部门负责人</el-radio>
                            <el-radio label="1040" border
                              >部门分管领导</el-radio
                            >
                            <el-radio label="1050" border
                              >流程环节审批人</el-radio
                            >
                            <el-radio label="1055" border
                              >表单变量审批人</el-radio
                            >
                            <el-radio label="1060" border
                              >流程变量审批人</el-radio
                            >
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-show="radio === 1 && keyShow1">
                        <el-form-item label="参数:">
                          <el-select
                            size="mini"
                            clearable
                            v-model="topForm.findUserKey1"
                            placeholder="请选择"
                            style="width: 100%"
                            @change="keyChange"
                          >
                            <el-option
                              v-for="item in selections"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-show="radio === 1 && keyShow2">
                        <el-form-item label="流程节点:">
                          <el-select
                            v-model="topForm.findUserKey2List"
                            multiple
                            placeholder="请选择"
                            size="mini"
                            style="width: 100%"
                          >
                            <el-option
                              v-for="item in segment"
                              :key="item.nodeCode"
                              :label="item.nodeName"
                              :value="item.nodeCode"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-show="radio === 1 && keyShow3">
                        <el-form-item label="部门:">
                          <avue-input-tree
                            default-expand-all
                            v-model="topForm.findUserKey3List"
                            placeholder="请选择内容"
                            type="tree"
                            :dic="deptList"
                            size="mini"
                            style="width: 100%"
                            multiple
                          ></avue-input-tree>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-show="radio === 1 && keyShow4">
                        <el-form-item label="流程变量名:">
                          <el-input
                            size="mini"
                            v-model="topForm.findUserKey4"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-show="radio === 1 && keyShow5">
                        <el-form-item label="表单字段:">
                          <el-select
                            v-model="topForm.findUserKey5"
                            placeholder="请选择字段"
                            size="mini"
                            clearable
                            filterable
                            >
                            <el-option
                              v-for="item in modelFiled"
                              :key="item.id"
                              :label="item.fieldAndModelRemark"
                              :value="item.modelAndField"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  processNodeTree,
  getProcessNodesForDict,
  getUserInfoByIds,
  getAll,
  getAllSys,
  deptTree,
} from "@/api/flow/flow";
import { user_code, postDetail } from "@/api/system/group";
import { groupBySearch } from "@/api/system/role";
import { roleDetail, deptDetail } from "@/api/system/user";
import { mapState } from "vuex";
export default {
  data() {
    return {
      nodeTreeList: [],
      currentIndex: -1,
      radio: 0,
      form: {},
      nodeName: "",
      topForm: {},
      findUserTypeSelect: {
        findUserType: "",
      },
      topForm: {
        userIds: [],
        stationIds: [],
        roleIds: [],
        orgIds: [],
        groupIds: [],
      },
      topForm: {},
      modifyOptions: [
        {
          label: "无需修改",
          value: 0,
        },
        {
          label: "允许修改",
          value: 1,
        },
        {
          label: "必须修改",
          value: 2,
        },
      ],
      tgOption: [
        {
          label: "相同审批人自动处理",
          value: 0,
        },
        {
          label: "相邻环节相同审批人自动处理",
          value: 1,
        },
        {
          label: "不自动处理",
          value: 2,
        },
      ],
      backOptions: [
        {
          label: "不允许",
          value: 0,
        },
        {
          label: "回退到发起人",
          value: 1,
        },
        {
          label: "回退到上一节点",
          value: 2,
        },
        {
          label: "回退到自由节点",
          value: 3,
        },
      ],
      skipRuleOption: [
        {
          label: "无审批人自动跳过",
          value: "1",
        },
        {
          label: "部门负责人自动跳过",
          value: "2",
        },
        {
          label: "无审批人自动完成流程",
          value: "3",
        },
      ],
      findUserOption: [
        {
          label: "流程发起人",
          value: "1000",
        },
        {
          label: "直接上级",
          value: "1010",
        },
        {
          label: "高二级",
          value: "1020",
        },
        {
          label: "部门负责人",
          value: "1030",
        },
        {
          label: "分管领导",
          value: "1040",
        },
        {
          label: "流程环节审批人",
          value: "1050",
        },
        {
          label: "流程变量审批人",
          value: "1060",
        },
      ],
      selections1: [
        {
          label: "流程发起人",
          value: "1",
        },
        {
          label: "流程审批环节",
          value: "2",
        },
      ],
      selections2: [
        {
          label: "流程发起部门",
          value: "1",
        },
        {
          label: "选择部门",
          value: "2",
        },
        {
          label: "流程审批环节",
          value: "3",
        },
      ],
      htOption: [],
      userList: [],
      postList: [],
      roleList: [],
      deptList: [],
      groupList: [],
      firstLoad: false,
      keyShow1: false,
      keyShow2: false,
      keyShow3: false,
      keyShow4: false,
      keyShow5: false,
      selections: [],
      segment: [],
    };
  },

  computed: {
    ...mapState("Home", ["modelFiled"]),
  },

  methods: {
    //找人方法的change事件
    thodForm(val) {
      this.topForm.findUserKey1 = "";
      this.topForm.findUserKey2List = [];
      this.topForm.findUserKey3List = [];
      if (val == "1000") {
        this.keyShow1 = false;
        this.keyShow2 = false;
        this.keyShow3 = false;
        this.keyShow4 = false;
        this.keyShow5 = false;
      } else if (val == "1010") {
        this.selections = this.selections1;
        this.keyShow1 = true;
        this.keyShow2 = false;
        this.keyShow3 = false;
        this.keyShow4 = false;
        this.keyShow5 = false;
      } else if (val == "1020") {
        this.selections = this.selections1;
        this.keyShow1 = true;
        this.keyShow2 = false;
        this.keyShow3 = false;
        this.keyShow4 = false;
        this.keyShow5 = false;
      } else if (val == "1030") {
        this.selections = this.selections2;
        this.keyShow1 = true;
        this.keyShow2 = false;
        this.keyShow3 = false;
        this.keyShow4 = false;
        this.keyShow5 = false;
      } else if (val == "1040") {
        this.selections = this.selections2;
        this.keyShow1 = true;
        this.keyShow2 = false;
        this.keyShow3 = false;
        this.keyShow4 = false;
        this.keyShow5 = false;
      } else if (val == "1050") {
        this.keyShow1 = false;
        this.keyShow2 = true;
        this.keyShow3 = false;
        this.keyShow4 = false;
        this.keyShow5 = false;
      } else if (val == "1060") {
        this.keyShow1 = false;
        this.keyShow2 = false;
        this.keyShow3 = false;
        this.keyShow4 = true;
        this.keyShow5 = false;
      } else if (val == "1055") {
        this.keyShow1 = false;
        this.keyShow2 = false;
        this.keyShow3 = false;
        this.keyShow4 = false;
        this.keyShow5 = true;
      }
    },
    keyChange(val) {
      this.topForm.findUserKey2List = [];
      this.topForm.findUserKey3List = [];
      if (this.selections == this.selections1) {
        if (val == "1") {
          this.keyShow2 = false;
          this.keyShow3 = false;
        } else if (val == "2") {
          this.keyShow2 = true;
          this.keyShow3 = false;
        }
      } else if (this.selections == this.selections2) {
        if (val == "1") {
          this.keyShow2 = false;
          this.keyShow3 = false;
        } else if (val == "2") {
          this.keyShow2 = false;
          this.keyShow3 = true;
        } else if (val == "3") {
          this.keyShow2 = true;
          this.keyShow3 = false;
        }
      }
    },
    handleClick(index, item) {
      this.currentIndex = index;
      this.firstLoad = false;
      this.nodeName = item.nodeName;
      // 点击节点时先执行赋值操作，将节点中的信息显示在右侧表单
      this.topForm = item;
      if (this.topForm.findUserLimitRules == "1") {
        this.topForm.findUserLimitRules = true;
      } else {
        this.topForm.findUserLimitRules = false;
      }
      this.topForm = item;
      this.findUserTypeSelect = item;
      this.radio = item.findUserType;
      this.topForm = item;
      if (this.topForm.findUserMethod != "") {
        this.keyShow1 = false;
        this.keyShow2 = false;
        this.keyShow3 = false;
        this.keyShow4 = false;
        this.keyShow5 = false;

        if (this.topForm.findUserMethod == "1000") {
          this.keyShow1 = false;
          this.keyShow2 = false;
          this.keyShow3 = false;
          this.keyShow4 = false;
          this.keyShow5 = false;
        } else if (this.topForm.findUserMethod == "1010") {
          this.selections = this.selections1;
          this.keyShow1 = true;
          this.keyShow4 = false;
          this.keyShow5 = false;

          if (this.topForm.findUserKey1 == "1") {
            this.keyShow2 = false;
            this.keyShow3 = false;
          } else if (this.topForm.findUserKey1 == "2") {
            this.keyShow2 = true;
            this.keyShow3 = false;
          } else {
            this.keyShow2 = false;
            this.keyShow3 = false;
          }
        } else if (this.topForm.findUserMethod == "1020") {
          this.selections = this.selections1;
          this.keyShow1 = true;
          this.keyShow4 = false;
          this.keyShow5 = false;

          if (this.topForm.findUserKey1 == "1") {
            this.keyShow2 = false;
            this.keyShow3 = false;
          } else if (this.topForm.findUserKey1 == "2") {
            this.keyShow2 = true;
            this.keyShow3 = false;
          } else {
            this.keyShow2 = false;
            this.keyShow3 = false;
          }
        } else if (this.topForm.findUserMethod == "1030") {
          this.selections = this.selections2;
          this.keyShow1 = true;
          this.keyShow4 = false;
          this.keyShow5 = false;

          if (this.topForm.findUserKey1 == "1") {
            this.keyShow2 = false;
            this.keyShow3 = false;
          } else if (this.topForm.findUserKey1 == "2") {
            this.keyShow2 = false;
            this.keyShow3 = true;
          } else if (this.topForm.findUserKey1 == "3") {
            this.keyShow2 = true;
            this.keyShow3 = false;
          } else {
            this.keyShow2 = false;
            this.keyShow3 = false;
          }
        } else if (this.topForm.findUserMethod == "1040") {
          this.selections = this.selections2;
          this.keyShow1 = true;
          this.keyShow4 = false;
          this.keyShow5 = false;

          if (this.topForm.findUserKey1 == "1") {
            this.keyShow2 = false;
            this.keyShow3 = false;
          } else if (this.topForm.findUserKey1 == "2") {
            this.keyShow2 = false;
            this.keyShow3 = true;
          } else if (this.topForm.findUserKey1 == "3") {
            this.keyShow2 = true;
            this.keyShow3 = false;
          } else {
            this.keyShow2 = false;
            this.keyShow3 = false;
          }
        } else if (this.topForm.findUserMethod == "1050") {
          this.keyShow2 = true;
          this.keyShow3 = false;
          this.keyShow4 = false;
          this.keyShow5 = false;
        } else if (this.topForm.findUserMethod == "1060") {
          this.keyShow1 = false;
          this.keyShow2 = false;
          this.keyShow3 = false;
          this.keyShow4 = true;
          this.keyShow5 = false;
        } else if (this.topForm.findUserMethod == "1055") {
          this.keyShow1 = false;
          this.keyShow2 = false;
          this.keyShow3 = false;
          this.keyShow4 = false;
          this.keyShow5 = true;
        }
      }
    },
    getUserList() {
      getAll().then((res) => {
        this.userList = res.data.data;
        this.userList.forEach((ele) => {
          (ele.label = ele.realName), (ele.value = ele.id);
        });
      });
    },
    getAllList() {
      getAllSys().then((res) => {
        this.postList = res.data.data.postList;
        this.postList.forEach((ele) => {
          (ele.label = ele.postName), (ele.value = ele.id);
        });
        this.groupList = res.data.data.groupList;
        this.groupList.forEach((ele) => {
          (ele.label = ele.groupName), (ele.value = ele.id);
        });
        this.roleList = res.data.data.roleList;
        this.roleList.forEach((ele) => {
          (ele.label = ele.roleName), (ele.value = ele.id);
        });
      });
    },
    deptTree() {
      deptTree().then((res) => {
        this.deptList = res.data.data;
        this.deptList.forEach((ele) => {
          (ele.label = ele.title), (ele.value = ele.id);
          if (ele.hasChildren) {
            this.hdDept(ele.children);
          }
        });
      });
    },
    hdDept(children) {
      children.forEach((ele) => {
        (ele.label = ele.title), (ele.value = ele.id);
        if (ele.hasChildren) {
          this.hdDept(ele.children);
        }
      });
    },
    getBack(proDefId) {
      getProcessNodesForDict(proDefId).then((res) => {
        this.htOption = res.data.data;
        this.htOption.unshift({ nodeName: "所有环节", nodeCode: "1" });
      });
      getProcessNodesForDict(proDefId).then((res) => {
        this.segment = res.data.data;
      });
    },
    changeRadio(value) {
      this.radio = value;
    },

    async queryList(proDefId) {
      const { data: res } = await processNodeTree(proDefId);
      const { data } = res;
      this.nodeTreeList = data;
      if (this.nodeTreeList.length > 0) {
        this.nodeTreeList.forEach((item) => {
          if (item.nodeStartEventFlag == 1) {
            item.nodeStartEventFlag = true;
          } else {
            item.nodeStartEventFlag = false;
          }
          if (item.nodeEndEventFlag == 1) {
            item.nodeEndEventFlag = true;
          } else {
            item.nodeEndEventFlag = false;
          }
        });
      }
    },

    remoteUserMethod(keywords) {
      this.useSearchByType("user", keywords);
    },

    remotePostMethod(keywords) {
      this.useSearchByType("post", keywords);
    },

    remoteRoleMethod(keywords) {
      this.useSearchByType("role", keywords);
    },

    remoteDeptMethod(keywords) {
      this.useSearchByType("dept", keywords);
    },

    remoteGroupMethod(keywords) {
      this.useSearchByType("group", keywords);
    },

    // 查询方法的封装
    async useSearchByType(type, keywords) {
      switch (type) {
        case "user":
          const { data: user } = await user_code(keywords);
          this.userList = user.data;
          this.userList.forEach((item) => {
            (item.label = item.realName), (item.value = item.id);
          });
          break;
        case "post":
          const { data: post } = await postDetail(keywords);
          this.postList = post.data;
          this.postList.forEach((item) => {
            (item.label = item.postName), (item.value = item.id);
          });
          break;
        case "group":
          const { data: group } = await groupBySearch(keywords);
          this.groupList = group.data;
          this.groupList.forEach((item) => {
            (item.label = item.groupName), (item.value = item.id);
          });
          break;
        case "dept":
          const { data: dept } = await deptDetail(keywords);
          this.deptList = dept.data;
          this.deptList.forEach((item) => {
            (item.label = item.deptName), (item.value = item.id);
          });
          break;
        case "role":
          const { data: role } = await roleDetail(keywords);
          this.roleList = role.data;
          this.roleList.forEach((item) => {
            (item.label = item.roleName), (item.value = item.id);
          });
          break;
        default:
          break;
      }
    },
  },
  create() {},
};
</script>

<style lang="scss" scoped>
.node_set {
  height: 80vh;
  .flow_node_name {
    border: 1px solid #ccc;
    height: 850px;
    overflow-y: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    .flow_timeline {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
    .title {
      width: 100%;
      height: 50px;
      text-align: center;
      line-height: 50px;
      background: #fff;
      color: #409eff;
      font-weight: 500;
      overflow: hidden;
      text-overflow: clip;
      border-bottom: 1px solid #ccc;
    }

    .flow_node_select {
      text-align: center;
      padding: 5px;
      width: 200px;
      word-wrap: break-word;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      border-radius: 4px;

      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease-in-out;
        // scale: (5);
        transform: scale(1.1);
      }

      span i {
        margin-right: 5px;
      }
    }
    .active {
      background: #409eff;
      color: #fff;
    }

    .start {
      background: #67c23a;
      color: #fff;
      cursor: help;
    }

    .end {
      background: #f56c6c;
      color: #fff;
      cursor: help;
    }
  }
  .flow_set {
    border: 1px solid #ccc;
    overflow: auto;
    height: 850px;
    padding: 10px 20px;
    position: relative;
    display: flex;
    flex-direction: column;

    .topArea {
      padding: 20px;

      .checkboxgroup {
        margin-top: 15px;
        margin-left: 100px;
      }
    }

    .flow_set_cover {
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: #fff;
      text-align: center;
      color: #fff;
      z-index: 10;
      left: 0;
      top: 0;
      text-align: center;
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;
      img {
        width: 200px;
        height: 120px;
      }
      p {
        color: #909399;
        margin-top: 30px;
        font-size: 14px;
      }
    }
    .find_type_select {
      padding: 10px;
    }
    .find_type_fixed {
      padding: 20px 50px;
      margin-top: 10px;
    }
    .top {
      margin-top: 30px;
    }

    .pading {
      padding: 20px 20px;
    }

    .find_type_permssion {
      border: 1px dashed #ccc;
      padding: 20px 50px;
      margin-top: 10px;
    }
  }
}
.el-form-item {
  margin-bottom: 10px;
}
.el-radio {
  margin-right: 3px;
}

/deep/.el-form-item {
  margin-bottom: 10px;
}
</style>
