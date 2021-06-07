<template>
  <div>
    <avue-form
      ref="form"
      v-model="form"
      :option="option"
    >
    </avue-form>
  </div>
</template>

<script>
  export default {
    props: ["column", "value"],
    data() {
      return {
        option: {
          column: [
            {
              type: 'dynamic',
              label: '',
              labelWidth: 1,
              span: 24,
              display: true,
              children: {
                align: 'center',
                headerAlign: 'center',
                index: false,
                addBtn: true,
                delBtn: true,
                column: [
                  {
                    type: 'select',
                    label: '操作符',
                    width: 120,
                    dicData: [
                      {
                        label: '等于',
                        value: 'EQ'
                      },
                      {
                        label: '不等于',
                        value: 'NE'
                      },
                      {
                        label: '大于',
                        value: 'GT'
                      },
                      {
                        label: '大于等于',
                        value: 'GE'
                      },
                      {
                        label: '小于',
                        value: 'LT'
                      },
                      {
                        label: '小于等于',
                        value: 'LE'
                      },
                      {
                        label: '包含',
                        value: 'LIKE'
                      },
                      {
                        label: '不包含',
                        value: 'NLIKE'
                      },
                      {
                        label: '范围',
                        value: 'BT'
                      },
                      {
                        label: '范围外',
                        value: 'NBT'
                      },
                      {
                        label: '多值包含',
                        value: 'INLIKE'
                      },
                    ],
                    display: true,
                    props: {
                      label: 'label',
                      value: 'value'
                    },
                    prop: 'operator'
                  },
                  {
                    type: 'input',
                    label: '值（小）',
                    display: true,
                    prop: 'lowerValue'
                  },
                  {
                    type: 'input',
                    label: '值（大）',
                    display: true,
                    prop: 'upperValue'
                  }
                ]
              },
              prop: this.column.prop
            }
          ],
          labelPosition: 'left',
          labelSuffix: '：',
          labelWidth: 120,
          gutter: 0,
          menuBtn: false,
          submitBtn: false,
          emptyBtn: false,
        },
        form: {},
        lowerColumn: {},
        upperColumn: {},
      }
    },
    watch: {
      // 监听值变化
      column: {
        handler() {
          this.lowerColumn = this.deepClone(this.column);
          this.lowerColumn.prop = "lowerValue";
          this.lowerColumn.label = "值（小）";
          this.lowerColumn = this.avueTypeTrans(this.lowerColumn);
          this.option.column[0].children.column[1] = this.lowerColumn;
          this.upperColumn = this.deepClone(this.column);
          this.upperColumn.prop = "upperValue";
          this.upperColumn.label = "值（大）";
          this.upperColumn = this.avueTypeTrans(this.upperColumn);
          if (this.column.type.includes("range")) {
            this.upperColumn.hide = true;
          }
          this.option.column[0].children.column[2] = this.upperColumn;
        },
        deep: true,
        immediate: true,
      },
      // 监听值变化
      value: {
        handler() {
          this.form = this.deepClone(this.value);
        },
        deep: true,
        immediate: true,
      },
    },
  }
</script>
<style lang="scss" scoped>
  .btn {
    text-align: right;
  }
</style>
