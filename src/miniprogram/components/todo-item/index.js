import computedBehavior from 'miniprogram-computed'
import throttle from 'throttleit'
import { UPDATE_LOCAL_TODO } from '../../constants/event'
import { priorityClasses } from '../../constants/index'
import route from '../../constants/route'

const { models, event } = getApp()

Component({
  behaviors: [computedBehavior],
  options: {
    addGlobalClass: true
  },
  properties: {
    todo: {
      type: Object,
      value: {}
    }
  },
  computed: {
    priorityClass() {
      const { priority, finish } = this.properties.todo
      let priorityClassStr = `.${priorityClasses[priority]}`
      return `.${priorityClassStr}${finish ? ` ${priorityClassStr}-finish` : ''}`
    }
  },
  methods: {
    // 选中当前任务
    selectTodo() {
      models.todo.setCurrentTodo(this.properties.todo)
    },
    // 打开任务操作菜单
    showTodoActions() {
      models.popup.showTodoActions()
    },
    // 完成任务
    finishTodo: throttle(async function() {
      const { _id, finish } = this.properties.todo
      try {
        await models.todo.updateTodo({ _id, data: { finish: !finish } })
        event.emit(UPDATE_LOCAL_TODO, { _id, finish: !finish })
        const timer = setTimeout(() => {
          event.emit(UPDATE_LOCAL_TODO, { _id, removed: true })
          clearTimeout(timer)
        }, 150)
      } catch (error) {
        console.error(error)
      }
    }, 1000),
    // 打开详细编辑
    toEdit() {
      wx.navigateTo({ url: route.editTodo })
    }
  }
})