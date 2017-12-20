<template>
    <div class="moon-phase">
        <div id="moonPhaseImage"></div>
    </div>
</template>

<script>
import QueryHelper from './QueryHelper'

const timeDelay = 1000 * 60 * 60  // Redraw moon phase once an hour

export default {
  name: 'MoonPhase',
  mixins: [QueryHelper],
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
        elem.style.backgroundImage = `url(${this.getMoonPhaseImageUrl()})`
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
