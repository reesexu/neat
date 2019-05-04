import debounce from 'debounce'
import isEqual from 'lodash.isequal'
import computedBehavior from 'miniprogram-computed'
import { TITLE_MAX_LENGTH, priorityClasses } from '../../constants/index'
import { UPDATE_LOCAL_TODO, REFRESH_TODOS } from '../../constants/event'
import { validatetTodoTitle, contentEmpyt } from '../../utils/validate'
import { showToast } from '../../utils/wx'
const { globalData, models, event } = getApp()
Component({
  data: {
    todo: {},
    maxLength: TITLE_MAX_LENGTH + 1,
    operating: false
  },
  properties: {
    type: {
      type: String,
      value: 'edit'
    }
  },
  behaviors: [computedBehavior],
  computed: {
    priorityIcon() {
      const priority = this.data.todo.priority || 0
      return `../../images/priority-${priorityClasses[priority]}.svg`
    },
    disabled() {
      const { todo, type } = this.data
      if (type === 'edit') {
        return isEqual(todo, globalData.currentTodo)
      }
      return false
    }
  },
  methods: {
    onLoad() {
      const todo = Object.assign({}, globalData.currentTodo)
      this.setData({ todo })
      wx.setNavigationBarTitle({ title: todo.title ? '编辑任务' : '新建任务' })
    },
    // 标题输入事件
    onTitleInput: debounce(function({ detail }) {
      let title = validatetTodoTitle(detail.value)
      this.setData({
        ['todo.title']: title
      })
    }, 250),
    // 描述输入事件
    onDesInput: debounce(function({ detail }) {
      this.setData({
        ['todo.description']: detail.value
      })
    }, 250),
    // 修改优先级
    selectDefPriority() {
      models.popup.selectDefPriority((index) => {
        this.setData({
          ['todo.priority']: 2 - index
        })
      })
    },
    // 确认提交
    async onSubmit() {
      const { operating, todo, type } = this.data
      const { priority = 0, title, description, _id } = todo
      if (operating) return
      if (contentEmpyt(title)) return
      const isEdit = type === 'edit'
      const data = {
        title,
        priority,
        description
      }
      try {
        this.setData({ operating: true })
        if (isEdit) {
          await models.todo.updateTodo({ _id, data, updateTime: true })
          event.emit(UPDATE_LOCAL_TODO, { _id, ...data })
        } else {
          await models.todo.addTodo(data)
          event.emit(REFRESH_TODOS)
        }
        wx.navigateBack()
        setTimeout(() => {
          showToast(`${isEdit ? '编辑' : '新建'}成功`, { duration: 1500 })
        }, 300)
      } catch (error) {
        console.error(error)
      } finally {
        this.setData({ operating: false })
      }
    }
  }
})