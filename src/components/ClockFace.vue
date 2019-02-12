<template>
  <div class="clock-face">
    <div class="time">{{ parts.hhmm }}</div>
    <div class="right-box">
      <div class="seconds">{{ ':' + parts.ss }}</div>
      <div class="suffix">{{ parts.suffix }}</div>
    </div>
    <div class="mdy">{{ parts.mdy }}</div>
    <div class="dow">{{ parts.dow }}</div>
  </div>
</template>

<script>
const timeDelay = 1000  // Update time every second

// This component displays the large time and date, intended to be seen across the room.
// On each second, the data's 'parts' object is updated with a breakdown of time info.
//
export default {
  name: 'ClockFace',
  data () {
    const t = new Date()
    return {
      parts: this.getTimeParts(t),
      timer: null
    }
  },
  mounted () {
    this.timer = window.setInterval(() => {
      this.parts = this.getTimeParts(new Date())
    }, timeDelay)
  },
  beforeDestroy () {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  },
  methods: {
    // Split the time into an object with strings broken up and formatted to fit component needs.
    getTimeParts (time) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const minutes = time.getMinutes()
      const seconds = time.getSeconds()
      let hours = time.getHours()
      const isPM = hours >= 12
      hours = (hours > 12) ? hours - 12 : hours
      hours = (hours === 0) ? 12 : hours
      const hhmm = `${hours}:${((minutes < 10) ? '0' + minutes : minutes)}`
      const ss = (seconds < 10) ? '0' + seconds : seconds.toString()
      const suffix = isPM ? 'PM' : 'AM'
      const dow = days[time.getDay()]
      const mdy = `${months[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`
      return {
        hhmm,
        ss,
        suffix,
        dow,
        mdy,
        isPM,
        full: `${hhmm}:${ss} ${suffix}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./_globals.scss";

$fontsize: 400%;

.clock-face {
  font-family: sans-serif;
  text-shadow: 2px 2px 4px #000000;
  text-align: center;
  color: $fgcolor;
  margin-top: .5em;
}

.clock-face .time {
  display: inline-block;
  font-size: $fontsize;
  font-weight: bold;
  color: inherit;
}

.clock-face .dow {
  display: block;
  font-size: $fontsize/3.33;
}

.clock-face .mdy {
  display: block;
  font-size: $fontsize/3.33%;
}

.right-box {
  display: inline-block;
  font-weight: bold;
  text-align: left;
  font-size: $fontsize/2.5;
  width: 2em;
}

.clock-face .seconds {
  display: inline-block;
  width: 4em;
}

.clock-face .suffix {
  display: inline-block;
  width: 4em;
}
</style>
