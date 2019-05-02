import debounce from 'debounce'
import throttle from 'throttleit'
import computedBehavior from 'miniprogram-computed'
import { REFRESH_TODOS, UPDATE_LOCAL_TODO } from '../../constants/event'
import { TITLE_MAX_LENGTH, priorityClasses } from '../../constants/index'
import { showToast } from '../../utils/wx'
const { models, event } = getApp()
const count = 20

Component({
  data: {
    todos: [],
    title: '',
    maxLength: TITLE_MAX_LENGTH + 1,
    loading: false,
    defPriority: 0
  },
  behaviors: [computedBehavior],
  computed: {
    finalTodos() {
      return this.data.todos.filter(t => !t.removed)
    },
    priorityIcon() {
      return `../../images/priority-${priorityClasses[this.data.defPriority]}.svg`
    }
  },
  methods: {
    onLoad() {
      this.getTodos()
      event.on(REFRESH_TODOS, this.getTodos.bind(this))
      event.on(UPDATE_LOCAL_TODO, this.updateLocalTodo.bind(this))
    },
    async onPullDownRefresh() {
      await this.getTodos()
      wx.stopPullDownRefresh()
    },
    onReachBottom() {
      const { length } = this.data.finalTodos
      length >= count && this.getTodos(length)
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
      const { title, defPriority } = this.data
      if (!/\S+/g.test(title)) {
        return showToast('标题不能为空')
      }
      try {
        wx.showNavigationBarLoading()
        await models.todo.addTodo({ title, priority: defPriority })
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
        const { data } = await models.todo.getTodos({ skip, where: { deleted: false } })
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
    },
    selectDefPriority() {
      models.popup.selectDefPriority((index) => {
        this.setData({
          defPriority: 2 - index
        })
      })
    }
  }
})