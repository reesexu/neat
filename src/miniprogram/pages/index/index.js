import { REFRESH_TODOS, UPDATE_LOCAL_TODO } from '../../constants/event'
import { TITLE_MAX_LENGTH } from '../../constants/index'
import debounce from 'debounce'
import throttle from 'throttleit'
import { showToast } from '../../utils/wx'
const { models, event } = getApp()

Page({
  data: {
    todos: [],
    title: '',
    maxLength: TITLE_MAX_LENGTH + 1,
    loading: false
  },
  onLoad() {
    this.getTodos()
    event.on(REFRESH_TODOS, this.getTodos)
    event.on(UPDATE_LOCAL_TODO, this.updateLocalTodo)
  },
  async onPullDownRefresh() {
    await this.getTodos()
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    this.getTodos(this.data.todos.length)
  },
  // 输入事件
  onInput: debounce(function({ detail }) {
    let title = detail.value
    if (title.length > TITLE_MAX_LENGTH) {
      showToast(`标题长度不能超过${TITLE_MAX_LENGTH}`)
      title = title.substring(0, TITLE_MAX_LENGTH)
    }
    this.setData({ title })
  }, 250),
  // 添加任务
  addTodo: throttle(async function() {
    const { title } = this.data
    if (!/\S+/g.test(title)) {
      return showToast('标题不能为空')
    }
    try {
      wx.showNavigationBarLoading()
      await models.todo.addTodo({ title })
      this.setData({ title: '' })
      this.getTodos()
    } catch (error) {
      console.error(error)
    } finally {
      wx.hideNavigationBarLoading()
    }
  }, 1000),
  // 获取任务
  async getTodos(skip = 0) {
    const { loading } = this.data
    if (loading) return
    this.setData({ loading: true })
    try {
      wx.showNavigationBarLoading()
      const { data } = await models.todo.getTodos({ skip })
      // 局部更新，防止在setData的时候数据量不断增大
      if (skip !== 0) {
        let updateItems = data.reduce((acc, item, index) => {
          acc[`todos[${skip + index}]`] = item
          return acc
        }, {})
        this.setData(updateItems)
      } else {
        this.setData({ todos: data })
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.setData({ loading: false })
      wx.hideNavigationBarLoading()
    }
  },
  // 更新当前列表中的任务
  updateLocalTodo(newTodoAttr) {
    const { _id } = newTodoAttr
    const index = this.data.todos.findIndex(t => t._id === _id)
    if (index !== -1) {
      this.setData({
        [`todos[${index}]`]: Object.assign(this.data.todos[index], newTodoAttr)
      })
    }
  }
})