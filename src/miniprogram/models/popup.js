import { REFRESH_TODOS } from '../constants/event'
import Base from './base'
const FILE_ACTIONS = ['删除']
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
              event.emit(REFRESH_TODOS)
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
}