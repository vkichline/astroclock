<script>
import {clockLocation} from '../main.js'

// Mixin to provide location, time, and query strings for Naval Observatory queries
export default {
  methods: {
    getCoords () {
      return `coords=${clockLocation.latitude},${clockLocation.longitude}`
    },
    getHeight () {
      return `height=${clockLocation.altitude}`
    },
    getTimeZone () {
      return `tz=${clockLocation.tz}`
    },
    getUtcTime () {
      const now = new Date()
      const hours = now.getUTCHours()
      const minutes = now.getUTCMinutes()
      return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`
    },
    // Using 'today' for date uses UTC.  This retruns the string for today,
    // in a format like: '12/16/2017'.
    // Uses date supplied, or current date.
    getDateString (date) {
      const now = date || new Date()
      return (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear()
    },
    // Astronomy API
    getEarthPictUrl () {
      return `http://api.usno.navy.mil/imagery/earth.png?ID=KICHLINE&date=today&time=${this.getUtcTime()}`
    },
    getMoonPhaseImageUrl () {
      return `http://api.usno.navy.mil/imagery/moon.png?ID=KICHLINE&date=today&time=${this.getUtcTime()}`
    },
    getSiderealTimeUrl () {
      return `http://api.usno.navy.mil/sidtime?ID=KICHLINE&date=${this.getDateString()}&time=now&${this.getCoords()}&${this.getHeight()}`
    },
    getSunMoonDataUrl () {
      return `http://api.usno.navy.mil/rstt/oneday?ID=KICHLINE&date=${this.getDateString()}&${this.getTimeZone()}&${this.getCoords()}`
    },
    getWeatherUrl () {
      return `https://query.yahooapis.com/v1/public/yql?format=json&q=select%20*%20from%20weather.forecast%20where%20woeid=${clockLocation.woeid}`
    }
  }
}
</script>