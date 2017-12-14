<template>
  <div id="world">
    <img id="bg1" class="bottom" scr="#" />
    <img id="bg2" class="bottom" scr="#" />
    <div class="content">
        <ClockFace/>
        <WeatherStatus/>
        <MoonPhase/>
    </div>
  </div>
</template>

<script>
import ClockFace from './ClockFace'
import MoonPhase from './MoonPhase'
import WeatherStatus from './WeatherStatus'

export default {
  name: 'World',
  data () {
    return {
      timer: null,
      bg1: null,
      bg2: null,
      phase: true
    }
  },
  components: {
    ClockFace,
    MoonPhase,
    WeatherStatus
  },
  mounted () {
    this.phase = true
    this.bg1 = document.getElementById('bg1')
    this.bg2 = document.getElementById('bg2')
    this.bg1.addEventListener('load', this.change)
    this.bg2.addEventListener('load', this.change)
    this.timer = setInterval(this.periodic, 1000 * 60 * 15)
    this.periodic()
  },
  beforeDestroy () {
    if (this.timer) {
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
    periodic: function () {
      let elem = this.phase ? this.bg1 : this.bg2
      elem.src = this.makeImgUrl()
    },
    change: function () {
      this.phase = !this.phase
      if (this.phase) {
        this.bg2.className = 'top'
        this.bg1.className = 'bottom'
      } else {
        this.bg1.className = 'top'
        this.bg2.className = 'bottom'
      }
    }
  }
}
</script>

<style lang="scss">
$horz: 1600px;
$vert: 900px;

#bg1 {
    background-color: black;
    position: absolute;
    top: 0;
    left: 0;
    width: $horz;
    height: vert;
}

#bg2 {
    background-color: black;
    position: absolute;
    top: 0;
    left: 0;
    width: $horz;
    height: vert;
}

.bottom {
    z-index: 1;
}

.top {
    z-index: 2;
}

.content {
    position: absolute;
    background-color: transparent;
    top: 0;
    left: 0;
    width: $horz;
    height: vert;
    z-index: 3;
    font-size: 300%;
    text-align: center;
}
</style>
