<template>
    <div style="width:100%;padding:0 20px;">
        <el-row>
            <h3>派工信息</h3>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="productAdd" style="margin-bottom:5px;">插入行</el-button>
            <el-button type="primary" size="small"  @click="productSave" :loading="btnLoading" style="margin-bottom:5px;">保存</el-button>
            <el-button type="primary" size="small"  @click="productSub"  :loading="btnsLoading" style="margin-bottom:5px;">发起派工</el-button>
            <el-table
                :data="addList.dispatchSheetList"
                :header-cell-style="{'background':'rgb(250, 250, 250)','text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                height='500'
                max-height="500"
                border
                size='small'
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type='index' width="55"></el-table-column>
                <el-table-column  prop="rowNumber" label="行号" width="70"></el-table-column>
                <el-table-column prop="serviceEngineerId" label="服务工程师" width="150">
                    <template slot-scope="scope">
                        <el-select size="small" v-model="scope.row.serviceEngineerId" value-key="id" filterable remote clearable  reserve-keyword placeholder="请输入关键词" :remote-method="(query)=>{getEngineerId(query,scope.row)}" style="width:100%">
                                <el-option
                                    v-for="item in scope.row.serviceEngineerIds"
                                    :key="item.id"
                                    :label="item.realName"
                                    :value="item.id">
                                    <span style="float: left">{{ item.realName}} ({{item.account}})-{{item.deptName}}</span>
                                </el-option>
                            </el-select>
                    </template>
                </el-table-column>
                <el-table-column  prop="isCharge" label="负责人" width="70">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.isCharge" :true-label="1" :false-label="0"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column  prop="taskRemark" label="本次任务描述" width="300">
                        <template slot-scope="scope"><el-input v-model="scope.row.taskRemark" size="small" placeholder="请输入本次任务描述"></el-input></template>
                </el-table-column>
                <el-table-column  prop="dispatchDate" label="派工日期" width="150"></el-table-column>
                <el-table-column  prop="sheetStatus" label="工单状态" width="150">
                    <template slot-scope="scope"><span v-if='scope.row.sheetStatus==0'>未读</span><span v-if='scope.row.sheetStatus==1'>已读</span></el-input></template>
                </el-table-column>
                <el-table-column  prop="taskStatus" label="签卡状态" width="150">
                    <template slot-scope="scope"><span v-if='scope.row.taskStatus==0'>未签</span><span v-if='scope.row.taskStatus==1'>已签</span></el-input></template>
                </el-table-column>
                <el-table-column  prop="oddNum" label="工单号" width="150"></el-table-column>
                <el-table-column label="操作"  width='80' fixed="right">
                    <template slot-scope="scope">
                        <el-button icon='el-icon-delete' size="small" type="text"  @click="productDel(scope.row,scope.$index)" style="color:red">删除</el-button> 
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </div>
</template>
<script>
import {list,submit} from '@/api/biz/cs/pgxx'
import {getUserInfoBySearch} from '@/api/biz/crm/xmbd'
import { modelByName } from "@/api/biz/sbgl";
import website from "@/config/website";
import { getToken } from "@/util/auth";
import { asyncUploadAction, uploadList, startFlow } from "@/api/tool/dynamic";
export default {
    props:{
        turnoff: {
            type: Function,
            default: null
        },
    },
    data () {
        return {
            addList:{
                dispatchSheetList:[],
                delDispatchSheetIds:[]
            },
            btnLoading:false,
            btnsLoading:false,
            relateId:'',
            serviceType:'',
            selectList:[]
        }
    },
    methods: {
        confirmProcess(rowId,type){
            list(rowId,type).then(res=>{
                this.addList.dispatchSheetList=res.data.data
                if(this.addList.dispatchSheetList.length>0){
                    this.addList.dispatchSheetList.forEach(item=>{
                        item.serviceEngineerIds=[]
                        item.serviceEngineerIds.push(item.engineerObj)
                    })
                }
            })
            this.relateId=rowId
            this.serviceType=type
            this.selectList=[]
            this.btnLoading=false
            this.btnsLoading=false
        },
        productAdd(){
            this.addList.dispatchSheetList.push({
                relateId:this.relateId,
                serviceType:this.serviceType,
                sheetStatus:0,
                serviceEngineerId:''
            })
            this.addList.dispatchSheetList.forEach((item,index)=>{
                item.rowNumber=(index+1)*10
            })
        },
        productDel(row,index){
            this.addList.dispatchSheetList.splice(index,1)
            this.addList.dispatchSheetList.forEach((item,index)=>{
                item.rowNumber=(index+1)*10
            })
            if(row.id){
                this.addList.delDispatchSheetIds.push(row.id)
            }
        },
        getEngineerId(query,row){
            if(query!=''){
                getUserInfoBySearch(query).then(res=>{
                    this.$set(row,'serviceEngineerIds',res.data.data)
                })
            }else{
                this.$set(row,'serviceEngineerIds',[])
            }
        },
        productSave(){
            let arrList=this.addList.dispatchSheetList.filter(item=>{
                return item.serviceEngineerId==''
            })
            if(arrList.length>0){
                this.$message({
                         message: '服务工程师必填',
                         type: "warning"
                     });
            }else if(arrList.length<1){
                this.btnLoading=true
                submit(this.addList).then(res=>{
                    if(res.data.code=='200'){
                        this.$message({
                            message: '保存成功',
                            type: "success"
                        });
                        list(this.relateId,this.serviceType).then(res=>{
                            this.addList.dispatchSheetList=res.data.data
                            if(this.addList.dispatchSheetList.length>0){
                                this.addList.dispatchSheetList.forEach(item=>{
                                    item.serviceEngineerIds=[]
                                    item.serviceEngineerIds.push(item.engineerObj)
                                })
                            }
                        })
                        this.btnLoading=false
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: "erroe"
                        });
                        this.btnLoading=false
                    }
                })
            }
        },
        productSub(){
            let arrList=this.addList.dispatchSheetList.filter(item=>{
                return !item.id
            })
            if(arrList.length>0){
                this.$message({
                         message: '请先保存再发起派工',
                         type: "warning"
                     });
            }else if(arrList.length<1){
                if(this.selectList.length!=1){
                    this.$message({
                         message: '请选择一条数据发起派工',
                         type: "warning"
                     });
                }else{
                    this.btnsLoading=true
                    this.getModel('CS_PGD')
                }
            }
        },
        handleSelectionChange(val){
            this.selectList=val
        },
        //获取模型Id
        getModel(modelName) {
            modelByName(modelName).then(res => {
                if (res.data.code == 200) {
                this.startFlow(res.data.data.id);
                }
            });
        },
        //启动流程
        startFlow(id) {
            startFlow({
                flowKey: "CS_PGD_DART",
                formType: "S",
                modelId: id,
                dataId: this.selectList[0].id,
                variables: {
                functionPath: this.$route.fullPath
                }
            }).then(res => {
                if ((res.data.code = 200)) {
                    this.$message({
                        type: "success",
                        message: res.data.msg
                    });
                    this.turnoff()
                }
            });
        },
    },
    created () {
    }
}
</script>
<style>

</style>
