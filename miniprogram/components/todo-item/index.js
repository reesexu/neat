import computedBehavior from 'miniprogram-computed'
const priorityClasses = ['easy', 'normal', 'urgent']

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
  }
})
