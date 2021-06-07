<!--<template>
  <div>
    <h1>Hello Noah</h1>
    <el-row>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
    下面是局部引入
    <x-button></x-button>
  </div>
</template>

<script>
  //import {getDetail} from '@/api/demo/demo';

    export default {
        name: "demo",
      /*created() {
          getDetail().then(res=>{
            console.log(res)
          });
      }*/
    }
</script>
<style scoped>
</style>-->

<template>
  <basic-container>
    <el-row>
      <el-col :span="24">
        <div class="tool-box">
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" @click="handleAdd">新增</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleMultiDelete">批量删除</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="data" @selection-change="selectChange" style="width: 100%">
        <el-table-column prop="id" type="selection" width="55"> </el-table-column>
        <el-table-column prop="title" label="标题" width="180"> </el-table-column>
        <el-table-column prop="content" label="内容"> </el-table-column>
        <el-table-column prop="time" label="日期" width="180"> </el-table-column>
        <el-table-column label="操作" fixed="right" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="" plain @click="handleView(scope.$index, scope.row)">查看 </el-button>
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑 </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        background
        :page-sizes="[10, 20, 30, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange"
        @current-change="currentChange"
        :total="page.total">
      </el-pagination>
    </el-row>
    <!--定义了一个dialog组件，并且包裹了表单组件 -->
    <el-dialog :title="dialogTitle" width="600px" :visible.sync="formVisible" @close="resetForm('demoForm')">
      <!--绑定form的数据、设定校验规则、定义表单别名 -->
      <el-form :model="demo" :rules="rules" ref="demoForm">
        <el-form-item label="标题" prop="title" label-width="55px">
          <el-input v-model="demo.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间" label-width="55px">
          <el-date-picker
            v-model="demo.time"
            style="width: 100%;"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            autocomplete="off">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内容" label-width="55px">
          <el-input v-model="demo.content" autocomplete="off" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <!--弹框底部的按钮以及点击事件 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button v-if="!viewMode" type="primary" @click="submitDemo('demoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>
<script>
  import {getList,submit,getDetail,remove} from '@/api/demo/demo'
  export default {
    //设置了vue双向绑定所需要的参数
    data() {
      return {
        // 是否显示
        formVisible: false,
        // dialog标题
        dialogTitle: '',
        // 是否查看
        viewMode: false,
        // 列表数据
        data: [],
        // 选中的数据
        multiSelection: [],
        // 分页数据
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        // 校验规则
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
          ]
        },
        // 表单映射模型
        demo: {
          id: '',
          title: '',
          content: '',
          time: '',
        }
      }
    },
    created() {
      this.onLoad();
    },
    computed: {
      ids() {
        let ids = [];
        this.multiSelection.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      onLoad() {
        getList().then(res => {
          this.data = res.data.data.records;
          this.page.total = res.data.data.total;
        })
      },
      selectChange(val) {
        this.multiSelection = val
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      //新增
      handleAdd() {
        this.dialogTitle = '新增Demo';
        this.formVisible = true;
        this.viewMode = false;
        console.log("add")
      },
      //查看
      handleView(index, row) {
        this.dialogTitle = '查看Demo';
        this.formVisible = true;
        this.viewMode = true;
        getDetail().then(res => {
          if (res.data.success) {
            this.demo = res.data.data;
          }
        });
        console.log("view");
        console.log(index);
        console.log(row);
      },
      //修改
      handleEdit(index, row) {
        this.dialogTitle = '修改Demo';
        this.formVisible = true;
        this.viewMode = false;
        getDetail().then(res => {
          if (res.data.success) {
            this.demo = res.data.data;
          }
        });
        console.log("edit");
        console.log(index);
        console.log(row);
      },
      //单行删除
      handleDelete(index, row) {
        //增加确认框，
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            remove().then(res => {
              if (res.data.success) {
                this.$message({
                  type: 'success',
                  message: '操作成功！'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            });
          });
        console.log("delete");
        console.log(index);
        console.log(row);
      },
      //多行删除
      handleMultiDelete() {
        console.log("multi-delete")
        console.log("multi-delete");
        if (this.multiSelection.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            remove().then(res => {
              if (res.data.success) {
                this.onLoad();
                this.$message({
                  type: 'success',
                  message: '操作成功！'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            });
          });
      },
      //定义了表单提交后执行的逻辑
      submitDemo(formName) {
        // 表单验证
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.demo);
            submit(this.demo).then(res => {
              if (res.data.success) {
                this.formVisible = false;
                this.$message({
                  type: 'success',
                  message: '操作成功！'
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-pagination {
    margin-top: 20px;
  }
</style>
