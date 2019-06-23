import computedBehavior from 'miniprogram-computed'
import classnames from 'classnames'

Component({
  behaviors: [computedBehavior],
  computed: {
    borderClass() {
      return classnames({ 'bd bd-b': this.properties.lineUnder })
    }
  },
  properties: {
    // 前缀图标
    icon: {
      type: String,
      value: ''
    },
    // 是否需要下分割线
    lineUnder: {
      type: Boolean,
      value: true
    }
  },
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  externalClasses: ['e-class'],
  methods: {
    onTap() {
      this.triggerEvent('itemtap')
    },
    onBodyTap() {
      this.triggerEvent('bodytap')
    }
  }
})