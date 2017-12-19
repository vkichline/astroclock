<template>
    <div class="moon-phase">
        <div id="moonPhaseImage"></div>
    </div>
</template>

<script>

const timeDelay = 1000 * 60 * 60  // Redraw moon phase once an hour

export default {
  name: 'MoonPhase',
  data () {
    return {
      timer: null
    }
  },
  mounted () {
    this.timer = setInterval(this.refreshMoonImage, timeDelay)
    this.refreshMoonImage()
  },
  beforeDestroy () {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  },
  methods: {
    refreshMoonImage () {
      const elem = document.getElementById('moonPhaseImage')
      if (elem) {
        const now = new Date()
        const hours = now.getUTCHours()
        const minutes = now.getUTCMinutes()
        const utcTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`
        const url = `http://api.usno.navy.mil/imagery/moon.png?ID=KICHLINE&date=today&time=${utcTime}`
        elem.style.backgroundImage = `url(${url})`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./_globals.scss";

$size: 5em;
$curve: 1em;

.moon-phase  {
  position: absolute;
  left: $gap;
  bottom: $gap;
  background-color: $bgcolor;
  height: $size;
  width: $size;
  border-radius: $curve;
  overflow: hidden;
}

.moon-phase #moonPhaseImage {
  background-position: center;
  background-repeat: no-repeat;
  background-size: 150%;
  height: $size;
  width: $size;
}
</style>
