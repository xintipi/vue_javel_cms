import Vue from 'vue'
import * as moment from 'moment-timezone'

Vue.filter('formatDate', function (value, format = '') {
  let date = moment(value)
  if (!date.isValid()) return ''
  return date.format(format)
})

Vue.filter('momentTimestamp', function (value, format = '') {
  return moment.unix(value).format(format)
})

export const convertPagination = (pagination) => {
  return {
    defaultCurrent: 1,
    current: pagination.currentPage,
    total: pagination.total,
    defaultPageSize: 15,
    pageSize: pagination.perPage,
    position: 'both'
  }
}

Vue.filter('truncate', (text, suffix, num) => {
  if (text !== undefined && text.length > num) {
    return text.substring(0, num) + suffix
  } else {
    return text
  }
})

Vue.filter('momentJa', date => {
  return moment(date).format('YYYY年MM月DD日')
})

Vue.filter('imageThumbnailObject', value => {
  return value || require('../assets/images/dummy_image.png')
})
