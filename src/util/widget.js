import request from '@/router/axios';

const widgetList ={};

export function dataImport(expression) {

}

export function dataExport(param) {
  return request({
    url: '/api/blade-dynamic/importAndExportModel/exportDynamicModel',
    method: 'post',
    data: param,

  }).then((blob)=>download(blob));
}

export function download(content) {
  /*let fileName = content.headers["filename"];
  const blob = new Blob([content.data]);
  const a = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);*/
  let fileName = content.headers["filename"];
  let blob = new Blob([content.data.response]);
  let reader = new FileReader();
  reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
  reader.onload = function (e) {
    // 转换完成，创建一个a标签用于下载
    let a = document.createElement("a");
    a.download = fileName;
    a.href = e.target.result;
    document.body.appendChild(a);  // 修复firefox中无法触发click
    a.click();
    document.body.removeChild(a);
  }
}
