/**
 * 数组操作工具类
 * @authors jp
 * @date    2018-02-05
 */

var
  contains,
  sort,
  map,
  unique,
  union,
  intersect,
  remove,
  formArray,
  max,
  min,
  sum,
  average,
  deepCopy,
  recursionDelete,
  compareArr;

  /*判断一个元素是否在数组内*/
  contains = (arr, val) => {
	  return arr.indexOf(val) != -1;
  }
  /**
	 *数组排序
   * @param    {type} 1:从小到大 2:从大到小 3:随机
   * @return   {Array}
   */
  sort = (arr, type) => {
  	return arr.sort((a, b) => {
  		switch (type) {
  			case 1:
  			  return a - b
  			case 2:
  			  return b - a
  			case 3:
  			  return Math.random() - 0.5
  			default:
  			  return arr
  		}
  	})
  }
  /**
   * @param    {arr}数组
   * @param    {fn} 回调函数
   * @param    {thisObj}this指向
   * @return   {Array}
   */
  map = (arr, fn, thisObj) => {
  	var scope = thisObj || window
  	var a = []
  	for (var i = 0, j = arr.length; i < j; ++i) {
      var res = fn.call(scope, arr[i], i, this)
      if (res != null) a.push(res)
    }
    return a
  }
  /*去重*/
  unique = (arr) => {
  	if (Array.hasOwnProperty('from')) {
  		return Array.from(new Set(arr))
  	} else {
  		var n = {};
      var r = [];
  		for (var i = 0; i < arr.length; i++) {
  			if (!n[arr[i]]) {
  				n[arr[i]] = true
  				r.push(arr[i])
  			}
  		}
  		return r
  	}
  }
  /*求两个集合的并集*/
  union = (a, b) => {
  	var newArray = a.concat(b)
  	return unique(newArray)
  }
  /*求两个集合的交集*/
  intersect = (a, b) => {
  	a = unique(a)
  	return map(a, function (o) {
  		return contains(b, o) ? o : null
  	})
  }
  /*删除其中一个元素*/
  remove = (arr, ele) => {
  	var index = arr.indexOf(ele)
  	if (index > -1) {
  		arr.splice(index, 1)
  	}
  	return arr
  }
  /*将类数组转换为数组的方法*/
  formArray = (ary) => {
  	var arr = []
  	if (Array.isArray(ary)) {
  		arr = ary
  	} else {
  		arr = Array.prototype.slice.call(ary)
  	}
  	return arr
  }
  /*最大值*/
  max = (arr) => {
  	return Math.max.apply(null, arr)
  }
  /*最小值*/
  min = (arr) => {
  	return Math.min.apply(null, arr)
  }
  /*求和*/
  sum = (arr) => {
  	return arr.reduce((pre, cur) => {
  		return pre + cur
  	})
  }
  /*平均值*/
  average = (arr) => {
  	return sum(arr) / arr.length
  }
  /*深克隆*/
  deepCopy = (arr, aimAr) => {
    var aimArr = aimAr || {};
    for (var i in arr) {
      if (typeof arr[i] === 'object') {
        //要考虑深复制问题了
        if (arr[i].constructor === Array) {
          //这是数组
          aimArr[i] = [];
        } else {
          //这是对象
          aimArr[i] = {};
        }
        deepCopy(arr[i], aimArr[i]);
      } else {
        aimArr[i] = arr[i];
      }
    }
    return aimArr
  }
  recursionDelete = (list) => { //递归删除enterprises为空的属性
    list.forEach(function (item, index) {
      if (item.enterprises.length === 0) {
        delete item.enterprises
      } else {
        recursionDelete(item.enterprises)
      }
    })
    return list
  }
  compareArr = (arr1, arr2) => {
    var result = [];
    for (var i = 0; i < arr2.length; i++) {
      var obj = arr2[i];
      var num = obj.id;
      var isExist = false;
      for (var j = 0; j < arr1.length; j++) {
        var aj = arr1[j];
        var n = aj.id;
        if (n == num) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        result.push(obj);
      }
    }
    return result
  }
export {
	contains,
  sort,
  map,
  unique,
  union,
  intersect,
  remove,
  formArray,
  max,
  min,
  sum,
  average,
  deepCopy,
  recursionDelete,
  compareArr
}
