import {regeneratorRuntime} from './lib/index'
import Todo from './models/todo'
import User from './models/user'
import Popup from './models/popup'
// 云能力初始化
wx.cloud.init({traceUser: true})
// 获取数据库引用
const db = wx.cloud.database()
App({
  globalData: {
    openId: '',
    currentTodo: {}
  },
  models: {},
  async onLaunch() {
    // 创建模型对象
    this.models = {
      todo: new Todo(db, this),
      user: new User(db, this),
      popup: new Popup(db, this)
    }
    try {
      this.globalData.openId = await this.models.user.getOpenId()
    } catch (error) {
      console.error(error)
    }
  }
}) 