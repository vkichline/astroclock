<script>
// Mixin to provide location, time, and query strings for Naval Observatory queries
export default {
  data () {
    // Determine the timezone
    let d = new Date()
    let diff = `-${d.getTimezoneOffset() / 60}`
    return {
      // Altitude, lat and long for my house.
      latitude: '47.725',
      longitude: '-122.180053',
      altitude: '93',
      tz: diff,
      woeid: '2433074'  // Kirkland, WA (for Yahoo weather API)
    }
  },
  methods: {
    getCoords () {
      return `coords=${this.latitude},${this.longitude}`
    },
    getHeight () {
      return `height=${this.altitude}`
    },
    getTimeZone () {
      return `tz=${this.tz}`
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
      return `https://query.yahooapis.com/v1/public/yql?format=json&q=select%20*%20from%20weather.forecast%20where%20woeid=${this.woeid}`
    }
  }
}
</script>