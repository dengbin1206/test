<template>
    <div>
        <el-form-item label="隐藏标题">
        <!-- <el-switch v-model="data.labelDisplay" :active-value="false" :inactive-value="true" ></el-switch> -->
        <el-switch v-model="data.hideLable" :active-value="0" :inactive-value="1"></el-switch>
        </el-form-item>
        <el-form-item label="默认文本">
            <el-input v-model="data.params.title" placeholder="输入默认文本"></el-input>
        </el-form-item>
        <el-form-item label="文本位置">
            <el-select v-model="data.params.center" placeholder="选择文本位置">
                <el-option label="左侧" :value="false"></el-option>
                <el-option label="居中" :value="true"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="边距">
            <el-input v-model="data.labelWidth" placeholder="输入边距" value="0px">  
            </el-input>
        </el-form-item>
    </div>
</template>

<script>
export default {
  name: "config-warning",
  props: ["data"],
    data(){
        return{

        }
    }
}
</script>