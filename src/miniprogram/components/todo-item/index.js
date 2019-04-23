import computedBehavior from 'miniprogram-computed'
const priorityClasses = ['easy', 'normal', 'urgent']
const app = getApp()
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
      const {priority, finish} = this.properties.todo
      return `.${priorityClasses[priority]}${finish ? 'finish' : ''}`
    }
  },
  methods: {
    showTodoActions () {
      app.models.todo.setCurrentTodo(this.properties.todo)
      app.models.popup.showTodoActions()
    }
  }
})
