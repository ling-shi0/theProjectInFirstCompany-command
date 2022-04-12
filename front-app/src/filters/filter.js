import * as dayjs from 'dayjs'

/**
 * [将时间转换为标准格式]
 * @author Pengfei Lei
 * @date   2020-11-17T16:40:07+0800
 * @param  {Date}                   time [Date对象]
 * @return {String}                   eg [2020-11-17 00:00:00]
 */
const timeFormat = (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')

export default {
  timeFormat
}
