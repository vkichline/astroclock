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
import QueryHelper from './QueryHelper'

const timerDelay = 1000 * 60 * 60 // Refresh weather status every hour

// This component diplays the current temperature and weather conditions, plus the forecast for the next 5 days.
// Data is downloaded from the NWS weather API.
//
export default {
  name: 'WeatherStatus',
  mixins: [
    QueryHelper
  ],
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
    getForecast (cb) {
      const request = new XMLHttpRequest()
      request.timeout = 5000  // 5 seconds
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            const response = JSON.parse(request.response)
            const results = response.properties
            cb(results)
          }
        }
      }
      request.open('GET', this.getWeatherUrl())
      request.send()
    },
    refreshForecast () {
      this.getForecast(data => {
        let current = data.periods[0]
        this.icon = current.icon
        this.temp = current.temperature
        // Should we skip one? forecasts have day and noght parts for each day.
        this.todaysForecast = current.detailedForecast
        const arr = [{}, {}, {}, {}, {}]
        let offset = current.isDayTime ? 1 : 2
        for (let i = 0, pos = offset; i < 5; pos += 2, i++) {
          let dayTemp = data.periods[pos].temperature
          let nightTemp = data.periods[pos + 1].temperature
          arr[i].day = data.periods[pos].name
          arr[i].low = (dayTemp < nightTemp) ? dayTemp : nightTemp
          arr[i].high = (dayTemp > nightTemp) ? dayTemp : nightTemp
          arr[i].icon = data.periods[pos].icon
          arr[i].text = data.periods[pos].shortForecast
        }
        this.dailyForecasts = arr
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./_globals.scss";

#todays-forecast {
  font-family: sans-serif;
  font-size: 50%;
  width: 80%;
  color: $fgcolor;
  text-shadow: 2px 2px 4px #000000;
  padding-top: 0.25em;
  margin-left: auto;
  margin-right: auto;
  padding-top: 0;
}

.weather-status {
  font-family: sans-serif;
  color: $fgcolor;
  font-size: 300%;
  text-shadow: 2px 2px 4px #000000;
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
  margin-top: 1em;
  width: 20em;
}
</style>
