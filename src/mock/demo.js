/*
 * @Date: 2021-01-02 09:15:47
 * @Author: LU Yi
 * @LastEditors: LU Yi
 * @LastEditTime: 2021-01-03 11:07:12
 * @FilePath: /SX-DTBF-VIEW/src/mock/demo.js
 * @Description: 
 */
import Mock from 'mockjs'

/*function getFakeDetail() {
  const json = {code:200,success:true , msg:'操作成功'};
  json.data = "测试mock返回";
  return json;
}

export default ({mock})=>{
  if(!mock) return;
  Mock.mock('/api/demo/detail','get',getFakeDetail);
}*/

function getFakeList() {
  const json = fakeSuccess();
  const list = [];
  list.push(
    {
      id: '1',
      title: 'Demo标题1',
      time: '2019.09.26',
      content: 'Demo内容1',
    },
    {
      id: '2',
      title: 'Demo标题2',
      time: '2019.09.26',
      content: 'Demo内容2',
    }
  );
  json.data = {
    total: 10,
    size: 10,
    current: 1,
    searchCount: true,
    pages: 1,
    records: list,
  };
  return json;
}
function getFakeDetail() {
  const json = fakeSuccess();
  json.data = {
    id: '1',
    title: 'Demo标题1',
    time: '2019.09.26',
    content: 'Demo内容1',
  };
  return json;
}
function fakeSuccess() {
  return {code: 200, success: true, msg: '操作成功'};
}
export default ({mock}) => {
  if (!mock) return;
  Mock.mock('/demo/list', 'get', getFakeList);
  Mock.mock('/api/demo/detail', 'get', getFakeDetail);
  Mock.mock('/api/demo/submit', 'post', fakeSuccess);
  Mock.mock('/api/demo/remove', 'post', fakeSuccess);
}

Mock.mock('/demo/list', 'get', getFakeList);