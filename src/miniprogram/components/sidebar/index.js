import computedBehavior from 'miniprogram-computed'
import classnames from 'classnames'
import route from '../../constants/route'

const { models } = getApp()

Component({
  startX: 0,
  data: {
    show: true,
    lists: []
  },
  behaviors: [computedBehavior],
  options: {
    addGlobalClass: true
  },
  computed: {
    sidebarClass() {
      return classnames('sidebar-wrapper', { 'sidebar-wrapper-show': this.data.show })
    }
  },
  lifetimes: {
    async created() {
      const { data } = await models.list.getLists()
      console.log(data)
      this.setData({ lists: data })
    }
  },
  methods: {
    // 开关
    toggle(event) {
      if (event && event.type === 'tap' && event.target.id !== event.currentTarget.id) return
      this.setData({ show: !this.data.show })
    },
    touchstart({ changedTouches }) {
      this.startX = changedTouches[0].pageX
    },
    touchend({ changedTouches }) {
      this.startX - changedTouches[0].pageX > 20 && this.toggle()
    },
    toAdd() {
      wx.navigateTo({ url: route.addList })
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