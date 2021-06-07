/**
 * 通用工具类
 */
export default class func {
  /**
   * 不为空
   * @param val
   * @returns {boolean}
   */
  static notEmpty(val) {
    return !this.isEmpty(val);
  }

  /**
   * 是否为定义
   * @param val
   * @returns {boolean}
   */
  static isUndefined(val) {
    return val === null || typeof val === 'undefined';
  }

  /**
   * 为空
   * @param val
   * @returns {boolean}
   */
  static isEmpty(val) {
    if (
      val === null ||
      typeof val === 'undefined' ||
      (typeof val === 'string' && val === '' && val !== 'undefined')
    ) {
      return true;
    }
    return false;
  }

  /**
   * 强转int型
   * @param val
   * @param defaultValue
   * @returns {number}
   */
  static toInt(val, defaultValue) {
    if (this.isEmpty(val)) {
      return defaultValue === undefined ? -1 : defaultValue;
    }
    const num = parseInt(val, 0);
    return Number.isNaN(num) ? (defaultValue === undefined ? -1 : defaultValue) : num;
  }

  /**
   * Json强转为Form类型
   * @param obj
   * @returns {FormData}
   */
  static toFormData(obj) {
    const data = new FormData();
    Object.keys(obj).forEach(key => {
      data.append(key, Array.isArray(obj[key]) ? obj[key].join(',') : obj[key]);
    });
    return data;
  }

  /**
   * date类转为字符串格式
   * @param date
   * @param format
   * @returns {null}
   */
  static format(date, format = 'YYYY-MM-DD HH:mm:ss') {
    return date ? date.format(format) : null;
  }

  /**
   * 根据逗号联合
   * @param arr
   * @returns {string}
   */
  static join(arr) {
    return arr ? arr.join(',') : '';
  }

  /**
   * 根据逗号分隔
   * @param str
   * @returns {string}
   */
  static split(str) {
    return str ? String(str).split(',') : '';
  }

    /**
   * 开始时间加 00:00:00
   * @param str
   * @returns {string}
   */
  static dateBeginWith(str) {
    return str + ' 00:00:00';
  }
      /**
   * 结束时间加 23:59:59
   * @param str
   * @returns {string}
   */
  static dateEndWith(str) {
    return str + ' 23:59:59';
  }

  static isJSON(str) {
    if (typeof str == 'string') {
      try {
        var obj=JSON.parse(str);
        if(typeof obj == 'object' && obj ){
          return true;
        }else{
          return false;
        }

      } catch(e) {
        console.log('error：'+str+'!!!'+e);
        return false;
      }
    }
    console.log('It is not a string!')
  }

  /**
   * 获取url中"?"符后的字串
   * @param url
   * @returns {Object}
   */
  static getUrlParam(url) {
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
      let str = url.substr(url.indexOf("?")+1);
      let strs = str.split("&");
      for(let i = 0; i < strs.length; i ++) {
        theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  }
}
