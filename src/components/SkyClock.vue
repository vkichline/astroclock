<template>
  <div id="sky-clock">
    <canvas id="face" height="240" width="240"></canvas>
    <canvas id="tod" height="240" width="240"></canvas>
    <canvas id="sid" height="240" width="240"></canvas>
  </div>
</template>

<script>
export default {
  name: 'SkyClock',
  data () {
    let never = new Date(0, 0, 0, 0, 0, 0)
    return {
      face: null,       // Canvas for clock face
      tod: null,        // Canvas for Time of Day
      sid: null,        // Canvas for Siderial Time
      size: 0,          // Size of the canvas in pixels
      faceTimer: null,  // Clock face timer w/ daily data
      todTimer: null,   // Time of Day
      sidTimer: null,   // Siderial time
      lastFaceUpdate: never,
      lastTodUpdate: never,
      lastSidUpdate: never
    }
  },
  mounted () {
    this.face = document.getElementById('face')
    this.tod = document.getElementById('tod')
    this.sid = document.getElementById('sid')
    if (this.face && this.tod && this.sid) {
      this.size = this.face.clientWidth
      this.faceTimer = setInterval(this.updateFace, 1000 * 60)
      this.todTimer = setInterval(this.updateTod, 1000 * 60)
      this.sidTimer = setInterval(this.updateSid, 1000 * 60)
      this.updateFace()
      this.updateTod()
      this.updateSid()
    }
  },
  beforeDestroy () {
    if (this.timer) {
      window.clearTimeout(this.faceTimer)
    }
  },
  methods: {
    drawLines (color) {
      let ctx = this.face.getContext('2d')
      let centerX = this.size / 2
      let centerY = this.size / 2
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      // draw a long line for each hour
      let items = 24
      let r = (this.size / 2) * 0.8
      for (let i = 0; i < items; i++) {
        let x = centerX + r * Math.cos(2 * Math.PI * i / items)
        let y = centerY + r * Math.sin(2 * Math.PI * i / items)
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
      }
      // draw a short outer tick for every 15 minutes
      items *= 4
      let r1 = (this.size / 2) * 0.975
      let r2 = (this.size / 2)
      for (let i = 0; i < items; i++) {
        let xStart = centerX + r1 * Math.cos(2 * Math.PI * i / items)
        let yStart = centerY + r1 * Math.sin(2 * Math.PI * i / items)
        let xEnd = centerX + r2 * Math.cos(2 * Math.PI * i / items)
        let yEnd = centerY + r2 * Math.sin(2 * Math.PI * i / items)
        ctx.moveTo(xStart, yStart)
        ctx.lineTo(xEnd, yEnd)
      }
      ctx.stroke()
    },
    drawClockFace (color) {
      let fudge = [0.0, 0.0, -0.01, -0.01, -0.01, -0.005, // 18 - 23
        -0.04, -0.02, -0.02, -0.015, -0.01, -0.005,       // 0 - 5
        0.0, 0.005, 0.01, 0.015, 0.0, 0.0,                // 6 - 11
        -0.01, 0.0, 0.0, 0.0, 0.0, 0.0]                   // 12 - 17
      let ctx = this.face.getContext('2d')
      ctx.beginPath()
      let x0 = (this.size / 2) * 0.925
      let y0 = (this.size / 2) * 1.04
      ctx.font = '16px Arial'
      ctx.strokeStyle = color
      ctx.fillStyle = color
      let items = 24
      let r = (this.size / 2) * 0.87
      for (let i = 0; i < items; i++) {
        // fudge factor gets numbers properyly aligned...
        let x = x0 + r * Math.cos(2 * Math.PI * i / items + fudge[i])
        let y = y0 + r * Math.sin(2 * Math.PI * i / items + fudge[i])
        ctx.fillText((i + (items * 3 / 4)) % items, x, y)
      }
      ctx.closePath()
    },
    drawTime (element, time, color, width) {
      let centerX = this.size / 2
      let centerY = this.size / 2
      let ctx = element.getContext('2d')
      ctx.beginPath()
      ctx.clearRect(0, 0, this.size, this.size)
      ctx.strokeStyle = color
      ctx.lineWidth = width
      let part = (time.getHours() * 60.0 + time.getMinutes()) / 1440.0
      let r = (this.size / 2) * 1.1
      part = (part + 0.25) % 1
      let x = centerX + r * Math.cos(2.0 * Math.PI * part)
      let y = centerY + r * Math.sin(2.0 * Math.PI * part)
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.closePath()
    },
    drawWedge (start, end, r, color) {
      let ctx = this.face.getContext('2d')
      let centerX = this.size / 2
      let centerY = this.size / 2
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = 1
      let startAngle = (start.getHours() * 60.0 + start.getMinutes()) / 1440.0
      startAngle = (startAngle + 0.25) % 1
      let endAngle = (end.getHours() * 60.0 + end.getMinutes()) / 1440.0
      endAngle = (endAngle + 0.25) % 1
      ctx.moveTo(centerX, centerY)
      let x = centerX + r * Math.cos(2.0 * Math.PI * startAngle)
      let y = centerY + r * Math.sin(2.0 * Math.PI * startAngle)
      ctx.lineTo(x, y)
      ctx.arc(centerX, centerY, r, startAngle * 2.0 * Math.PI, endAngle * 2.0 * Math.PI)
      ctx.lineTo(centerX, centerY)
      ctx.fill()
      ctx.closePath()
    },
    drawSunMoonInfo (moonRise, moonSet, soct, sunRise, sunSet, eoct) {
      let r = (this.size / 2) * 0.7
      this.drawWedge(soct, sunRise, r, '#888')
      this.drawWedge(sunRise, sunSet, r, '#00f')
      this.drawWedge(sunSet, eoct, r, '#888')
      this.drawWedge(moonRise, moonSet, (this.size / 4), 'rgba(255, 0, 0, 0.5)')
    },
    // Using 'today' for date uses UTC.  This retruns the string for today,
    // in a format like: '12/16/2017'.
    // Uses date supplied, or current date.
    getDateString (date) {
      let now = date || new Date()
      return (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear()
    },
    getSiderialTime (cb) {
      let url = 'http://api.usno.navy.mil/sidtime?ID=KICHLINE&date=' + this.getDateString() + '&time=now&loc=Kirkland,%20WA'
      let request = new XMLHttpRequest()
      request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            let response = JSON.parse(request.response)
            let results = response.properties.data[0]
            let sid = results.last
            let parts = sid.split('.')
            let time = parts[0]
            parts = time.split(':')
            let date = new Date(results.year, results.month - 1, results.day, parts[0], parts[1], parts[2])
            cb(date)
          }
        }
      }
      request.open('GET', url)
      request.send()
    },
    // API Sun/Moon data always refers to today, and time is
    // (unfortunately) expressed in strings like "7:16 a.m. ST".
    // Supply a date object for today so we don't have to create
    // Date objects over ands over, and a string to convert.
    // Return a Date object for the string.
    getDateFromSunMoonData (today, data) {
      let parts = data.split(/[: ]/)
      let hours = parseInt(parts[0], 10)
      let minutes = parseInt(parts[1], 10)
      if (parts[2] === 'p.m.') { hours += 12 }
      return new Date(today.getFullYear(), today.getMonth(),
        today.getDate(), hours, minutes, 0)
    },
    // Create an array of Date objects, set to:
    //   [0] = MoonRise
    //   [1] = MoonTransit
    //   [2] = MoonSet
    //   [3] = BeginCivilTwilight
    //   [4] = SunRise
    //   [5] = SunTransit
    //   [6] = SunSet
    //   [7] = EndCivilTwilight
    //  'now' is a Date object for today; all results are for today,
    //  the param reduces calls to new Date().
    getSunMoonData (now, cb) {
      let url = 'http://api.usno.navy.mil/rstt/oneday?ID=KICHLINE&date=' + this.getDateString(now) + '&loc=Kirkland,%20WA'
      let request = new XMLHttpRequest()
      let that = this
      request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            let response = JSON.parse(request.response)
            let results = []
            results[0] = that.getDateFromSunMoonData(now, response.moondata[0].time)
            results[1] = that.getDateFromSunMoonData(now, response.moondata[1].time)
            results[2] = that.getDateFromSunMoonData(now, response.moondata[2].time)
            results[3] = that.getDateFromSunMoonData(now, response.sundata[0].time)
            results[4] = that.getDateFromSunMoonData(now, response.sundata[1].time)
            results[5] = that.getDateFromSunMoonData(now, response.sundata[2].time)
            results[6] = that.getDateFromSunMoonData(now, response.sundata[3].time)
            results[7] = that.getDateFromSunMoonData(now, response.sundata[4].time)
            cb(results)
          }
        }
      }
      request.open('GET', url)
      request.send()
    },
    updateFace () {
      let now = new Date()
      // Redraw the face if the day has changed
      if (now.toDateString() !== this.lastFaceUpdate.toDateString()) {
        this.lastFaceUpdate = now
        this.drawLines('#444')
        this.drawClockFace('#000')
        let that = this
        this.getSunMoonData(now, function (data) {
          that.drawSunMoonInfo(data[0], data[2], data[3], data[4], data[6], data[7])
          that.drawLines('#444')
          that.drawClockFace('#fff')
        })
      }
    },
    updateTod () {
      let now = new Date()
      // Redraw the time of day if more than 5 minutes has passed
      if (now - this.lastTodUpdate > 300000) {
        this.lastTodUpdate = now
        this.drawTime(this.tod, now, 'rgb(255, 255, 0)', 3)
      }
    },
    updateSid () {
      let now = new Date()
      // Redraw the time of day if more than 5 minutes has passed
      if (now - this.lastSidUpdate > 300000) {
        this.lastSidUpdate = now
        let that = this
        this.getSiderialTime(function (sidTime) {
          that.drawTime(that.sid, sidTime, 'rgb(0, 255, 255)', 1)
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import "../_globals.scss";

#sky-clock {
  position: absolute;
  right: $gap;
  bottom: $gap;
}

canvas {
  position: absolute;
  right: 0;
  bottom: 0;
  border: 1px solid #444;
  border-radius: 120px;
}

#face {
  background-color: $bgcolor;
  z-index: 0;
}

#tod {
  background-color: transparent;
  z-index: 1;
}

#tod {
  background-color: transparent;
  z-index: 2;
}

</style>
