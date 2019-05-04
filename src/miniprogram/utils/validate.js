import { TITLE_MAX_LENGTH } from '../constants/index'
import { showToast } from './wx'
export const validatetTodoTitle = (title) => {
  if (title.length > TITLE_MAX_LENGTH) {
    showToast(`标题长度不能超过${TITLE_MAX_LENGTH}`)
    title = title.substring(0, TITLE_MAX_LENGTH)
  }
  return title
}
export const contentEmpyt = (title, infoPrefix = '标题') => {
  if (!/\S+/g.test(title)) {
    showToast(`${infoPrefix}不能为空`)
    return true
  }
  return false
}