<template>
    <el-dialog
        modal-append-to-body
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        title="选值"
        :visible.sync="justDiv"
        width="30%"
        :before-close="handjustDiv">
        <el-row>
            <el-col>
                <el-input style="width:80%;margin-right:15px;" size="small" v-model="dataValue"></el-input>
                <el-button type="primary" size="small" @click='searchBtn'>查询</el-button>
            </el-col>
        </el-row>
        <el-row style="margin-top:10px;">
            <el-table
                :data="tableData"
                border
                size='small'
                @selection-change="chockChange"
                style="width: 100%;height:400px;">
                <el-table-column
                    type="selection"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="value"
                    label="键"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="label"
                    label="值">
                </el-table-column>
            </el-table>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit" size="small">确 定</el-button>
            <el-button @click="handjustDiv" size="small">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {getDataByCodeAndName} from "@/api/system/role"
export default {
    data () {
        return {
            justDiv:false,
            dataValue:'',
            tableData:[],
            fieldId:'',
            checkData:'',
            byType:'',
            row:{}
        }
    },methods: {
        open(justDiv,row,byType){
            this.justDiv=justDiv,
            this.row=row
            this.fieldId=row.id
            this.byType=byType
            this.dataValue=''
            this.tableData=[]
            this.checkData=''
        },
        handjustDiv(){
            this.justDiv=false
        },
        searchBtn(){
            getDataByCodeAndName(this.fieldId,this.dataValue).then(res=>{
                this.tableData=res.data.data
            })
        },
        chockChange(val){
            var old=[]
            if(val.length>0){
                val.forEach(ele=>{
                    old.push(ele.value)
                })
                this.checkData=old.join(',')
            }
        },
        submit(){
            this.$emit('func',{checkData:this.checkData,byType:this.byType,row:this.row})
            this.justDiv=false
        }
    }
}
</script>
