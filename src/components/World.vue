<template>
  <div id="world">
    <img id="bg1" class="bottom" scr="#" />
    <img id="bg2" class="bottom" scr="#" />
    <div class="content">
        <ClockFace/>
        <WeatherStatus/>
        <MoonPhase/>
        <SkyClock/>
    </div>
  </div>
</template>

<script>
import ClockFace from './ClockFace'
import MoonPhase from './MoonPhase'
import WeatherStatus from './WeatherStatus'
import SkyClock from './SkyClock'
import QueryHelper from './QueryHelper'

const timerDelay = 1000 * 60 * 15   // Refresh image every 15 minutes

// This component downloads a large image file of the world (with day/night shaddow) and displays it
// as a full-screen background.  Since the PNG file takes so long to download, two img's are used,
// stacked one on top of the other. The picture picture is downloaded to the back (hidden) image.
// Upon completion, the layering of the two images is switched.
// This component also plays host to the components that make up the rest of the app.
// Positioning of the children is largely left up to them.
//
export default {
  name: 'World',
  mixins: [
    QueryHelper
  ],
  components: {
    ClockFace,
    MoonPhase,
    WeatherStatus,
    SkyClock
  },
  data () {
    return {
      timer: null,
      bg1: null,
      bg2: null,
      phase: true
    }
  },
  mounted () {
    this.phase = true
    this.bg1 = document.getElementById('bg1')
    this.bg2 = document.getElementById('bg2')
    if (this.bg1 && this.bg2) {
      this.bg1.addEventListener('load', this.change)
      this.bg2.addEventListener('load', this.change)
      this.timer = setInterval(this.periodic, timerDelay)
      this.periodic()
    }
  },
  beforeDestroy () {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  },
  methods: {
    // Periodically set the src attribute of the image at the bottom of the stack so its updated.
    // The image will fire the onload event when its complete.
    periodic () {
      const elem = this.phase ? this.bg1 : this.bg2
      elem.src = this.getEarthPictUrl()
    },
    // When a new image has been downloaded and onload fires, switch the zorder of the two images,
    // and toggle the phase variable.
    change () {
      this.phase = !this.phase
      if (this.bg1 && this.bg2) {
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
}
</script>

<style lang="scss">
@import "./_globals.scss";

#bg1 {
    background-color: $bgcolor;
    position: absolute;
    top: 0;
    left: 0;
    width: $horz;
    height: $vert;
}

#bg2 {
    background-color: $bgcolor;
    position: absolute;
    top: 0;
    left: 0;
    width: $horz;
    height: $vert;
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
    height: $vert;
    z-index: 3;
    font-size: 300%;
    text-align: center;
    overflow: hidden;
    cursor: none;
}
</style>
