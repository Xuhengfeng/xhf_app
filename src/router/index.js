import {
  Forbidden,
  Offline
} from '@xuhengfeng/vue-components-app'

// 草稿列表
const DraftList = () => import('pages/DraftList')
const DraftListView = () => import('pages/DraftList/children/View')
const DraftEdit = () => import('pages/DraftList/children/edit')
const DraftAddPerson = () => import('pages/DraftList/children/add-person')
const DraftPublishSuccess = () => import('pages/DraftList/children/publish-success')

// 人员选择
const PersonSelect = () => import('public/PersonSelect')

// 全部路由
const TotalRouter = [
  // 草稿列表
  {
    path: '/DraftList',
    component: DraftList,
    name: 'DraftList',
    redirect: '/DraftList/View',
    children: [{
      path: 'View',
      component: DraftListView,
      name: 'DraftListView'
    },
    {
      path: 'Edit',
      component: DraftEdit,
      name: 'DraftEdit'
    },
    {
      path: 'AddPerson',
      component: DraftAddPerson,
      name: 'DraftAddPerson'
    },
    {
      path: 'PublishSuccess',
      component: DraftPublishSuccess,
      name: 'DraftPublishSuccess'
    }
    ]
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
