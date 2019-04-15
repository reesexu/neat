import {regeneratorRuntime} from '../../lib/index'
const {models} = getApp()

Page({
  data: {
    todos: [],
    value: ''
  },
  onLoad () {
    this.getTodos()
  },
  async addTodo ({detail}) {
    try {
      wx.showNavigationBarLoading()
      await models.todo.addTodo({title: detail.value})
      this.setData({value: ''})
      this.getTodos()
    } catch (error) {
      console.error(error)
    } finally {
      wx.hideNavigationBarLoading()
    }
  },
  async getTodos () {
    try {
      wx.showNavigationBarLoading()
      const {data} = await models.todo.getTodos()
      this.setData({todos: data})
    } catch (error) {
      console.error(error)
    } finally {
      wx.hideNavigationBarLoading()
    }
  }
})
