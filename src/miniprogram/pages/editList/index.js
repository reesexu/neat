import debounce from 'debounce'
import isEqual from 'lodash.isequal'
import computedBehavior from 'miniprogram-computed'
import { showToast } from '../../utils/wx'
import { LIST_TITLE_MAX_LENGTH } from '../../constants/index'
import { validatetString, isContentEmpyt } from '../../utils/validate'

const { models, globalData } = getApp()

Component({
  data: {
    list: {},
    maxLength: LIST_TITLE_MAX_LENGTH + 1,
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
    disabled() {
      const { list, type } = this.data
      if (type === 'edit') {
        return isEqual(list, globalData.curtList)
      }
      return !list.title
    }
  },
  methods: {
    onLoad() {
      const list = Object.assign({}, globalData.curtList)
      this.setData({ list })
      wx.setNavigationBarTitle({ title: list.title ? '编辑清单' : '新建清单' })
    },
    // 输入事件
    onInput: debounce(function({ detail }) {
      let title = validatetString(detail.value)
      this.setData({
        ['list.title']: title
      })
    }, 250),
    async onSubmit() {
      const { operating, list, type } = this.data
      const { _id, title } = list
      if (isContentEmpyt(title) || operating) return
      const isEdit = type === 'edit'
      const data = { title }
      try {
        this.setData({ operating: true })
        if (isEdit) {
          await models.list.updateList({ _id, data, updateTime: true })
        } else {
          await models.list.addList(data)
        }
        wx.navigateBack()
        setTimeout(() => {
          showToast(`${isEdit ? '编辑' : '添加'}成功`, { duration: 1500 })
        }, 500)
      } catch (error) {
        console.error(error)
      } finally {
        this.setData({ operating: false })
      }

    }
  }
})