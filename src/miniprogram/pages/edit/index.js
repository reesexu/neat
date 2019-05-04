import debounce from 'debounce'
import isEqual from 'lodash.isequal'
import computedBehavior from 'miniprogram-computed'
import { TITLE_MAX_LENGTH, priorityClasses } from '../../constants/index'
import { UPDATE_LOCAL_TODO } from '../../constants/event'
import { validatetTodoTitle, contentEmpyt } from '../../utils/validate'
import { showToast } from '../../utils/wx'
const { globalData, models, event } = getApp()
Component({
  data: {
    todo: {},
    maxLength: TITLE_MAX_LENGTH + 1,
    operating: false
  },
  behaviors: [computedBehavior],
  computed: {
    priorityIcon() {
      const priority = this.data.todo.priority || 0
      return `../../images/priority-${priorityClasses[priority]}.svg`
    },
    disabled() {
      return isEqual(this.data.todo, globalData.currentTodo)
    }
  },
  methods: {
    onLoad() {
      const todo = Object.assign({}, globalData.currentTodo)
      this.setData({ todo })
      wx.setNavigationBarTitle({ title: todo.title ? '编辑任务' : '添加任务' })
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
      const { operating, todo } = this.data
      const { priority = 0, title, description, _id } = todo
      if (operating) return
      if (contentEmpyt(title)) return
      const data = {
        title,
        priority,
        description
      }
      try {
        this.setData({ operating: true })
        await models.todo.updateTodo({ _id, data, updateTime: true })
        wx.navigateBack()
        event.emit(UPDATE_LOCAL_TODO, { _id, ...data })
        showToast('编辑成功', {
          duration: 2000
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.setData({ operating: false })
      }
    }
  }
})