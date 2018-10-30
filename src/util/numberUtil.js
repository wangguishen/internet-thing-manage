/**
 * number工具类
 * @authors jp
 * @date    2018-04-20
 */
var changePageSize;
  /**
   * 转换包大小为MB,四舍五入
   * @param  {[type]} pageSize [包大小]
   * @param {[type]} [place] [保留几位小数]
   * @return {[type]}          [转换后MB]
   */
  changePageSize = (pageSize, place) => {
    if (!pageSize) return ''
    let size = ""
    if (pageSize < 0.1 * 1024) { //如果小于0.1KB转化成B
      size = pageSize.toFixed(place) + "B";
    } else if (pageSize < 0.1 * 1024 * 1024) { //如果小于0.1MB转化成KB
      size = (pageSize / 1024).toFixed(place) + "KB";
    } else if (pageSize < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB
      size = (pageSize / (1024 * 1024)).toFixed(place) + "MB";
    } else { //其他转化成GB
      size = (pageSize / (1024 * 1024 * 1024)).toFixed(place) + "GB";
    }
    let sizestr = size + "";
    let len = sizestr.indexOf(".");
    let dec = sizestr.substr(len + 1, 2);
    if (dec == "00") { //当小数点后为00时 去掉小数部分
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
    }
    return sizestr;
  }
export {
  changePageSize
}