<template>
  <div>
    <div class="weather-status">
      <div class="temperature">{{ temp }}&deg;</div>
      <div v-bind:class="icon"></div>
    </div>
    <div id="todays-forecast">{{ todaysForecast }}</div>
    <div class="forecasts">
      <Forecast :fcdata="dailyForecasts[0]"/>
      <Forecast :fcdata="dailyForecasts[1]"/>
      <Forecast :fcdata="dailyForecasts[2]"/>
      <Forecast :fcdata="dailyForecasts[3]"/>
      <Forecast :fcdata="dailyForecasts[4]"/>
    </div>
  </div>
</template>

<script>
import Forecast from './Forecast'
import QueryHelper from './QueryHelper'

const https = require('https')
const timerDelay = 1000 * 60 * 60 // Refresh weather status every hour

// This component diplays the current temperature and weather conditions, plus the forecast for the next 5 days.
// Data is downloaded from the NWS weather API.
//
export default {
  name: 'WeatherStatus',
  mixins: [QueryHelper],
  components: {
    Forecast
  },
  verbose: false,
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
    // Options represents the service to call, cb is a callback function taking one parameter; the JSON object
    getForecast (cb) {
      https
        .get(this.getWeatherOptions(), resp => {
          let data = ''
          // A chunk of data has been recieved.
          resp.on('data', chunk => {
            if (this.verbose) console.log('Data: ', chunk.length)
            data += chunk
          })
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            if (this.verbose) console.log('End: ', data.length)
            let json = JSON.parse(data)
            cb(json)
          })
        })
        .on('error', err => {
          console.error('Error: ' + err.message)
        })
    },
    refreshForecast () {
      this.getForecast(data => {
        let current = data.currentobservation
        this.temp = current.Temp
        // Should we skip one? forecasts have day and noght parts for each day.
        this.todaysForecast =
          'Humidity ' + current.Relh +
          '%, Barometer ' + current.SLP +
          ' inHg, '
        this.todaysForecast += ('Wind speed ' + current.Winds + ' mph')
        if (current.windDirection) {
          this.todaysForecast += ' from ' + current.Windd
        }
        // startValidTime[0] will be today's date in the evening.
        // startValidTime[1] will also be if it's before evening.

        const arr = [{}, {}, {}, {}, {}]
        let curDate = new Date()
        let date2 = new Date(data.time.startValidTime[1])
        let offset = curDate.getDay() === date2.getDay() ? 2 : 1
        for (let i = 0, pos = offset; i < 5; pos += 2, i++) {
          let dayTemp = data.data.temperature[pos]
          let nightTemp = data.data.temperature[pos + 1]
          arr[i].day = data.time.startPeriodName[pos]
          arr[i].low = (dayTemp < nightTemp) ? dayTemp : nightTemp
          arr[i].high = (dayTemp > nightTemp) ? dayTemp : nightTemp
          arr[i].text = data.data.weather[pos]
          // NOTE: the NWS icons don't seem to work well with this design.  Eliminating.
          // the URL ends with 'size=medium'. If found, replace it with 'size=large'
          // let iconUrl = data.data.iconLink[pos]
          // iconUrl = iconUrl.replace('size=medium', 'size=large')
          // arr[i].icon = iconUrl
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
  font-size: 75%;
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
