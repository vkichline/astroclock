<template>
  <div id="app">
    <div class="empty"></div>
    <ClockFace/>
  </div>
</template>

<script>
import ClockFace from './components/ClockFace'
export default {
  name: 'app',
  data () {
    return {
      timer: null
    }
  },
  components: {
    ClockFace
  },
  mounted () {
    this.timer = window.setInterval(() => {
      this.refreshOffscreen()
    }, 15000)
    this.refreshOffscreen()
  },
  beforeDestroy () {
    if (this.time) {
      window.clearTimeout(this.timer)
    }
  },
  methods: {
    getTimeString: function () {
      let now = new Date()
      let hours = now.getUTCHours()
      let minutes = now.getUTCMinutes()
      return hours.toString() + ':' + (minutes < 10 ? '0' + minutes.toString() : minutes.toString())
    },
    makeImgUrl: function () {
      let utcTime = this.getTimeString()
      return 'http://api.usno.navy.mil/imagery/earth.png?ID=KICHLINE&date=today&time=' + utcTime
    },
    refreshOffscreen: function () {
      console.log('refreshOffscreen')
      let img = new Image()
      if (img) {
        img.src = this.makeImgUrl()
        img.loadend = this.refreshBackground(img)
      }
    },
    refreshBackground: function (img) {
      console.log('refreshBackground; img.src = ', img.src)
      let appElem = document.getElementById('app')
      if (appElem) {
        appElem.style.backgroundImage = 'url(' + img.src + ')'
      }
    }
  }
}
</script>

<style lang="scss">
$bg: black;
$fg: white;

#app {
  font-family: "Times New Roman";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 200%;
  height: 900px;
  width: 1600px;
  text-align: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: $fg;
  background-color: $bg;
}
</style>
