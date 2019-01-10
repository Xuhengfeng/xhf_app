import {
  Forbidden,
  Offline
} from '@xuhengfeng/vue-components-app'

// 草稿列表
const Home = () => import('pages/home')
const HomeView = () => import('pages/home/children/View')

// 人员选择
const PersonSelect = () => import('public/PersonSelect')

// 全部路由
const TotalRouter = [
  // 草稿列表
  {
    path: '/Home',
    component: Home,
    name: 'Home',
    redirect: '/Home/View',
    children: [{
      path: 'View',
      component: HomeView,
      name: 'HomeView'
    }]
  }
]

// 公共Router,非菜单路由
const PublicRouter = [{
  path: '/PersonSelect',
  name: 'PersonSelect',
  component: PersonSelect
}]

// 无权访问提示页
const ForbiddenRouter = [{
  path: '*',
  redirect: '/403'
},
{
  path: '/403',
  component: Forbidden
}
]
// 应用未上架提示页
const OfflineRouter = [{
  path: '*',
  redirect: '/offline'
},
{
  path: '/offline',
  component: Offline
}
]

export {
  TotalRouter,
  PublicRouter,
  ForbiddenRouter,
  OfflineRouter
}
