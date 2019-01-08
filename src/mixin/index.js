// 混入公共数据,方法等
import Vue from 'vue'
Vue.mixin({
  // 组件内的data,props是访问不到这个data里数据的
  data () {
    return {
      // 根据uuid获取图片地址
      readFileUrl: window.SYSTEM_CONFIG.fileApi + '/file/IoReadFile?uuid='
    }
  },
  created: function () {

  },
  mounted () {

  },
  methods: {

  }
})
