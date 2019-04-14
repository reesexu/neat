import {regeneratorRuntime} from './lib/index'
import Todo from './models/todo'
import User from './models/user'
// 云能力初始化
wx.cloud.init({traceUser: true})
// 获取数据库引用
const db = wx.cloud.database()
App({
  globalData: {
    openId: ''
  },
  // 创建模型对象
  models: {
    todo: new Todo(db),
    user: new User(db)
  },
  async onLaunch() {
    try {
      this.globalData.openId = await this.models.user.getOpenId()
    } catch (error) {
      console.error(error)
    }
  }
}) 