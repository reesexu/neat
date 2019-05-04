import computedBehavior from 'miniprogram-computed'
import { TITLE_MAX_LENGTH, priorityClasses, storgeKeys } from '../../constants/index'
Component({
  data: {
    maxLength: TITLE_MAX_LENGTH + 1
  },
  behaviors: [computedBehavior],
  computed: {
    priorityIcon() {
      return `../../images/priority-easy.svg`
    }
  }
})