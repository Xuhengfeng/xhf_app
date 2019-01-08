import Vue from 'vue'
import {
  formatDate,
  prettyTime
} from '@xuhengfeng/utils-app'
// 时间戳转日期
Vue.filter('time', (timestamp, fmt = 'yyyy-MM-dd HH:mm') => {
  if (timestamp) {
    return formatDate(timestamp, fmt)
  } else {
    return ''
  }
})

// 时间戳转日期
Vue.filter('date', prettyTime)
