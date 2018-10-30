/**
 * date工具类
 * @authors jp
 * @date    2018-02-05
 */

var
  formatTime,
  formatHMS,
  getMonthOfDay,
  getFirstDayOfYear,
  getLastDayOfYear,
  getYearOfDay,
  getDayOfYear,
  getDayOfYearWeek;

	/**
	 * 格式化时间
	 *
	 * @param {time} 时间
	 * @param {cFormat} 格式
	 * @return {String} 字符串
	 * @example formatTime('2018-1-29', '{y}/{m}/{d} {h}:{i}:{s}:{a}') // -> 2018/01/29 00:00:00:五
	*/
  formatTime = (time, cFormat) => {
	 	if (arguments.length === 0) return null
		if ((time + '').length === 10) {
			time = +time * 1000
		}

		var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
		var date;
		if (typeof time === 'object') {
			date = time
		} else {
			date = new Date(time)
		}

		var formatObj = {
			y: date.getFullYear(),
			m: date.getMonth() + 1,
			d: date.getDate(),
			h: date.getHours(),
			i: date.getMinutes(),
			s: date.getSeconds(),
			a: date.getDay()
		}

		var timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
			var value = formatObj[key]
			if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
				if (result.length > 0 && value < 10) {
					value = '0' + value
				}
				return value || 0
			})

		return timeStr
	}
	/**
	 * 转换秒数
	 * @param    {s} 秒数
	 * @return   {string} 字符串
	 *
	 * @example formatHMS(3610) // -> 1h0m10s
	*/
	formatHMS = s => {
	  var str = ''
	 	if (s > 3600) {
	 		str = Math.floor(s / 3600) + 'h' + Math.floor(s % 3600 / 60) + 'm' + s % 60 + 's'
	 	} else if (s > 60) {
	 		str = Math.floor(s / 60) + 'm' + s % 60 + 's'
	 	} else {
	 		str = s % 60 + 's'
	 	}
	 	return str
	}
	/**
	 * 获得某月有多少天
	 * @param    {time} 日期
	 * @return   {string} 字符串
	 *
	 * @example getMonthOfDay('2018-2-22') // -> 29
	*/
	getMonthOfDay = time => {
	  var date = new Date(time);
	 	var year = date.getFullYear();
	 	var mouth = date.getMonth() + 1;
	 	var days;
		if (mouth == 2) { //当月份为二月时，根据闰年还是非闰年判断天数
			days = (year % 4 == 0 && year % 100 == 0 && year % 400 == 0) || (year % 4 == 0 && year % 100 != 0) ? 28 : 29
		} else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
			//月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
			days = 31
		} else {
			days = 30
		}
		return days
	}
  /*获取某年的第一天*/
  getFirstDayOfYear = (time) => {
	  var year = new Date(time).getFullYear()
	  return year + '-01-01 00:00:00'
  }
  /*获取某年的最后一天*/
  getLastDayOfYear = (time) => {
	  var year = new Date(time).getFullYear();
	  var dateString = year + '-12-01 00:00:00';
	  var endDay = getMonthOfDay(dateString);
	  return year + '-12-' + endDay + ' 23:59:59'
  }
  /*获取某年有多少天*/
  getYearOfDay = time => {
	  var firstDayYear = getFirstDayOfYear(time);
		var lastDayYear = getLastDayOfYear(time);
		var numSecond = (new Date(lastDayYear).getTime() - new Date(firstDayYear).getTime()) / 1000;
	  return Math.ceil(numSecond / (24 * 3600))
  }
  /*获取某个日期是当年中的第几天*/
  getDayOfYear = time => {
    var firstDayYear = getFirstDayOfYear(time);
  	var numSecond = (new Date(time).getTime() - new Date(firstDayYear).getTime()) / 1000;
    return Math.ceil(numSecond / (24 * 3600))
  }
  /*获取某个星期在这一年的第几周*/
  getDayOfYearWeek = time => {
	  var numdays = getDayOfYear(time)
	  return Math.ceil(numdays / 7)
  }

export {
  formatTime,
  formatHMS,
  getMonthOfDay,
  getFirstDayOfYear,
  getLastDayOfYear,
  getYearOfDay,
  getDayOfYear,
  getDayOfYearWeek
}