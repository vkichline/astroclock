<template>
    <div class="moon-phase">
        <div id="moonPhaseImage"></div>
    </div>
</template>

<script>
export default {
  name: 'MoonPhase',
  data () {
    return {
      timer: null
    }
  },
  mounted () {
    this.timer = setInterval(this.refreshMoonImage, 1000 * 60 * 60)
    this.refreshMoonImage()
  },
  beforeDestroy () {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  },
  methods: {
    refreshMoonImage () {
      console.log('z')
      let elem = document.getElementById('moonPhaseImage')
      if (elem) {
        let now = new Date()
        let hours = now.getUTCHours()
        let minutes = now.getUTCMinutes()
        let utcTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes)
        let url = 'http://api.usno.navy.mil/imagery/moon.png?ID=KICHLINE&date=today&time=' + utcTime
        elem.style.backgroundImage = 'url(' + url + ')'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$horz: 1600px;
$vert: 900px;
$size: 6em;
$curve: 1.5em;
$gap: .5em;

.moon-phase  {
  position: absolute;
  top: $vert - 420px;
  left: $gap;
  background-color: black;
  height: $size;
  width: $size;
  border-radius: $curve;
  overflow: hidden;
  opacity: 0.85;
}

.moon-phase #moonPhaseImage {
  background-position: center;
  background-repeat: no-repeat;
  background-size: 150%;
  height: $size;
  width: $size;
}
</style>