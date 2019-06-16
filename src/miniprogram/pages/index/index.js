import debounce from 'debounce'
import throttle from 'throttleit'
import computedBehavior from 'miniprogram-computed'
import { REFRESH_TODOS, UPDATE_LOCAL_TODO } from '../../constants/event'
import { TODO_TITLE_MAX_LENGTH, priorityClasses, storgeKeys } from '../../constants/index'
import { validatetString, isContentEmpyt } from '../../utils/validate'

const { models, event } = getApp()
const count = 20

Component({
  data: {
    todos: [],
    title: '',
    maxLength: TODO_TITLE_MAX_LENGTH + 1,
    loading: false,
    defPriority: 0,
  },
  sideBar: null,
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
      wx.getStorage({
        key: storgeKeys.defPriority,
        success: ({ data = 0 }) => {
          this.setData({ defPriority: data })
        }
      })
      this.sideBar = this.selectComponent('#sideBar')
      event.on(REFRESH_TODOS, this.getTodos.bind(this))
      event.on(UPDATE_LOCAL_TODO, this.updateLocalTodo.bind(this))
    },
    // 下拉刷新
    async onPullDownRefresh() {
      await this.getTodos()
      wx.stopPullDownRefresh()
    },
    // 上拉加载更多
    onReachBottom() {
      const { length } = this.data.finalTodos
      length >= count && this.getTodos(length)
    },
    // 输入事件
    onInput: debounce(function({ detail }) {
      let title = validatetString(detail.value)
      this.setData({ title })
    }, 250),
    // 添加任务
    addTodo: throttle(async function() {
      const { title, defPriority } = this.data
      if (isContentEmpyt(title)) return
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
      const { loading, finalTodos: { length } } = this.data
      if (loading) return
      if (length >= 20 || length === 0) {
        this.setData({ loading: true })
      }
      try {
        wx.showNavigationBarLoading()
        const { data } = await models.todo.getTodos({ skip, where: { deleted: false, finish: false } })
        // 局部更新，防止在setData的时候数据量不断增大造成卡顿
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
    // 更改快捷创建任务栏的默认任务优先级
    selectDefPriority() {
      models.popup.selectDefPriority((index) => {
        const defPriority = 2 - index
        this.setData({ defPriority }, () => {
          wx.setStorageSync(storgeKeys.defPriority, defPriority)
        })
      })
    },
    // 打开侧边栏
    openSideBar() {
      this.sideBar.toggle()
    }
  }
})