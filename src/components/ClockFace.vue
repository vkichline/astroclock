<template>
  <div class="clock-face">
    <div class="time">{{ hhmm }}</div>
    <div class="right-box">
      <div class="seconds">{{ ':' + ss }}</div>
      <div class="suffix">{{ suffix }}</div>
    </div>
    <div class="mdy">{{ mdy }}</div>
    <div class="dow">{{ dow }}</div>
  </div>
</template>

<script>
export default {
  name: 'ClockFace',
  data () {
    let t = new Date()
    return {
      time: t,
      parts: this.getTimeParts(t),
      timer: null
    }
  },
  computed: {
    hhmm: function () { return this.getTimeParts(this.time).hhmm },
    ss: function () { return this.getTimeParts(this.time).ss },
    suffix: function () { return this.getTimeParts(this.time).suffix },
    dow: function () { return this.getTimeParts(this.time).dow },
    mdy: function () { return this.getTimeParts(this.time).mdy }
  },
  mounted () {
    this.timer = window.setInterval(() => {
      this.time = new Date()
    }, 1000)
  },
  beforeDestroy () {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  },
  methods: {
    getTimeParts (time) {
      let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      let hours = time.getHours()
      let minutes = time.getMinutes()
      let seconds = time.getSeconds()
      let ispm = hours >= 12
      hours = (hours > 12) ? hours - 12 : hours
      hours = (hours === 0) ? 12 : hours
      let hhmm = hours + ':' + ((minutes < 10) ? '0' + minutes : minutes)
      let ss = (seconds < 10) ? '0' + seconds : seconds.toString()
      let suffix = ispm ? 'PM' : 'AM'
      let dow = days[time.getDay()]
      let mdy = months[time.getMonth()] + ' ' + time.getDate() + ', ' + time.getFullYear()
      return {
        hhmm: hhmm,
        ss: ss,
        suffix: suffix,
        full: hhmm + ':' + ss + ' ' + suffix,
        dow: dow,
        mdy: mdy,
        isPM: ispm
      }
    }
  }
}
</script>

<style lang="scss" scoped>

$fontsize: 400%;

.clock-face {
  font-family: sans-serif;
    text-align: center;
    color: white;
    margin-top: 1em;
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
