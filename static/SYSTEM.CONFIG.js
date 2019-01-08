// 当前使用的服务器
var ACTIVE_SERVER

if (/micromessenger/.test(window.navigator.userAgent.toLowerCase())) {
  ACTIVE_SERVER = 'INTRANET_SERVER' // 在微信中使用的地址
} else {
  ACTIVE_SERVER = 'INTRANET_SERVER' // 不在微信中使用的地址
}

window.checkWX = true // 设置成false, 即使在微信中打开，也不会走微信的oAuth流程
window.closeWX = false // 设置成true, 在微信中打开时，会关闭微信页面而不是跳转到登录页

// 全部服务器
var ALL_SERVERS = {
  // 1. 内网版
  INTRANET_SERVER: {
    webServer: 'http://192.168.0.201:8070', // 前端静态页面地址
    apiServer: 'http://192.168.0.201:9094', // 接口网关地址
    fileServer: 'http://192.168.0.201:9091', // 文件服务地址(特殊,未走网关)
  }
}

window.SYSTEM_CONFIG = {
  loginType: 'third',
  weishaoUrl: 'https://k12.api.weishao.com.cn/loginout?post_logout_redirect_uri=',
  webServer: ALL_SERVERS[ACTIVE_SERVER]['webServer'],
  apiServer: ALL_SERVERS[ACTIVE_SERVER]['apiServer'],
  fileServer: ALL_SERVERS[ACTIVE_SERVER]['fileServer'],
  homePage: ALL_SERVERS[ACTIVE_SERVER]['webServer'] + '/home/', // 我的主页
  homePageApp: ALL_SERVERS[ACTIVE_SERVER]['webServer'] + '/app/', // 移动端主页
  loginPage: ALL_SERVERS[ACTIVE_SERVER]['fileServer'] + '/sso-server/pc/login', // 登录页
  logoutPage: ALL_SERVERS[ACTIVE_SERVER]['fileServer'] + '/sso-server/pc/logout', // 退出页
  loginPageApp: ALL_SERVERS[ACTIVE_SERVER]['fileServer'] + '/sso-server/app/login', // 移动端登录页
  WXAPPID: 'wxee9450dd86e56acd', // 微信APPID
  fileApi: ALL_SERVERS[ACTIVE_SERVER]['fileServer'] + '/dfs-neptune', // 文件API
  cfsApi: ALL_SERVERS[ACTIVE_SERVER]['apiServer'] + '/yun-doc-convert-api', // 文件转化API
  htmlUrl: '//192.168.0.201:8070/storage', // 转换文件后的 html 服务器
  previewPDFUrl: '//192.168.0.201:8070/pdf-viewer/web', // pdf.js 预览文件地址
  officePreviewUrl: 'https://view.officeapps.live.com/op/view.aspx', // office 预览文件地址
  platformApi: '/platform-neptune', // 平台API
  classApi: '/msg-neptune' // 班级通知
}

// 腾讯云cos
window.COS_CONFIG = {
  Prefix: `${window.location.protocol}//lunyu-1255697909.cos.ap-guangzhou.myqcloud.com/`,
  AuthUrl: '//134.175.237.224:3000/auth'
}

// 应用重定向地址
window.appRedirectUrl = 'https://xx.xx.xx/login'
