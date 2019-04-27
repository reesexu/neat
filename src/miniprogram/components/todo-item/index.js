import computedBehavior from 'miniprogram-computed'
import throttle from 'throttleit'
import { REFRESH_TODOS } from '../../constants/event'
const priorityClasses = ['easy', 'normal', 'urgent']
const { models, event, db } = getApp()
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
    showTodoActions() {
      models.todo.setCurrentTodo(this.properties.todo)
      models.popup.showTodoActions()
    },
    finishTodo: throttle(async function() {
      const { _id, finish } = this.properties.todo
      try {
        const data = await models.todo.updateTodo({ _id, data: { finish: !finish } })
        event.emit(REFRESH_TODOS)
        console.log(data)
      } catch (error) {
        console.error(error)
      }
    }, 1000)
  }
})