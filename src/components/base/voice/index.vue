<template>
  <div class="voice">
    <audio :src="voice" controls ref="audio" style="position:absolute;clip:rect(0 0 0 0);width:20%;height:20px;"></audio>
    <div class="audio">
      <div class="btn">
        <div class="start" v-show="show"></div>
        <div class="close" v-show="!show"></div>
      </div>
      <div class="draw">
        <div class="point" v-for="(item,index) in calcNum" :key="index"></div>
        <div class="move" v-show="!show">
          <div v-for="(item,index) in 6" :key="index"></div>
        </div>
      </div>
      <div class="time">{{showtime}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['voice'],
  data () {
    return {
      show: true, // 切换开、关
      timer: null, // 定时器
      showtime: '0:00', // 播放时间
      calcNum: 100 // 遍历次数
    }
  },
  mounted () {
    var draw = document.querySelector('.draw')
    var start = document.querySelector('.start')
    var close = document.querySelector('.close')
    this.calcNum = parseInt((draw.getBoundingClientRect().width - 50) / 5)
    start.addEventListener('click', () => {
      this.show = !this.show
      this.$refs.audio.play()
      this.timer = setInterval(() => {
        this.currentPulse()
      }, 200)
    })
    close.addEventListener('click', () => {
      this.show = !this.show
      this.$refs.audio.pause()
      clearInterval(this.timer)
    })
  },
  methods: {
    uploadAudio (e) {
      var that = this
      var reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])// 发起异步请求
      reader.onload = function (res) {
        // 读取完成后，数据保存在对象的result属性中
        that.voice = this.result
      }
    },
    currentPulse () {
      var move = document.querySelector('.move')
      var currentTime = this.$refs.audio.currentTime
      var duration = this.$refs.audio.duration
      var m = parseInt(duration / 60) || 0
      var s = parseInt(duration % 60) || 0
      var cm = parseInt(currentTime / 60)
      var cs = parseInt(currentTime % 60)
      // this.showtime = cm + ':' + cs + '/' + m + ':' + s
      this.showtime = cm + ':' + cs
      if (currentTime < duration) {
        move.style.left = (currentTime / duration) * 100 + '%'
        var heightArr = [0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55]
        for (let i = 0; i < 6; i++) {
          let randNum = Math.floor(Math.random() * 6)
          move.childNodes[i].style.height = heightArr[randNum] + 'rem'
        }
      } else if (currentTime - duration <= 4 || currentTime === duration) {
        clearInterval(this.timer)
        this.show = true
        move.style.display = 'none'
      }
    }

  }
}
</script>

<style lang="less">
.voice {
  background: #f2f1f1;
  position: relative;
}
.audio {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 1rem;
  background: #f2f1f1;
  position: relative;
  .btn {
    .start {
      flex: 0.5rem 0 0;
      width: 0.5rem;
      height: 100%;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      &::after {
        content: "";
        width: 0;
        height: 0;
        border-width: 0.2rem;
        border-style: solid;
        margin-left: 30%;
        border-color: transparent transparent transparent #3ca6e4;
      }
    }
    .close {
      flex: 0.5rem 0 0;
      width: 0.5rem;
      height: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-around;
      align-items: center;
      &::after,
      &::before {
        content: "";
        display: block;
        width: 0.1rem;
        height: 0.5rem;
        background: #3ca6e4;
      }
    }
  }
  .draw {
    position: relative;
    width: 80%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .point {
      flex: 0.03rem 0 0;
      width: 0.03rem;
      height: 0.05rem;
      margin-right: 0.09rem;
      background: #3ca6e4;
      transition: all 0.2 ease-in-out;
      border-radius: 0.1rem;
    }
    .move {
      position: absolute;
      top: auto;
      width: 0.5rem;
      height: 0.8rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #f2f1f1;
      div {
        flex: 0.03rem 0 0;
        width: 0.03rem;
        height: 0.5rem;
        background: #3ca6e4;
        transition: all 0.2 ease-in-out;
        border-radius: 0.1rem;
      }
    }
  }
  .time {
    font-size: 0.35rem;
  }
}
</style>
