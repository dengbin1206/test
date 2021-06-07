export default function (callback){
  //获取当前定位详细信息 需要等到高德地图 SDK 完全加载完成
  var mapObj = new window.AMap.Map('iCenter');
  var geolocation = function(){};
  mapObj.plugin('AMap.Geolocation', function () {
    geolocation = new window.AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      convert: true,
      showButton: true,
      buttonPosition: 'LB',
      buttonOffset: new window.AMap.Pixel(10, 20),
      showMarker: true,
      showCircle: true,
      panToLocation: true,
      zoomToAccuracy:true
    });
    mapObj.addControl(geolocation);
    geolocation.getCurrentPosition();
    window.AMap.event.addListener(geolocation, 'complete', onComplete);
    window.AMap.event.addListener(geolocation, 'error', onError);
  });

  function onComplete(obj){
    var res = '经纬度：' + obj.position +
      '\n精度范围：' + obj.accuracy +
      '米\n定位结果的来源：' + obj.location_type +
      '\n状态信息：' + obj.info +
      '\n地址：' + obj.formattedAddress +
      '\n地址信息：' + JSON.stringify(obj.addressComponent, null, 4);
    console.log(res)
    callback(obj)
  }

  function onError(obj) {
    alert(obj.info + '--' + obj.message);
    console.log(obj);
  }

}
