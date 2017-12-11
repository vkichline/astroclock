<template>
  <div id="app">
    <div class="empty"></div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      timer: null
    }
  },
  mounted () {
    this.timer = window.setInterval(() => {
      this.refreshBackground()
    }, 300000)
    this.refreshBackground()
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
    refreshBackground: function () {
      let utcTime = this.getTimeString()
      let url = 'http://api.usno.navy.mil/imagery/earth.png?ID=KICHLINE&date=today&time=' + utcTime
      let appElem = document.getElementById('app')
      if (appElem) {
        appElem.style.backgroundImage = 'url(' + url + ')'
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
