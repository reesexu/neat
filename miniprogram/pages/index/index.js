import {regeneratorRuntime} from '../../lib/index'
import {REFRESH_TODOS} from '../../constants/event'
import {TITLE_MAX_LENGTH} from '../../constants/index'
const {models, event} = getApp()

Page({
  data: {
    todos: [],
    title: '',
    maxLength: TITLE_MAX_LENGTH + 1
  },
  onLoad () {
    event.on(REFRESH_TODOS, this.getTodos)
    this.getTodos()
  },
  onInput ({detail}) {
    let title = detail.value
    if (title.length > TITLE_MAX_LENGTH) {
        wx.showToast({
          title: `标题长度不能超过${TITLE_MAX_LENGTH}`,
          icon: 'none'
        })
        title = title.substring(0, TITLE_MAX_LENGTH)
    }
    this.setData({title})
  },
  async addTodo () {
    const {title} = this.data
    if (!title.replace(/\s/g, '')) {
      return wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
    }
    try {
      wx.showNavigationBarLoading()
      await models.todo.addTodo({title})
      this.setData({title: ''})
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
