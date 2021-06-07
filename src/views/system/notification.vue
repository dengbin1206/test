<template>
  <basic-container>
    <el-row :gutter="10">
      <el-col :sm="4" :lg="4" :xs="4" :xl="4" :md="4">
        <div class="tree_menu">
          <div class="tree_title">
            <div><i class="iconfont iconfont-message"></i>信息</div>
            <div><i class="iconfont iconfont-edit"></i></div>
          </div>
          <div class="tree_content">
            <el-tree :data="data" :props="defaultProps"></el-tree>
          </div>
        </div>
      </el-col>
      <el-col :sm="20" :lg="20" :xs="20" :xl="20" :md="20">
        <div class="list_content">
          <el-row>
            <el-col></el-col>
            <el-col>
              <avue-crud :data="data2" :option="option" :page="page"></avue-crud>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </basic-container>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      page:{
        pageSize: 10,
        current: 1,
        total: 10
      },
      data2: [
        {
          name: "张三",
          sex: "男",
          date: "1994-02-23 00:00:00",
        },
        {
          name: "李四",
          sex: "女",
          date: "1994-02-23 00:00:00",
        },
        {
          name: "王五",
          sex: "女",
          date: "1994-02-23 00:00:00",
        },
        {
          name: "赵六",
          sex: "男",
          date: "1994-02-23 00:00:00",
        },
      ],
      option: {
        page: true,
        align: "center",
        menuAlign: "center",
        addBtn: false,
        columnBtn: false,
        refreshBtn: false,
        border: true,
        stripe: true,
        editBtn: false,
        maxHeight: 500,
        selection: true,
        tip: false,
        column: [
          {
            label: "姓名",
            prop: "name",
          },
          {
            label: "性别",
            prop: "sex",
          },
          {
            label: "日期",
            prop: "date",
            type: "date",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
          },
        ],
      },
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.tree_menu {
  width: 100%;
  height: 80vh;
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  border-top: 2px solid #0079fe;
  .tree_title {
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    i {
      font-size: 13px;
      color: #0079fe;
      cursor: pointer;
    }
  }
  .tree_content {
    flex: 1;
    overflow-y: scroll;
    padding-top: 10px;
  }
}

.list_content {
  width: 100%;
  height: 80vh;
  border: 1px solid #ebeef5;
  padding: 20px;

  .el-row {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-col {
      height: 20%;
      &:last-child {
        height: 80%;
      }
    }
  }
}
</style>