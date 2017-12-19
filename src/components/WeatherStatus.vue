<template>
  <div>
    <div class="weather-status">
      <div class="temperature">{{ temp }}&deg;</div>
      <div v-bind:class="icon"></div>
    </div>
    <div id="todays-forecast">{{ todaysForecast }}</div>
    <div class="forecasts">
      <Forecast :fcdata="dailyForecasts[0]" />
      <Forecast :fcdata="dailyForecasts[1]" />
      <Forecast :fcdata="dailyForecasts[2]" />
      <Forecast :fcdata="dailyForecasts[3]" />
      <Forecast :fcdata="dailyForecasts[4]" />
    </div>
  </div>
</template>

<script>

import Forecast from './Forecast'

const timerDelay = 1000 * 60 * 60 // Refresh weather status every hour

// This component diplays the current temperature and weather conditions, plus the forecast for the next 5 days.
// Data is downloaded from the Yahoo weather API.  Icons are displayed by translating a code into an
// appropriate clase name, and the background image of a div is set to that class.  CSS has class defs with
// base64-encoded icons.  (Works best when served directly from file system.)
//
export default {
  name: 'WeatherStatus',
  components: {
    Forecast
  },
  data () {
    return {
      timer: null,
      temp: '?',
      icon: '',
      todaysForecast: '',
      dailyForecasts: [{}, {}, {}, {}, {}]
    }
  },
  mounted () {
    this.timer = setInterval(this.refreshForecast, timerDelay)
    this.refreshForecast()
  },
  beforeDestroy () {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  },
  methods: {
    getForecast: function (cb) {
      const statement = 'select * from weather.forecast where woeid=' + '2433074'
      const url = `https://query.yahooapis.com/v1/public/yql?format=json&q=${statement}`

      const request = new XMLHttpRequest()
      request.timeout = 5000  // 5 seconds
      request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            const response = JSON.parse(request.response)
            const results = response.query.results
            cb(results)
          }
        }
      }
      request.open('GET', url)
      request.send()
    },
    // There are many more weather conditions reported than we have icons for.
    // This function collapses the codes into a few reasonable icon classes.
    getIconClass: function (weatherCode) {
    // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
      weatherCode = parseInt(weatherCode)
      switch (weatherCode) {
        case 25: // cold
        case 32: // sunny
        case 33: // fair (night)
        case 34: // fair (day)
        case 36: // hot
        case 3200: // not available
          return 'clear-day'
        case 0: // tornado
        case 1: // tropical storm
        case 2: // hurricane
        case 6: // mixed rain and sleet
        case 8: // freezing drizzle
        case 9: // drizzle
        case 10: // freezing rain
        case 11: // showers
        case 12: // showers
        case 17: // hail
        case 35: // mixed rain and hail
        case 39: // scattered showers
        case 40: // scattered showers
          return 'rain'
        case 3: // severe thunderstorms
        case 4: // thunderstorms
        case 37: // isolated thunderstorms
        case 38: // scattered thunderstorms
        case 45: // thundershowers
        case 47: // isolated thundershowers
          return 'thunderstorms'
        case 5: // mixed rain and snow
        case 7: // mixed snow and sleet
        case 13: // snow flurries
        case 14: // light snow showers
        case 16: // snow
        case 18: // sleet
        case 41: // heavy snow
        case 42: // scattered snow showers
        case 43: // heavy snow
        case 46: // snow showers
          return 'snow'
        case 15: // blowing snow
        case 19: // dust
        case 20: // foggy
        case 21: // haze
        case 22: // smoky
          return 'fog'
        case 24: // windy
        case 23: // blustery
          return 'windy'
        case 26: // cloudy
        case 27: // mostly cloudy (night)
        case 28: // mostly cloudy (day)
        case 31: // clear (night)
          return 'cloudy'
        case 29: // partly cloudy (night)
        case 30: // partly cloudy (day)
        case 44: // partly cloudy
          return 'partly-cloudy-day'
      }
    },
    angleToDirection: function (angle) {
      const direction = ['North', 'NNE', 'NE', 'ENE', 'East', 'ESE', 'SE',
        'SSE', 'South', 'SSW', 'SW', 'WSW', 'West', 'WNW', 'NW', 'NNW']
      const count = direction.length
      angle = (angle - (360 / count / 2) + 360) % 360 // set back half a division
      const index = Math.ceil(angle / (360 / count)) % 16
      return direction[index]
    },
    refreshForecast: function () {
      const that = this
      this.getForecast(function (data) {
        that.icon = 'icon ' + that.getIconClass(data.channel.item.condition.code)
        that.temp = data.channel.item.condition.temp
        const fc = data.channel.item.forecast[0]
        const windSpeed = Math.round(data.channel.wind.speed / 1.60934)
        const forecast = `${fc.text}, Wind from ${that.angleToDirection(data.channel.wind.direction)} at ${windSpeed} mph. Low ${fc.low}°, High ${fc.high}°.`
        that.todaysForecast = forecast
        let arr = [{}, {}, {}, {}, {}]
        for (let i = 0; i < 5; i++) {
          arr[i].day = data.channel.item.forecast[i + 1].day
          arr[i].low = data.channel.item.forecast[i + 1].low
          arr[i].high = data.channel.item.forecast[i + 1].high
          arr[i].icon = `icon ${that.getIconClass(data.channel.item.forecast[i + 1].code)}`
          arr[i].text = data.channel.item.forecast[i + 1].text
        }
        that.dailyForecasts = arr
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./_globals.scss";
@import "./_icons.scss";

#todays-forecast {
  font-family: sans-serif;
  font-size: 50%;
  color: $fgcolor;
  padding-top: 0.25em;
  margin-left: auto;
  margin-right: auto;
  padding-top: 0;
}

.weather-status {
  font-family: sans-serif;
  color: $fgcolor;
  font-size: 300%;
  padding-top: 0.25em;
  width: 3.5em;
  height: 1.2em;
  margin-left: auto;
  margin-right: auto;
}

.weather-status .temperature {
  display: inline-block;
  vertical-align: top;
}

.weather-status .icon {
  display: inline-block;
  height: 1.15em;
  width: 1.15em;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.forecasts {
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.3em;
  width: 20em;
}
</style>
