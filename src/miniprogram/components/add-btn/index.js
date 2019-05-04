import computedBehavior from 'miniprogram-computed'
import classnames from 'classnames'
const { models } = getApp()
Component({
  data: {
    show: false
  },
  behaviors: [computedBehavior],
  computed: {
    iconClass() {
      return classnames('addBtn-icon', { 'addBtn-icon-rotate': this.data.show })
    }
  },
  methods: {
    showMenus() {
      this.setData({ show: true })
      models.todo.setCurrentTodo({})
      wx.showActionSheet({
        itemList: ['新建任务', '新建清单'],
        success: ({ tapIndex }) => {
          switch (tapIndex) {
            case 0:
              wx.navigateTo({ url: '/pages/edit/index?type=new' })
              break
            case 1:

              break
          }
        },
        complete: () => {
          this.setData({ show: false })
        }
      })
    }
  }
})