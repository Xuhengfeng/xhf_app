import Vue from 'vue'
import {
  TransferDom
} from 'vux'
import Touch from './touch'
import IosInput from './iosInput'
Vue.directive('transfer-dom', TransferDom)
// 手势动作
Vue.directive('touch', Touch)
// ios解决键盘挡住输入框指令
Vue.directive('iosinput', IosInput)
