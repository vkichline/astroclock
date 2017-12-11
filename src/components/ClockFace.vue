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
      parts: this.getTimeParts(t)
    }
  },
  computed: {
    hhmm: function () { return this.parts.hhmm },
    ss: function () { return this.parts.ss },
    suffix: function () { return this.parts.suffix },
    dow: function () { return this.parts.dow },
    mdy: function () { return this.parts.mdy }
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

<style scoped>
clock-face {
    font-family: sans-serif;
    text-align: center;
}

.clock-face .time {
    display: inline-block;
    font-size: 600%;
}

.clock-face .dow {
    display: block;
    font-size: 200%;
}

.clock-face .mdy {
    display: block;
    font-size: 150%;
}

.right-box {
    display: inline-block;
    text-align: left;
    font-size: 230%;
    width: 2em;
    margin-left: .1em;
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
