import Base from './base'

const TODOS = 'todos'

export default class Todo extends Base {
  constructor(db, app) {
    super()
    this.db = db
    this.app = app
  }
  // 添加任务
  async addTodo({ title, description, priority = 0, lid = '0' }) {
    const ctime = this.db.serverDate()
    await this.db.collection(TODOS).add({
      data: {
        title, // 标题
        description, // 描述
        ctime, // 创建时间
        utime: ctime, // 更新时间
        finish: false, // 是否完成
        deleted: false, // 是否删除
        priority, // 优先级
        lid // 所在清单id，默认是'0', 即默认清单
      }
    })
  }
  // 获取任务
  async getTodos({ skip = 0, where = {} } = {}) {
    const data = await this.db.collection(TODOS)
      .limit(20)
      .skip(skip)
      .orderBy('utime', 'desc')
      .where(where)
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
    this.app.globalData.curTodo = todo
  }
}