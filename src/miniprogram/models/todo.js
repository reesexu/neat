import Base from './base'
const TODOS = 'todos'
export default class Todo extends Base {
  constructor(db, app) {
    super()
    this.db = db
    this.app = app
  }
  // 添加任务
  async addTodo({ title, description, priority = 0, pid = 0 }) {
    const ctime = this.db.serverDate()
    await this.db.collection(TODOS).add({
      data: {
        title,
        description,
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
  async getTodos({ skip = 0 } = {}) {
    const data = await this.db.collection(TODOS)
      .limit(20)
      .skip(skip)
      .orderBy('utime', 'desc')
      .where({ deleted: false })
      .get({ _openid: this.app.globalData.openId })
    return data
  }
  async updateTodo({ _id, data, updateTime = false }) {
    if (updateTime) {
      data.utime = this.db.serverDate()
    }
    const res = await this.db.collection(TODOS)
      .doc(_id)
      .update({ data })
    return res
  }
  // 缓存当前操作的任务
  setCurrentTodo(todo) {
    this.app.globalData.currentTodo = todo
  }
}