<template>
  <org-tree ref="orgTree" @confirm="confirm"></org-tree>
</template>

<script>
import { OrgTree } from '@xuhengfeng/vue-components-app'
import { mapState } from 'vuex'
export default {
  components: {
    OrgTree
  },
  computed: {
    ...mapState({
      selected: state => state.selected.selected
    })
  },
  activated () {
    // let defaultUsers = [
    //   {userId: '0563025269464f1f9a77e6b41acdf459', userName: '田乐'},
    //   {userId: '071116f205d54a7ba6610da3755335e4', userName: '张丹笛'}
    // ]
    // let defaultDepts = [
    //   {deptId: 'fcd8aa9120d84086ab05242c19beada8', deptName: '校领导'}
    // ]
    // let defaultGroups = [
    //   {groupId: '082f4a25198345799425120736cc1fe1', groupName: '签收人'}
    // ]
    // // 设置默认已选
    this.$refs.orgTree.setSelected(this.selected.users, this.selected.depts, this.selected.groups)
  },
  methods: {
    confirm (result) {
      this.$store.commit('selected/updateData', result)
      this.$router.go(-1)
    }
  }
}
</script>
