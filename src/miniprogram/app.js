import Eventemitter from 'eventemitter3'
import Todo from './models/todo'
import User from './models/user'
import Popup from './models/popup'
import List from './models/list'
/*<jdists trigger="prod">
import config from './config/production'
</jdists>*/
/*<jdists trigger="dev">
import config from './config/development'
</jdists>*/

// 云能力初始化
wx.cloud.init({ traceUser: true })
// 获取数据库引用
const db = wx.cloud.database()

App({
  globalData: {
    openId: '',
    curTodo: {},
    curtList: {}
  },
  db,
  config,
  event: new Eventemitter(),
  models: {},
  async onLaunch() {
    console.log(config.db)
    // 创建模型对象
    this.models = {
      todo: new Todo(db, this),
      user: new User(db, this),
      popup: new Popup(db, this),
      list: new List(db, this)
    }
    try {
      this.globalData.openId = await this.models.user.getOpenId()
    } catch (error) {
      console.error(error)
    }
  }
})