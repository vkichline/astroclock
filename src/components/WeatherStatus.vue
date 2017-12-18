<template>
  <div>
    <div class="weather-status">
      <div class="temperature">{{ temp }}&deg;</div>
      <div v-bind:class="icon"></div>
    </div>
    <div id="todays-forecast">{{ todaysForecast }}</div>
    <div class="forecasts">
      <Forecast :day="dailyForecasts[0].day" :low="dailyForecasts[0].low" :high="dailyForecasts[0].high" :icon="dailyForecasts[0].icon" :text="dailyForecasts[0].text" />
      <Forecast :day="dailyForecasts[1].day" :low="dailyForecasts[1].low" :high="dailyForecasts[1].high" :icon="dailyForecasts[1].icon" :text="dailyForecasts[1].text" />
      <Forecast :day="dailyForecasts[2].day" :low="dailyForecasts[2].low" :high="dailyForecasts[2].high" :icon="dailyForecasts[2].icon" :text="dailyForecasts[2].text" />
      <Forecast :day="dailyForecasts[3].day" :low="dailyForecasts[3].low" :high="dailyForecasts[3].high" :icon="dailyForecasts[3].icon" :text="dailyForecasts[3].text" />
      <Forecast :day="dailyForecasts[4].day" :low="dailyForecasts[4].low" :high="dailyForecasts[4].high" :icon="dailyForecasts[4].icon" :text="dailyForecasts[4].text" />
    </div>
  </div>
</template>

<script>
import Forecast from './Forecast'
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
      dailyForecasts: []
    }
  },
  mounted () {
    this.timer = setInterval(this.refreshForecast, 1000 * 60 * 60)
    this.refreshForecast()
    for (let i = 0; i < 5; i++) {
      let day = {day: '?', low: '?', high: '?', icon: 'icon', text: '?'}
      this.dailyForecasts[i] = day
    }
  },
  beforeDestroy () {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  },
  methods: {
    getForecast: function (cb) {
      let statement = 'select * from weather.forecast where woeid=' + '2433074'
      let url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement

      let request = new XMLHttpRequest()
      request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            let response = JSON.parse(request.response)
            let results = response.query.results
            cb(results)
          }
        } else {
          // Return the initial weather forecast since no data is available.
        }
      }
      request.open('GET', url)
      request.send()
    },
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
    refreshForecast: function () {
      let that = this
      this.getForecast(function (data) {
        that.icon = 'icon ' + that.getIconClass(data.channel.item.condition.code)
        that.temp = data.channel.item.condition.temp
        let forecast = data.channel.item.forecast[0].text + '; '
        forecast += 'Low ' + data.channel.item.forecast[0].low + '°, '
        forecast += 'High ' + data.channel.item.forecast[0].high + '°.'
        that.todaysForecast = forecast
        for (let i = 0; i < 5; i++) {
          that.dailyForecasts[i].day = data.channel.item.forecast[i + 1].day
          that.dailyForecasts[i].low = data.channel.item.forecast[i + 1].low
          that.dailyForecasts[i].high = data.channel.item.forecast[i + 1].high
          that.dailyForecasts[i].icon = 'icon ' + that.getIconClass(data.channel.item.forecast[i + 1].code)
          that.dailyForecasts[i].text = data.channel.item.forecast[i + 1].text
        }
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
  width: 20em;
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
