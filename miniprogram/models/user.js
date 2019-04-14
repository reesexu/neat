import {regeneratorRuntime} from '../lib/index'
import Base from './base'
export default class User extends Base {
  // 调用云函数获取并缓存openId
  async getOpenId () {
      let openId = wx.getStorageSync('openId')
      if (!openId) {
        const {result} = await wx.cloud.callFunction({name: 'login'})
        wx.setStorageSync('openId', result.openId)
        openId = result.openId
      }
      return openId
  }
}
