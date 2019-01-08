import Vue from 'vue'
import Vuex from 'vuex'
import store from './store' // 状态管理
import Router from 'vue-router'
import {
  TotalRouter,
  PublicRouter,
  ForbiddenRouter,
  OfflineRouter
} from './router' // 路由
import App from './App' // 应用根组件
import './filters' // 全局过滤器
import './mixin' // 全局混入
import './directives' // 全局指令
import '@xuhengfeng/styles-app' // 基础样式   其中应用所有到的颜色需从color.less里取,webpack已添加配置,组件中无需单独引入color.less
import './styles/index.less' // 应用的全局样式
import './utils/response.js'
import {
  Terminal
} from './utils/index.js'
import {
  platformAjax,
  classAjax
} from './ajax' // ajax实例
import classUrl from './ajax/classUrl'
import FastClick from 'fastclick'
import Upload from 'base/upload'
import FileList from 'base/file-list'
import voice from 'base/voice'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import {
  AlertPlugin,
  ConfirmPlugin,
  LoadingPlugin,
  ToastPlugin
} from 'vux'
Vue.use(Vuex)

// 判断应用运行平台
for (var el in Terminal.platform) {
  if (Terminal.platform[el]) {
    Vue.prototype.$Terminal = el
  }
}
Vue.use(Router)
Vue.component('upload', Upload)
Vue.component('file-list', FileList)
Vue.component('voice', voice)
Vue.config.productionTip = process.env.NODE_ENV === 'development'
Vue.config.devtools = true
// 注册全局vux插件
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)

// 300ms点击延迟
FastClick.attach(document.body)
platformAjax.init(window.SYSTEM_CONFIG.apiServer + window.SYSTEM_CONFIG.flowApi)
classAjax.init(window.SYSTEM_CONFIG.classServer + window.SYSTEM_CONFIG.classApi)
Vue.prototype.$URL = classUrl
Vue.prototype.$platformAjax = platformAjax
Vue.prototype.$classAjax = classAjax
Vue.prototype.$MeScroll = MeScroll

// 移动端调试工具
new VConsole()

// 获取用户基本信息
// store
//   .dispatch('getUserDetail')
//   // 1. 用户有默认角色
//   .then(res => {
if (process.env.NODE_ENV === 'development') {
  console.log(11)
  // 1.1 开发环境使用App.vue里配置的全部菜单
  // 默认激活第一个
  // TotalRouter.push({
  //   path: '*',
  //   redirect: TotalRouter[0].redirect
  // })
  let router = new Router({
    routes: TotalRouter.concat(PublicRouter),
    scrollBehavior (to, from, savedPosition) {
      return {
        x: 0,
        y: 0
      }
    }
  })
  renderApp(router)
} else if (process.env.NODE_ENV === 'production') {
  console.log(22)
  // 1.2 生产环境通过接口获取用户实现拥有权限的菜单
  store.dispatch('getMenuList').then(res => {
    let authoredRouter
    // 1.2.1 应用下线提示
    if (res === 'offline') {
      authoredRouter = OfflineRouter
    } else {
      // 过滤得到该用户已被授权的可访问菜单
      authoredRouter = TotalRouter.filter(item => {
        return res.findIndex(menu => menu.menuCode === item.name) !== -1
      })
      if (authoredRouter.length) {
        // 1.2.2 有可访问菜单默认跳转到第一个,
        authoredRouter.push({
          path: '*',
          redirect: `${authoredRouter[0].redirect}`
        })
      } else {
        // 1.2.3 没有授权的路由跳转到无权限提示页
        authoredRouter = ForbiddenRouter
      }
    }
    let router = new Router({
      routes: authoredRouter.concat(PublicRouter),
      scrollBehavior (to, from, savedPosition) {
        return {
          x: 0,
          y: 0
        }
      }
    })
    renderApp(router)
  })
}
// })

// 实例化应用
function renderApp (router) {
  new Vue({
    el: '#app',
    router,
    store,
    components: {
      App
    },
    template: '<App/>'
  })
}
