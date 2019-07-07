import computedBehavior from 'miniprogram-computed'

Component({
  behaviors: [computedBehavior],
  computed: {
    _class() {
      return `iconfont icon-${this.properties.type} icon-${this.properties.size} ${this.properties.eClass}`
    }
  },
  properties: {
    // 图标类型
    type: {
      type: String,
      value: ''
    },
    // icon大小, oneof ['x', 'm', 'l]
    size: {
      type: String,
      value: 'm'
    },
    // 自定义class
    eClass: {
      type: String,
      value: ''
    }
  },
  options: {
    addGlobalClass: true
  }
})