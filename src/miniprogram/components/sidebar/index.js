import computedBehavior from 'miniprogram-computed'
import classnames from 'classnames'
import route from '../../constants/route'

const { models } = getApp()

Component({
  startX: 0,
  data: {
    show: false
  },
  behaviors: [computedBehavior],
  options: {
    addGlobalClass: true
  },
  computed: {
    sidebarClass() {
      return classnames('sidebar', { 'sidebar-show': this.data.show })
    }
  },
  methods: {
    // 开关
    toggle() {
      this.setData({ show: !this.data.show })
    },
    touchstart({ changedTouches }) {
      this.startX = changedTouches[0].pageX
    },
    touchend({ changedTouches }) {
      this.startX - changedTouches[0].pageX > 20 && this.toggle()
    },
    showMenus() {
      this.setData({ show: true })
      models.todo.setCurrentTodo({})
      models.list.setCurrentList({})
      wx.showActionSheet({
        itemList: ['添加任务', '添加清单'],
        success: ({ tapIndex }) => {
          switch (tapIndex) {
            case 0:
              wx.navigateTo({ url: route.addTodo })
              break
            case 1:
              wx.navigateTo({ url: route.addList })
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