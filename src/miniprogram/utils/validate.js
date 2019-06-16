import { TODO_TITLE_MAX_LENGTH } from '../constants/index'
import { showToast } from './wx'

// 根据长度校验&切割字符串
export const validatetString = (title, { maxLength, subject } = {
  maxLength: TODO_TITLE_MAX_LENGTH,
  subject: '标题'
}) => {
  if (title.length > maxLength) {
    showToast(`${subject}长度不能超过${maxLength}`)
    title = title.substring(0, maxLength)
  }
  return title
}
// 校测字符串是否为空
export const isContentEmpyt = (title = '', infoPrefix = '标题') => {
  if (!/\S+/g.test(title)) {
    showToast(`${infoPrefix}不能为空`)
    return true
  }
  return false
}