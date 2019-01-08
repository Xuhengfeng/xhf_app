import {
  platformAjax
} from '@/ajax'
export default {
  // 获取用户信息
  getUserDetail ({
    commit
  }) {
    return new Promise((resolve, reject) => {
      platformAjax.get('/user/detail').then((res) => {
        commit('updateUserDetail', res)
        if (res.rolePermission && res.defaultRoleId.trim() === '') {
          reject(new Error('无默认身份'))
        } else {
          resolve()
        }
      })
    })
  }
}
