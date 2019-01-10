<template>
  <div class="homeComponent">
    <QrCode></QrCode>
  </div>
</template>
<script>
import { QrCode } from '@xuhengfeng/vue-components-app'
export default {
  components: {
    QrCode
  },
  data () {
    return {
      url1: '',
      url2: ''
    }
  },
  methods: {
    getUrl (e, params) {
      var that = this
      window.analyticCode.getUrl(params, e.target, function (url1, url2) {
        that.url1 = url1
        that.url2 = url2
      })
    },
    generate () {
      this.$refs.qrcode.innerHTML = ''
      var changeText = Math.random() + 'ok'
      var qrcode = new QRCode(this.$refs.qrcode, {
        width: 100,
        height: 100,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      // 使用 API
      qrcode.clear()
      qrcode.makeCode(changeText)
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@xuhengfeng/styles-app/styles/mixin.less";
body {
  margin: 0;
}
.module-content {
  min-width: 770px;
  max-width: 1000px;
  width: 100%;
  color: #000;
  margin: 0 auto;
}
.module-head {
  text-align: center;
  font-weight: 500;
  margin: 0;
  font-size: 30px;
  height: 100px;
  line-height: 100px;
  color: #000;
}
.box h3 {
  font-weight: 300;
  margin: 0;
  font-size: 20px;
  height: 60px;
  line-height: 60px;
  color: #000;
}
.url-box {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}
#file {
  position: absolute;
  width: 120px;
  height: 120px;
  opacity: 0;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 10;
}
.generate {
  width: 100px;
  height: 100px;
}
</style>
