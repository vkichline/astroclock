<template>
  <div id="sky-clock">
    <canvas id="face" height="240" width="240"></canvas>
    <canvas id="tod" height="240" width="240"></canvas>
    <canvas id="sid" height="240" width="240"></canvas>
  </div>
</template>

<script>
import QueryHelper from './QueryHelper'

const faceDelay = 1000 * 60 // Check once a minute to see if background face needs redraw
const todDelay = 1000 * 60  // Check once a minute to see it time of day needs update
const sidDelay = 1000 * 60  // Check once a minute to see if Sidereal Time needs update

export default {
  name: 'SkyClock',
  mixins: [
    QueryHelper
  ],
  data () {
    const never = new Date(0, 0, 0, 0, 0, 0)
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
      this.faceTimer = setInterval(this.updateFace, faceDelay)
      this.todTimer = setInterval(this.updateTod, todDelay)
      this.sidTimer = setInterval(this.updateSid, sidDelay)
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
      const ctx = this.face.getContext('2d')
      const centerX = this.size / 2
      const centerY = this.size / 2
      ctx.clearRect(0, 0, this.width, this.height)
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      // draw a long line for each hour
      const items = 24
      const r = (this.size / 2) * 0.8
      for (let i = 0; i < items; i++) {
        const x = centerX + r * Math.cos(2 * Math.PI * i / items)
        const y = centerY + r * Math.sin(2 * Math.PI * i / items)
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
      }
      // draw a short outer tick for every 15 minutes
      const ticks = items * 4
      const r1 = (this.size / 2) * 0.975
      const r2 = (this.size / 2)
      for (let i = 0; i < ticks; i++) {
        const xStart = centerX + r1 * Math.cos(2 * Math.PI * i / ticks)
        const yStart = centerY + r1 * Math.sin(2 * Math.PI * i / ticks)
        const xEnd = centerX + r2 * Math.cos(2 * Math.PI * i / ticks)
        const yEnd = centerY + r2 * Math.sin(2 * Math.PI * i / ticks)
        ctx.moveTo(xStart, yStart)
        ctx.lineTo(xEnd, yEnd)
      }
      ctx.stroke()
    },
    clearClockFace () {
      const ctx = this.face.getContext('2d')
      ctx.clearRect(0, 0, this.size, this.size)
    },
    drawClockFace (color) {
      const fudge = [0.0, 0.0, -0.01, -0.01, -0.01, -0.005, // 18 - 23
        -0.04, -0.02, -0.02, -0.015, -0.01, -0.005,         // 0 - 5
        0.0, 0.005, 0.01, 0.015, 0.0, 0.0,                  // 6 - 11
        -0.01, 0.0, 0.0, 0.0, 0.0, 0.0]                     // 12 - 17
      const ctx = this.face.getContext('2d')
      ctx.beginPath()
      const x0 = (this.size / 2) * 0.925
      const y0 = (this.size / 2) * 1.04
      ctx.font = '16px Arial'
      ctx.strokeStyle = color
      ctx.fillStyle = color
      const items = 24
      const r = (this.size / 2) * 0.87
      for (let i = 0; i < items; i++) {
        // fudge factor gets numbers properyly aligned...
        const x = x0 + r * Math.cos(2 * Math.PI * i / items + fudge[i])
        const y = y0 + r * Math.sin(2 * Math.PI * i / items + fudge[i])
        ctx.fillText((i + (items * 3 / 4)) % items, x, y)
      }
      ctx.closePath()
    },
    drawTime (element, time, color, width) {
      const centerX = this.size / 2
      const centerY = this.size / 2
      const ctx = element.getContext('2d')
      ctx.clearRect(0, 0, element.width, element.height)
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = width
      let part = (time.getHours() * 60.0 + time.getMinutes()) / 1440.0
      const r = (this.size / 2) * 1.1
      part = (part + 0.25) % 1
      const x = centerX + r * Math.cos(2.0 * Math.PI * part)
      const y = centerY + r * Math.sin(2.0 * Math.PI * part)
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.closePath()
    },
    drawWedge (start, end, r, color) {
      const ctx = this.face.getContext('2d')
      const centerX = this.size / 2
      const centerY = this.size / 2
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = 1
      let startAngle = (start.getHours() * 60.0 + start.getMinutes()) / 1440.0
      startAngle = (startAngle + 0.25) % 1
      let endAngle = (end.getHours() * 60.0 + end.getMinutes()) / 1440.0
      endAngle = (endAngle + 0.25) % 1
      ctx.moveTo(centerX, centerY)
      const x = centerX + r * Math.cos(2.0 * Math.PI * startAngle)
      const y = centerY + r * Math.sin(2.0 * Math.PI * startAngle)
      ctx.lineTo(x, y)
      ctx.arc(centerX, centerY, r, startAngle * 2.0 * Math.PI, endAngle * 2.0 * Math.PI)
      ctx.lineTo(centerX, centerY)
      ctx.fill()
      ctx.closePath()
    },
    drawSunMoonInfo (moonRise, moonSet, soct, sunRise, sunSet, eoct) {
      const r = (this.size / 2) * 0.7
      this.drawWedge(soct, sunRise, r, 'rgba(125, 206, 250, 0.6)')
      this.drawWedge(sunRise, sunSet, r, 'rgba(125, 206, 250)')
      this.drawWedge(sunSet, eoct, r, 'rgba(125, 206, 250, 0.6)')
      this.drawWedge(moonRise, moonSet, (this.size / 4), 'rgba(255, 255, 150, 0.75)')
    },
    // Using 'today' for date uses UTC.  This retruns the string for today,
    // in a format like: '12/16/2017'.
    // Uses date supplied, or current date.
    getDateString (date) {
      const now = date || new Date()
      return (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear()
    },
    getSiderialTime (cb) {
      const request = new XMLHttpRequest()
      request.timeout = 5000 // 5 second timeout
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            const response = JSON.parse(request.response)
            const results = response.properties.data[0]
            const sid = results.last
            const parts = sid.split('.')
            const time = parts[0]
            const tparts = time.split(':')
            const date = new Date(results.year, results.month - 1, results.day, tparts[0], tparts[1], tparts[2])
            cb(date)
          }
        }
      }
      request.open('GET', this.getSiderealTimeUrl())
      request.send()
    },
    // API Sun/Moon data always refers to today, and time is
    // (unfortunately) expressed in strings like "7:16 a.m. ST".
    // Supply a date object for today so we don't have to create
    // Date objects over ands over, and a string to convert.
    // Return a Date object for the string.
    getDateFromSunMoonData (today, data) {
      const parts = data.split(/[: ]/)
      let hours = parseInt(parts[0], 10)
      const minutes = parseInt(parts[1], 10)
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
      const request = new XMLHttpRequest()
      request.timeout = 5000 // 5 second timeout
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            const response = JSON.parse(request.response)
            const results = []
            // The elements of sundata and moondata are not necessarily in any order
            if (typeof response.moondata !== 'undefined') {
              for (const dat of response.moondata) {
                switch (dat.phen) {
                  case 'R': results[0] = this.getDateFromSunMoonData(now, dat.time)
                    break
                  case 'U': results[1] = this.getDateFromSunMoonData(now, dat.time)
                    break
                  case 'S': results[2] = this.getDateFromSunMoonData(now, dat.time)
                    break
                  default:
                    console.log(`Error in case statement: ${dat.phen} is not in: BC, R, U, S, EC.`)
                    break
                }
              }
            }
            if (typeof response.nextmoondata !== 'undefined') {
              for (const dat of response.nextmoondata) {
                switch (dat.phen) {
                  case 'R':
                    if (typeof results[0] === 'undefined') {
                      results[0] = this.getDateFromSunMoonData(now, dat.time)
                    }
                    break
                  case 'U':
                    if (typeof results[1] === 'undefined') {
                      results[1] = this.getDateFromSunMoonData(now, dat.time)
                    }
                    break
                  case 'S':
                    if (typeof results[2] === 'undefined') {
                      results[2] = this.getDateFromSunMoonData(now, dat.time)
                    }
                    break
                  default:
                    console.log(`Error in case statement: ${dat.phen} is not in: BC, R, U, S, EC.`)
                    break
                }
              }
            }
            if (typeof response.prevmoondata !== 'undefined') {
              for (const dat of response.prevmoondata) {
                switch (dat.phen) {
                  case 'R':
                    if (typeof results[0] === 'undefined') {
                      results[0] = this.getDateFromSunMoonData(now, dat.time)
                    }
                    break
                  case 'U':
                    if (typeof results[1] === 'undefined') {
                      results[1] = this.getDateFromSunMoonData(now, dat.time)
                    }
                    break
                  case 'S':
                    if (typeof results[2] === 'undefined') {
                      results[2] = this.getDateFromSunMoonData(now, dat.time)
                    }
                    break
                  default:
                    console.log(`Error in case statement: ${dat.phen} is not in: BC, R, U, S, EC.`)
                    break
                }
              }
            }
            if (typeof response.sundata !== 'undefined') {
              for (const dat of response.sundata) {
                switch (dat.phen) {
                  case 'BC': results[3] = this.getDateFromSunMoonData(now, dat.time)
                    break
                  case 'R': results[4] = this.getDateFromSunMoonData(now, dat.time)
                    break
                  case 'U': results[5] = this.getDateFromSunMoonData(now, dat.time)
                    break
                  case 'S': results[6] = this.getDateFromSunMoonData(now, dat.time)
                    break
                  case 'EC': results[7] = this.getDateFromSunMoonData(now, dat.time)
                    break
                  default:
                    console.log(`Error in case satement: ${dat.phen} is not in: BC, R, U, S, EC.`)
                    break
                }
              }
            }
            cb(results)
          }
        }
      }
      request.open('GET', this.getSunMoonDataUrl())
      request.send()
    },
    updateFace () {
      const now = new Date()
      // Redraw the face if the day has changed
      if (now.toDateString() !== this.lastFaceUpdate.toDateString()) {
        this.lastFaceUpdate = now
        this.clearClockFace()
        this.drawLines('#444')
        this.getSunMoonData(now, data => {
          this.drawSunMoonInfo(data[0], data[2], data[3], data[4], data[6], data[7])
          this.drawLines('#444')
          this.drawClockFace('#fff')
        })
      }
    },
    updateTod () {
      const now = new Date()
      // Redraw the time of day if more than 5 minutes has passed
      if (now - this.lastTodUpdate > 300000) {
        this.lastTodUpdate = now
        this.drawTime(this.tod, now, 'rgb(255, 100, 100', 3)
      }
    },
    updateSid () {
      const now = new Date()
      // Redraw the time of day if more than 5 minutes has passed
      if (now - this.lastSidUpdate > 300000) {
        this.lastSidUpdate = now
        this.getSiderialTime(sidTime => {
          this.drawTime(this.sid, sidTime, 'rgb(0, 255, 255)', 1)
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import "./_globals.scss";

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
