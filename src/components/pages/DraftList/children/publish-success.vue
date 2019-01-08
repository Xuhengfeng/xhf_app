<template>
  <!-- 发布成功 -->
  <div class="wrap">
    <div>
      <div class="image"></div>
      <div class="content">
        <div>发布成功</div>
        <div>通知内容已成功发给{{num}}人</div>
        <div @click="$router.push('./NoticeList/View')">返回列表</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      num: 0
    }
  },
  created () {
    this.num = this.$route.query.num
    this.$store.dispatch('removeStudent')
  }
}
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  > div {
    position: absolute;
    top: 1.4rem;
    left: 1.4rem;
    right: 1.4rem;
    margin: auto;
    .image {
      width: 100%;
      height: 2.88rem;
      background: url("~@/images/success2.png") center center;
      background-size: cover;
    }
    .content {
      div {
        &:nth-of-type(1) {
          font-size: 0.4rem;
          font-weight: 700;
          color: #5094f3;
          margin-bottom: 0.35rem;
        }
        &:nth-of-type(2) {
          font-size: 0.3rem;
          color: #666666;
          margin-bottom: 0.55rem;
        }
        &:nth-of-type(3) {
          width: 2.53rem;
          margin: 0 auto;
          height: 0.75rem;
          line-height: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.32rem;
          color: #ffffff;
          background: #5094f3;
        }
      }
    }
  }
}
</style>
