/*
 * @Date: 2021-01-03 11:09:08
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-03 11:52:30
 * @FilePath: /SX-DTBF-VIEW/src/mock/form.js
 * @Description: 流程表单模拟接口
 */

import Mock from 'mockjs'

const {
  Random
} = Mock

const pool = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  number: "0123456789",
  symbol: "!@#$%^&*()[]"
}

// const data = Mock.mock(
//   //   "data|20": [{
//   //     "key|+1": 1000,
//   //     "type": Random.word(),
//   //     "name": Random.name(),
//   //     "alias": Random.word(),
//   //     "form": Random.csentence(),
//   //     "version": `v${Random.character('number')}`,
//   //     "createUser": Random.cname(),
//   //     "createTime": Random.datetime('yyyy-MM-dd'),
//   //     "path": ""
//   //   }]
// )

const data = () => {
  let list = []
  for (let i = 0; i < 10; i++) {
    list.push({
        alias: Random.word(),
        type: Random.name(),
        form: Random.csentence(),
        path: `/src/${Random.word()}/pages/${Random.word()}.vue`
    })
  }

  return list
}


Mock.mock('/list', 'get', data());
