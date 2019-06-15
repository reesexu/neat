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
    title: '',
    maxLength: TODO_TITLE_MAX_LENGTH + 1,
    loading: false,
    defPriority: 0
  },
  behaviors: [computedBehavior],
  computed: {},
  methods: {
    onLoad() {

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
    }, 1000)
  }
})