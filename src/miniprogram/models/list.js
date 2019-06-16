import Base from './base'

const LISTS = 'lists'

export default class List extends Base {
  constructor(db, app) {
    super()
    this.db = db
    this.app = app
  }
  // 添加清单
  async addList({ title }) {
    const ctime = this.db.serverDate()
    await this.db.collection(LISTS).add({
      data: {
        title,
        ctime,
        utime: ctime
      }
    })
  }
  // 获取清单
  async getLists({ skip = 0, where = {} } = {}) {
    const data = await this.db.collection(LISTS)
      .limit(20)
      .skip(skip)
      .get({ _openid: this.app.globalData.openId })
    return data
  }
  // 更新清单
  async updateList({ _id, data, updateTime = false }) {
    if (updateTime) {
      data.utime = this.db.serverDate()
    }
    const res = await this.db.collection(LISTS)
      .doc(_id)
      .update({ data })
    return res
  }
  // 缓存当前操作的清单
  setCurrentList(list) {
    this.app.globalData.curtList = list
  }
}