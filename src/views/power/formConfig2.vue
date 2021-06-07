<template>
    <div>
        <el-dialog
            append-to-body
            :close-on-click-modal="false"
            title="表单配置权限对象"
            :visible.sync="dialogVisible"
            :before-close="close"
            class="sx_formConfig_dialog"
            >
            <el-button type="primary" size="small" icon="el-icon-plus"  @click="rowAdd" style="margin-bottom:5px;">新增</el-button>
            <el-dialog
                append-to-body
                title="新增"
                :visible.sync="display"
                width="25%"
                :before-close="displayClose">
                <span style="margin-left:30px;">权限对象: </span>
                    <avue-select v-model="selection" placeholder="请选择权限对象"  :dic="tableData" class="sx_formConfig_select"></avue-select>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="displaySubmit" size="small" icon="el-icon-check">确 定</el-button>
                    <el-button @click="displayClose" size="small" icon="el-icon-close">取 消</el-button>
                </span>
            </el-dialog>
            <el-table
                :data="modelTreeData"
                style="width: 100%;height:390px;overflow: auto;"
                row-key="randomId"
                border
                lazy
                default-expand-all
                :load="load"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}" class="sx_formConfig_table">
                <el-table-column
                type="index"
                width="50">
                </el-table-column>
                <el-table-column
                prop="remark"
                label="权限对象">
                </el-table-column>
                <el-table-column
                prop="modelName"
                label="模型">
                    <template slot-scope="scope" v-if="(!scope.row.children)">
                        <el-select v-model="scope.row.modelId" clearable slot="prepend" placeholder="请选择" size="small" @change="modelChange(scope.row)">
                            <el-option v-for="e in modelOptions" :value="e.id" :label="e.tableRemark" :key="e.id"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                prop="fieldRemark"
                label="模型字段">
                    <template slot-scope="scope" v-if="(!scope.row.children)">
                        <el-select v-model="scope.row.fieldRemark" clearable slot="prepend" placeholder="请选择" size="small">
                            <el-option v-for="e in scope.row.codes" :value="e.id" :label="e.dbFieldRemark" :key="e.id"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column header-align="center"
                align="center"
                width="70"
                label="操作">
                    <template slot-scope="scope" v-if="(scope.row.children)">
                        <el-button size="small"  type="text" style="color:red;" @click="tableDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer">
                <el-button type="primary" @click="submit" size="small" icon="el-icon-check">确 定</el-button>
                <el-button @click="close" size="small" icon="el-icon-close">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {LazyList,getModelByFormId,getModelCode,getPowerObjById,getListByFormId,savePowerObj,getModelsByModelId,saveByModelId,getListByModelId} from '@/api/power/formConfig'

export default {
    data() {
        return {
            display:false,
            dialogVisible:false,
            modelTreeData:[],
            tableData:[],
            modelOptions:[],
            codes:[],
            selection:'',
            addData:{},
            powerFormIds:[],
            formId:'',
            byType:''
        }
    },
    methods: {
        open(dialog,formId,byType){
            this.dialogVisible=dialog
            this.formId=formId
            this.byType=byType
            if(this.byType==='M'){
                 getListByModelId(this.formId).then(res=>{
                this.modelTreeData=res.data.data
                if(this.modelTreeData.length>0){
                    this.modelTreeData.forEach((item,index)=>{
                        item.rowIndex=index
                        item.children.forEach(ele=>{
                               getModelCode(ele.modelId).then(res=>{
                                this.$set(ele,'codes',res.data.data)
                            })
                        })
                    })
                }
            })
            }else{
                getListByFormId(this.formId).then(res=>{
                this.modelTreeData=res.data.data
                if(this.modelTreeData.length>0){
                    this.modelTreeData.forEach((item,index)=>{
                        item.rowIndex=index
                        item.children.forEach(ele=>{
                               getModelCode(ele.modelId).then(res=>{
                                this.$set(ele,'codes',res.data.data)
                            })
                        })
                    })
                }
            })
            }

            if(this.byType==='M'){
                getModelsByModelId(this.formId).then(res=>{
                this.modelOptions=res.data.data
            })
            }else{
                getModelByFormId(this.formId).then(res=>{
                this.modelOptions=res.data.data
            })
            }
        },
        close(){
            this.dialogVisible=false
            this.modelTreeData=[]
        },
        submit(){
            if(this.byType==='M'){
                let row={
                    powerObjList:this.modelTreeData,
                    modelId:this.formId,
                    powerFormIds:this.powerFormIds
                }
                saveByModelId(row).then(()=>{
                this.$message({
                    type: "success",
                    message: "操作成功!"
                });
                this.modelTreeData=[]
                this.powerFormIds=[]
                this.dialogVisible=false
            })
            }else{
                let row={
                    powerObjList:this.modelTreeData,
                    formId:this.formId,
                    powerFormIds:this.powerFormIds
                }
                savePowerObj(row).then(()=>{
                this.$message({
                    type: "success",
                    message: "操作成功!"
                });
                this.modelTreeData=[]
                this.powerFormIds=[]
                this.dialogVisible=false
            })
            }
        },
        load(tree, treeNode, resolve) {
            setTimeout(() => {
            resolve(tree.children)
            }, 500)
        },
        modelChange(row){
            delete row.fieldRemark
            getModelCode(row.modelId).then(res=>{
                this.$set(row,'codes',res.data.data)
            })
        },
        rowAdd(){
            this.selection=''
            this.display=true
            LazyList().then(res=>{
                this.tableData=res.data.data
                this.tableData.forEach(item=>{
                    item.label=item.powerObjRemark
                    item.value=item.id
                })
            })
        },
        displaySubmit(){
            if(this.selection==''){
                this.$message({
                    message: '权限对象不能为空，请选择',
                    type: 'warning'
                });
            }else{
                getPowerObjById(this.selection).then(res=>{
                    this.addData=res.data.data
                    this.modelTreeData.push(this.addData)
                    this.modelTreeData.forEach((item,index)=>{
                        item.rowIndex=index
                    })
                })
                this.display=false
            }
        },
        displayClose(){
            this.display=false
        },
        tableDel(row){
            this.modelTreeData.splice(row.rowIndex,1)
            this.modelTreeData.forEach((item,index)=>{
                item.rowIndex=index
            })
            if(!row.rowId){
                this.powerFormIds.push(row.powerFormId)
            }
        }
    },

}
</script>
<style lang='scss' scoped>
  @import '../../styles/power/formConfig.scss';
</style>
