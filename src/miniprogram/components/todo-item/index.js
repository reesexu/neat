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
      return `.${priorityClasses[this.properties.todo.priority]}`
    }
  },
  methods: {
    showTodoActions () {
      app.models.todo.setCurrentTodo(this.properties.todo)
      app.models.popup.showTodoActions()
    }
  }
})
