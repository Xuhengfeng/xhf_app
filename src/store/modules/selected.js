export default {
  namespaced: true,
  state: {
    selected: {
      depts: [], // 已选部门
      groups: [], // 已选分组
      users: [] // 已选人员
    }
  },
  mutations: {
    updateData (state, data) {
      state.selected = data
    },
    delDept (state, dept) {
      state.selected.depts = state.selected.depts.filter((item) => item.deptId !== dept.deptId)
    },
    delGroup (state, group) {
      state.selected.groups = state.selected.groups.filter((item) => item.groupId !== group.groupId)
    },
    delUser (state, user) {
      state.selected.users = state.selected.users.filter((item) => item.userId !== user.userId)
    }
  },
  actions: {

  },
  getters: {

  }
}
