<template>
  <div class="appWrap">
    <h1>欢迎使用VUE—APP应用的xhf_app模板</h1>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {}
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.appWrap {
  height: 100%;
  overflow: auto;
}
h1 {
  text-align: center;
  font-size: 0.32rem;
  line-height: 1rem;
}
</style>
