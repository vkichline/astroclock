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
    getUtcDateTime () {
      const now = new Date()
      var str = now.toISOString()
      str.replace('-', '')
      return str.substr(0, 13)
    },
    // Using 'today' for date uses UTC.  This retruns the string for today,
    // in a format like: '12/16/2017'.
    // Uses date supplied, or current date.
    getDateString (date) {
      const now = date || new Date()
      return (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear()
    },
    // Astronomy API
    // getEarthPictUrl () {
    //   return `http://api.usno.navy.mil/imagery/earth.png?ID=KICHLINE&date=today&time=${this.getUtcTime()}`
    // },
    getEarthPictUrl () {
      return `https://www.timeanddate.com/scripts/sunmap.php?iso=${this.getUtcTime()}&earth=1`
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
    getWeatherOptions () {
      return {
        hostname: 'forecast.weather.gov',
        path: '/MapClick.php?&lat=47.71&lon=-122.21&zip=98034&FcstType=json'// ,
        // headers: { 'user-agent': 'AstroClock. Contact vkichline@hotmail.com' }
      }
    }
  }
}
</script>