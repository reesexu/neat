import {regeneratorRuntime} from '../lib/index'
import Base from './base'
const TODOS = 'todos'
export default class Todo extends Base{
  constructor (db, app) {
    super()
    this.db = db
    this.app = app
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
      .orderBy('utime', 'desc')
      .where({deleted: false})
      .get({_openid: this.app.globalData.openId})
    return data
  }
  // 根据id删除任务
  async deleteTodoById (id) {
    const data = await this.db.collection(TODOS)
      .doc(id)
      .update({data: {deleted: true}})
    return data
  }
  // 缓存当前操作的任务
  setCurrentTodo (todo) {
    this.app.globalData.currentTodo = todo
  }
}
