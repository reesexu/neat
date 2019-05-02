import { UPDATE_LOCAL_TODO } from '../constants/event'
import Base from './base'
const FILE_ACTIONS = ['删除']
const priority = ['紧急', '普通', '一般']
export default class Popup extends Base {
  constructor(db, app) {
    super()
    this.db = db
    this.app = app
  }
  // 展示任务操作弹窗
  showTodoActions() {
    const { models, globalData, event } = this.app
    const { _id } = globalData.currentTodo
    wx.showActionSheet({
      itemList: FILE_ACTIONS,
      async success({ tapIndex }) {
        switch (tapIndex) {
          case 0:
            try {
              await models.todo.updateTodo({ _id, data: { deleted: true } })
              event.emit(UPDATE_LOCAL_TODO, { _id, removed: true })
            } catch (error) {
              console.error(error)
            }
            break
        }
      },
      fail(res) {
        console.error(res.errMsg)
      }
    })
  }
  // 选择默认优先级
  selectDefPriority(cb) {
    wx.showActionSheet({
      itemList: priority,
      success: ({ tapIndex }) => {
        cb(tapIndex)
      },
      fail(res) {
        console.error(res.errMsg)
      }
    })
  }
}