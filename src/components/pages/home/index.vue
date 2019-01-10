<template>
  <transition :name="moveName">
    <!-- 通知列表 -->
    <router-view class="routerview" :key="$route.fullpath"></router-view>
  </transition>
</template>
<script>
export default {
  data () {
    return {
      moveName: 'slide-right'
    }
  },
  watch: {
    $route (to, from) {
      this.moveName = 'slide-left'
    }
  }
}
</script>

<style lang="scss" scoped>
.routerview {
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.4s ease-in-out;
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}
</style>
