import {regeneratorRuntime} from '../lib/index'
import Base from './base'
const TODOS = 'todos'
export default class Todo extends Base{
  constructor (db) {
    super()
    this.db = db
  }
  // 添加任务
  async addTodo ({title, description, priority = 0, pid = 0}) {
    const ctime = this.db.serverDate()
    await this.db.collection(TODOS).add({
      data: {
        title,
        description,
        location: {
          geo: [],
          details: {}
        },
        ctime,
        utime: ctime,
        finish: false,
        deleted: false,
        priority,
        pid
      }
    })
  }
  // 获取任务
  async getTodos () {
    const data = await this.db.collection(TODOS)
      .orderBy('ctime', 'desc')
      .get({_openid: getApp().globalData.openId})
    return data
  }
}
