export default {
  inserted: function (el) {
    const oHeight = document.body.clientHeight
    window.addEventListener('resize', function (params) {
      if (oHeight > document.body.clientHeight) { // 键盘弹出
        // 参数为true时调用该函数，页面（或容器）发生滚动，使element的顶部与视图（容器）顶部对齐;
        // 参数为false时,使element的底部与视图（ 容器） 底部对齐。
        el.scrollIntoView(false)
      }
    }, false)
  }
}
