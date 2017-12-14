<template>
  <div class="weather-status">
    <div class="temperature">{{ temp }}&deg;</div>
    <div v-bind:class="fcast"></div>
  </div>
</template>

<script>
export default {
  name: 'WeatherStatus',
  data () {
    return {
      timer: null,
      temp: '?',
      fcast: ''
    }
  },
  mounted () {
    this.timer = setInterval(this.refreshForecast, 1000 * 60 * 60)
    this.refreshForecast()
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
        console.log('xyzzy')
        that.fcast = 'forecast ' + that.getIconClass(data.channel.item.condition.code)
        that.temp = data.channel.item.condition.temp
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../_globals.scss";

.weather-status {
  font-family: sans-serif;
  color: $fgcolor;
  font-size: 300%;
  margin-top: .5em;
  opacity: 0.75;
}

.weather-status .temperature {
  display: inline-block;
  vertical-align: top;
}

.weather-status .forecast {
  display: inline-block;
  height: 1.15em;
  width: 1.15em;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.clear-day {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAM1BMVEUAAAD/4Wj/4Wj/4Wj/4Wj/4Wj/4Wj/4Wj/4Wj/4Wj/4Wj/4Wj/4Wj/4Wj/4Wj/4Wj/4Wj8M8+PAAAAEHRSTlMAECAwQFBgcICQoLDA0ODwVOCoyAAAA1NJREFUeNrt3Wei4yAMBGBRQsCRYe5/2v27vbkx9nw3QA/0CAbJRERERERERERERERERERERPaXX7W6O77h7rW+st1bKs0Hfmt4LcnuKFfHX/Oa7U7S2/HP/J3sFlLr+E+9JSMXW8cmvUWjFcqKHawlGKO4DOxkLNHY5A929cnGJDt255ls+AQhIBg+XwjigkPNng7rwMFGtXnljhP0bHMKDSdpgeDP/7hJ0HCqZnNJK062JptIGTjdKATT/xnLIDgu4sEmkDou05NdLg1caCS7WMHFysPHDxTe8fNHYMEUFs7x80egYBrl4eMHCtv4+SOQMJnEtP/j3xOGjun0YOdxTMhZfv/znw8UTKpQJED+RLhiWitBAqBPAxlTywQ7AO7dQMPkGsECYF4EHdPrdqAKAtUOEwcIjGhHWUBhIciAnHnQQcIJJgDjFHDQcIIJwDcFHEScYAKwTYEPqHxsZxFkIsEmkGk7GAbIjEBwEk50Rr6CzkqQAnnSYAOhRnASxnI2lkApEawAkjXQQakTrACONfAGqTfBSQDFqQBoERyFMByLVNCqBCmAIAmA2AS7AP6dQAGxMkEOpM+CDmJu2w0QG7YdqE2wD2TfC75A7WVbVVCrCsBWDmquAGykAICcArCVAsBMAVAAFICoGaAAKAAKgAKgACgA+jmsACgAOhRVAPRhRJ/G9HFUn8d1QUJXZHRJStfkdFFSV2V1WVrX5fVgQk9m9GhKz+b0cFJPZ/V4Ws/nVUBBJTRUREVldFRISaW0VExN5fRUUFElNVVUVWV1VVhZpbVVXF3l9dVgQS021GRFbXbUaEmtttRsTe321HBRLTfVdFVtd9V4Wa231Xxd7fdJ/hUUO10hGP9jIlDsEgvBIeAjIrDYZQr//OePQLFLFerx8+8JR7LLpY7L9GQTCI6LeLA5NFyi2TTKwOlGsYmkFSdbk82lkU3//eWO0/RsEwoNJ2nB5pQ72Z9/f3XgYKPa1OKCQy3RZpcdh/FsDLITDJ8vBJ6NSf5gV59sbOIysJOxRGMUyoodrCUYrdg6NuktGrnU+v+PPtktpLfjn/k72Z3k6vhrXrPdUSrVB35reC3J7i2/anV3fMPda31lExEREREREREREREREREREdndFz08GE33h0DlAAAAAElFTkSuQmCC");
}

.cloudy {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAM1BMVEUAAADZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnsRsJXAAAAEXRSTlMAQICgwOD/cDAgENDwkGCwUMRZWgMAAATaSURBVHja7MExAQAAAMIg+6c2w35gAAAAAAAAAAAAAAAA0cm7z0RHQSgKwJd2aBd0/6ud+pgSE1MAUb6/Uz10FJ6QShv8ZrSygubhrMYGbT1NIFiDu6INdG1e4TFWftbHLy4bQUh4Dku6ImHwtOhmLf5C0rX4iBfpQBfiGMWMzSAz3sCXSSADmDmBDEydgGO8jT2dnmd8IAY6uRDxEUUnl/ChTKfgc9IaiHqRgv4i8Cn2p1vis3LlVww+pk84y9cbDeCyjWDl+/9ljxpMoHEFhVuGflOoQp5tkJNVKwDA4WSDvN+oANfsBSK2LPRLQC2GCpfTOO8T0uPysqhG/Eo0L4xb2jo6hAAetgCDahQRrQvuMjZQfwabIv3iUA8Ha4bbTM/YlkoL6Ez5ISoAVvpFo7sUqJ8VdwT6BQcwgrpR2MYbXeQlKwHvLN4sjhE9deGw0wcqHITdsVu9svSBR+FMHUjsDAKM4+QjAxD0C46UZw+A3eQBgP3RAXgcK4ajAiibAQdLBwdAOJqYPQATJg8A6YgAOI0TADw1463BBpaBBgpAdfzgszx+gQH4rl/8qUB/w1WrgDPP7cVgBKHbMjjd5IQR2E7Pz4L+4ZLBEEzb59+ed4ccMQxHVa37XU2QjOJqbcDz7r9hGUPRVJPe23wRBqNp3gDyzgThSmtC8/j5ncGAbNsKkKmwGJKiapaHf7vCmDTVEnBjoS9BY1CGaskPtlxCxLAavg12G89/4QD0/f41YoYA7vcuClMG4Ok3iSkDkPSbwJQBmNIB8pwB5I3p0UwBlAqwYpoAeKsCBJ4nAL1VASTmCUBuHomZKIAVBW9PgcYXFylqdAKpVIAzWnL4dDXkSqs4KSXoDf6mC2SclhbvV4HSAjLOTIW3q4Ark8BT4/XNkZCbfQc2/oap+MH1aQHjf0yoMHkCBhfAnt7lAUxdB1ZcQ6Q3SVyEovcsuIqV3qJxFRzeXRzO3QhwIWL2APQ5AtBJih9WmfTxX9MFdBWto3+IZFCPGjsATp42OHXoR8XohWWgO4I88KTlGDs3fkEVy6gBGEE7VkYNg06EdGhwZfEmMeRUWPXbmpEjLobyzZ2NDACsUw4bCXTuBGTf588R/1jybQJRSfHTKhfTfFtgRWNq5yt8k/9JQGdPf3PW4BXDbYkt+1/hR0eFp1tCtwyATK+Tv/L9+YuIDQNQnVao6qNxwnKzAHKfDiB+OFK62CqA0GWXSmGHqnS39VjborK0/xrrGNUogNy+AoiXbozxVjN+MEv2r85ah9oXTS+NNJp+yhp/W8RLrUDTG1LrY+/y+Smj0/jfEl74GQdqpNeD8cXPMA2R3fkEwmKHHekNuX21k1nVbgep8ZijgaqAe/UkCu8PEQ4P8UgfSXDNeEsCqm4X0PJjaV1zmGX/VJwrvck2nAWpqnGSrtoCCt2uD9R1l1W5zQX+npstBCu3qNDovp21eQDtBxVFn0ijByD3/qMcaEioRNNJoZbpA/CzByDoXISVP80ZgFCMYr4AvAYwcQCZMXUAGZg6gIxmjLaeRufQlh49gojW7KwNoFA0MI0OJA3Lows3awsYf2mc0IeYtAso1OwBmNkDAA1qmT0AOXsAYvYAiNFFpG/twYEAAAAAgCB/60GuAAAAAAAAAAAAAAAAAAAAgI0AjwXkaAX8NXAAAAAASUVORK5CYII=");
}

.fog {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAM1BMVEUAAADZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnsRsJXAAAAEHRSTlMAECAwQFBgcICQoLDA0ODwVOCoyAAADBFJREFUeNrswQEBAAAEAzDQP7Mg31YAAAAAAAAAABCp7+7ZMa8lAUEYilJDC4T//9ntxcyqAXHfPK/OmeFeSxBzyTTuDXtddVfX+4ZWd5H6BzX5Kc2n2r9oeU61CX/UAlNJTEDqn1AJRt1A7D+0OLoYHakzKA8vBlrnTKjYOejUMsRyhCEnUP/LWHu+7ah5SHW4o6JVa7jOQSMqBvsuTV6LLvsq+ZlHlRPVEvbPWpxUGfUjQFBt6/1iDI2HatFqhTYZAzpjJoalEzWfqqaeqHWpAT93I6Gfkifzr6vrDbgy0QB0gSyGWFflBuZxobIGRvLX4NQbNiBTR0K09KlCGWlAb9dGyb+nNT4Tb2AZt/0aWHFkNHcwoEDMT6B+MIU1IOWnzbDV8eYGdO4/kBVCZMUIQgOWDr/asLkUhfzVHk6Vqm4AThuwdBIS+MXx6vjFcJof9cnFom9uwAsRpXrk/PJlHjELj8ctDRwO9Si95u5wbxuk19zS0VbUk/CQ68o+S6vwxTbY/4MBoTz+sfLI8sufyGh2P65VyyMiW7VM7huoRHAQCw3Na+hb8E31MY+plrganIu5jYx63kCvKTpnFhu4vNmD/1OrntkmpX9sIJ+psKDSRH6ObTc3EC//7iiYyc+xNJufvwUcrSSm7wbfw83HCKJaxerGzxmcWoGvhY+o6bWMjyidpNOS8UMqqxZgc49PxYunXhTHVIdXz8uUyWytah3gTwHCuOoLU2vQw6rjc7NFM6ya1Nix1joGImLrDTGCnlO1j4j1XU1g1BwuljeVEHOwk6oNGbG3Mug9PDw8PDw8WLj4C21e2zvTbclBFQoHNQYNat7/aW9Xz6x7ioSd1B39/laz+sAZEthbTIk5pYhp/BuvaGjmjHgL7Hf34VPqKf81JZEtoKGNXaVfa/8TWh4pQkGU+lD/SaFMqLXgkOuh3WhPQOhQFFocXRvQtPAwukzAWnB7EJr8In/slsgPibxjA9ps9T2DiYYy6h76MG4tqNCEAtcDcH/AdhhU3FrQCLYWjGiFAjMsxmfGFbcWNILyv1+BUEUu/wzwoREZRgXM/JsMowJm/l06VAH72ez2B+wr/Zh91CsVWFXdfk5JUvk7NblkLdh+JBu3v4swaAEwzF/5NH8Jb0T+cppES4sW+e3i0Xgzlt7Gw8qoFvnt/DeXdKwFYPMjjz4ePqkNZ9+nWh13fRq0Au7Rx6l+sgLGz0f0ifyrkb9pczj/+ajKPvJsBXZ69yKWXSI/FR1qV6AlVXUz/xe7qVvhFdBKfeChkjj/Y11+hZKSWMpJqBb5VWi9oAvK+mQFXrTKzLVde0tY/zm0yAH4A/rO35AD8AcMYeZ4swI2+Y4/APZCNvJow0Kfq0D+kD8g4v4Aan49Ga5Ahvu9gx1dtm/WQPKwPyANuOuIDbYWkHhKpykufwAs8u8Ei/wSHCI/MPRJXQeFBUIr9eDsLgpsLQgVthYQG32VAlPqR03XQ2Mdum1cEJH/Rcvk6Ggb0B6bpK3Ii7Ilb2jc+EcoJ8CWsL9CK6+0uG0JVURKWCaTyWQymVxiZeacCBDqM39jQ7wFP0IZCY0rv1jjAmD1ks31+hBL+/sYYHTtAPgrdNQVlC+0owGnIkp9kgNV6kOFQ6mOQzOYHvYH7AT3ihJha0FPsLVgbMs9kl/kX4dxIgAcepQFnhYILXcI7ukDo+q4OWoS8orY2tOBI8406mEg9CF/wPov9QdUO380jXwv9GMVoE1EjApY+cs3hk7DTMIOpYtLHpqIdKMCEFEp9fVC/qPEn6GsQq/k/+vhH7Z+oQJxKPGHlheU5YkKuNQ/fQiYXCK/thYYIv91a8GS+u0KOER+ncTIhojrsRboQfp+Zi3QFaL9pkfEJ/Jno94qjWrL7h51XH9NbP1O9vhwBcqiqSp/28hAhvXEtwQgDSPU+KoAbJE/yNn/FN79qtLu8QeM9d2bcz39u8zLfdLxlVIf1eMvXvpj/eXjJV8R+bNyJXieTH2jh/0BQypXGVofvfhOJZWL9Guh1HXoziz94ruJbs2aMOd/lz8gjo+FVpc63v5d/oA48NBm5u9sz+Upddy7ay522FpARgWKe+dDePL0vMeJRgI3LFRha8GyPe0PKPjuwm3A50nWAVsLYnP8BIBKfQ1wqCSHyA9ODHPH/gbYSj12uou2doAzY8o76kpY/iyYa2F5hJCYq1Rkfk+JubxC1wDYErjIzpwjcgaSpV58HZpMJpPJZEJbFfyZK8xbgjT+XQpvfltCWH+9m6hQnNAhpV6v9d0zbEGVTE+8neII+t6tGQxbCwYTbEKu95ueS/2uJjZY5A9iHbzHO1Sc5Bf5N3tsAYm8O8HWghYf9gdUfOOmEGgtOO/fMjalet4fQDsu8ldE4sbnlBrXmSv7X6MVqA6RH5hU42RmafAMfm8XK6Dz71J4F6MCmFaBE7aOqjCUr4j8/OWR1FU9hd+EZkCtQmBUh9ODUDlNopAS+U/9Ae8GpLF9UBmtLiVWq+Nn1gJbG/bo4/WTFfBp8Vod911cUK0KJMCzAAC4MRwif9Ffpqe0+UBdK/cr0F1+HC3yZ9+v6v6mqQjnviV2qC9u26BkjyOL2lcH/tZ6OP0B/dduuqRCN4dz7UHjZLc8eeeh7VDkiy9YQ255FwFdAN3ahPsD7AoA7tUnzbNA/qA/wK4A7l+WBeK+M5sa3LTRjr/rM+oPeN6bTxVv2xnvd9fh8AfAIv/Y4MWPB+PGjIqcYjFiUKV+MMEifw3QsBE/x1QXA0ip953Qyvvf3dFGwN5Y4CRbKA12iT1/Ri+mH6EJsSVsfOss47pMJpPJZDK5RCi3dvbIzjl4Q9OPUOEc8d1GRijW+rVMoBf0aJujBnqFcS/hie1WOAK87hMPR8uiyR0W+VM3TMgoAdvchvaKscEiP4khrOMkv8hf8HvwN1tUxXcc4pB36EGC34Fe8QPg+WPacAX2d4JpVDy0fNAfIMAGVyiNejfUrgBOZGYZ6A5f3lXooGtJ/Ajt1yrAKrQVY9cxjFbqm2uLc1KhdMFakOkrkX9Ex5XWxrZrlG04/AEjLy6RX1sLHMqhzr869p37iQ3d5G6L/LaQT1WH4hvvAfBd/q5Pdf4edVzr38lRnfsVaGR85Pr5oP26P2Ck93//omM1BYAt8ueh8j8LZXKt+qhvHESpgfee4AT8RhdqSqlPenWc/aSrXzR5IQt08w0GfqeProAObUaoaVgdt+4+quHf5A+gdifUJP93+AOo4aEqjbv3n/UFxk6jESzy9wjb0Mfq3vlws0eu+N1+jK/9ywO2FsQO+AOA2x1hkX/kBT5PwsjGA1rukvH7PXMzrAXOE0UDuwe1LAaIUt9LWsCds72uPtv6nxrAN+FWWh7ixh2/Ka2vUAJCY1p5g+9Cviw2TCaTyWQyiXs/ROoWvXFbFTkOkZ2TO7SIjKPJ7rb0hVxE+tFFtKMBJymlHrwQatS4LOAl+jUBd0mp3ZP36IBSH6qx8sxvLZAEO7j77RJEQOTfBizyr8Nos4Eu8/4gNLlFftpxkb/gK/LzYW0bxCFvGtRgkZ/ECF1ha8HNJRLFt8sgdljkp4ZL3NUMrQ9XoBN8LmxET/6aDOavKwC20KUD/oBWOKWtNF2BS6G98po2Fl2BS/mPnXPKvA+jAgixqgqcJ1GjeiqeVWD/8rlHPHToubVADe1uK6MukZ/auwFpbGe/QPXd3zvaPf4AVqHls9qw/bFP5NfSsXm23KOP5/HJCriuAdApWh+SbwkAm+WJn6xAfPv8a4tL5A+6rh4TCClrBbD14pYqxqRuETn7E1nfeHm2cfqE5TfvtvncWrA6lBt3BUZdX19NWOtQ+V/ZsfMjlFLpXn/Asf+YayfuV8SurG3r6YEK2DSCQ0eEX3WO7OgS9vTBCjS65Q9AK5B9fdJ6twKgPk4C5K8qAHV8+Wl/gBywI756SqfZjNK5vfRxuQXjjWcesLUgddhaEORhf0AU9E7JJeywtYAKPvDYhgpabpMEPp6T9kPTMnytQWdChq28oGilfvwqqGzBF/qnWxWOnlDKtf/pt9fFw1qa4Y+AoPSCoNgbofEVGtDpRqJlMplMJpPJZDKZTCaTyWQymUwmk8lkMplMJpPJZDKZ/D/yD2gkCxFsQLJcAAAAAElFTkSuQmCC");
}

.partly-cloudy-day {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAY1BMVEUAAADZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WjZ2dn/4WghTz3vAAAAH3RSTlMAEBAgIDAwQEBQUGBgcHCAgJCQoKCwsMDA0NDg4PDwFagsVAAABZhJREFUeNrs04GGxTAQRuERVWNcFRU1Kmre/ykXggVrd2/DTXO+N5hjfgEAAAAAAAAAAAAAAAAAAAAAALjBqjm71/imuu/ZVnk83coZPzjLpvJUa/b4Fc8qj2Plij+4yivNe31zmDzCkmv807UvMjot8RY3GZl5vK2+ZFRWo5kygXo0UyZYjriVqwwlx+1KkmFojQ4ukzGkPTo5kgxgrdHM+QQ5utqTfDhVtVzO6OVcZAjJSp13Bo2V6GKTYXyxd2fbjoJAFEBLMNHMg1HUBIv//8qeuaMdezVHyqv7MW+eVQIKKVNMBDeaewSVopmvitopJaCuc0+A9t0cEshO5s4/3c0pozfWXz6BVWH5DVtkM0ogM/wJk4ETqEiGpOQepcYmcCMJNpZ72Q15+RddE574ry7Y58QtxVbwEwV5tQuuS2Vf/9sE0ulOBXpXNPxTU+z0sPr3LtCb4Ep4WclvlBn9kvEgfiRUjykOA5npm+ITy4NYXzN7F16nCCm59Nd1wQOV9EfnJrYeShru0SQZD+bXhFc3rZtgZbnXveHBjJ8I3KRugsRyIL4EWgdww9V/KAV22yAniAsHYyFPBF5NCBl7Ae8Bta9ceHsCMBzQiV6o/cMF9pBeAGwAx0fAJVBySHfAi1JsCWgOi95TlewS2MEC8PaiS6DAB0DrTvCCuOGg8PsFNYXFANj9glR2APj9gitgEgApNeJteSe6Avr3C85Ch0HGugDelldTCoALCv+SREECwCdwFrYaXJ0Me2PcBaqT9GZo1/BYNr4E5MwD2vB4rA5dAjlgqxupDP22/DzGEyDiRVkq43lgw2Mzod+W0//QljlWCZwlDAKGx1cEfiI4jjMAAPYLBKwEGo4hC/tA0P7H+o+jOAWeCAGnvbBM4FFwPcIQCNkvyKNPAxyJDyDuWnAJIPkiAdQ0UWruAZAL4zH3ANwSANISwBLAEsASgBMunXkASwUsAWAtASwBPJxoD0KrnWj1LAPo6vMx/2m/l9YpCq86rglFfgDtXtHIcgclv8vieq6X7zks+S3FWgclv5fUzcXX7Sme45jz+/WY/3a+1p3/ff2hvYGx/Ispdpqg8njz+/pYf+ypqE93fud+gWYQdX5Xx0er+ps7eCab8mL4ltMwuuReZjXVtWCdBjrUcZrkIPDIaaDE8BONJohORNvcleWnbDaxlUCXU5jr93YEsB+hZ7Cf3/kXay47Pez68Qkoh1GrN1d/ufM7zUEPvn4vo/AqfLPczPCnitW/NjexmoLboq9/ZbhXof/xTF9D4WG7oiUX/ht7OPAA0PXANfz0/3L9qzsHtqLQUhfamv7YWQ7NyH8eOGJP7WfSh8EacP3gEnhgGmPuGEPLXg2e/ezPIBfRJdCpl+ZtIHcKbg8oAMMwWnAJ+ALYMc5OcAlcgTeAVwh+N5iO8a8lI/fVWAstAE/um6EjagTAB6C6kHdAM70AaBvwVJNmLIKowvW+OUwyANUFWwWVkwyAtsH+6nmfZgB0DTQGJjzRAFTr/g9NNIAwn43obv6kz2QDoDzMd8UZTIs7M3NLR+5dpkUdm2pzeovh7EFQAscof983iZCpoF1H6l9gVyISqFS0Bg42E5DArec7hePYRE/g7S54Ydmbx11wG3AIAMrCRsJBc0E94JAfWBNzNnyoAc0b0U4R14RrwBdcJC2L825ol5+CIzIEk7bD/tVYcFRZpM9M55Hr3ysJaNs9nQE2HJsmIFU9KQBtObYT0fhF0AI+4AM4L4BbFO39MRABNIHldW/ze8MC7Aju/QfFKkkFwAXR2BEcAUsAwFoIF0FKv1iWwNJItvW73v8Zy0CjSa/d61XQaUYBeNvq5TnIzCoAT+39LrDsAPB43gEsAWiWwdC39uBABgAAAGCQv/U9vgoAAAAAAAAAAAAAANgK5Lqmh0uZ3FkAAAAASUVORK5CYII=");
}

.rain {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAVFBMVEUAAADZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dlNv9lNv9lNv9lNv9lNv9lNv9lNv9lNv9lNv9lNv9lNv9nqkBmbAAAAHHRSTlMAQICgwOD/cDAgENDwkGCwUCAQYND/wDDwcKBAr7HphwAAA29JREFUeNrswYEAAAAAgKD9qRepAgAAAAAAZt8+0C0FgSAKt4QC2hbd/2oneCdn9HsINf8OPATzfxctzoeIlxh8WoRHTgE/EVIRApoifmlNKnMrHr9nvhAf/mnaBLrh75iTGS0Rf23NvMP/4mQuZcU/CioTyYYXzmVQDQ1smgIVAHOBClAXyIZmVmR4xXDBqjI4XXGJl8FtuKjK0BacWLcBjbgsTLAAaBdBwR2iyqg8buG4JwBgOsEEYNwFFHeJ8lmu2zDvExJus5xF6274UUhZHiniNl5Ejh2/FJPK42TcxzTF4R6mJ9xtsAQBb25TeRB0EJcB7gNZJkFCH2uZ5DJw+CepAb1YlScw9POIAuipsgewTB4AVmZ4GDL0GxVFZ5t0ht4W9gBRyQNgYw+Awh7AswdAYQ/g2QNApZuMJ0jSR94iHiFKB1pXPEaWt6bOcOJcA8nwKKHzLwH99f4lgOmeMEe8cG4CCY/kO7wHYdwFNeChYucvovvrcPx8AVZwB/DgDuDAHWABdwA18gA7uAMc4A6gRh7AgTtAAXkAj7Gsu1tmmQDt9qqT7ADt/CK3MAwr3JGgYmRe57gIbGeHXKMYnadaAfd/TOhBXiBiAlYuXQVRz4EDc1ivXgbSngt2zOKQJgGzMJUWBnAvAkxkYQ8Q2AMgt9wKzcSzB4CSLwFU9gA7ewA0XQhxXwoETMXx3gyd9ubbYdrHAgf7LljYA0hkD+DZA1T2AMoeQHb2AJU9gBj7U7EN5E+GC+aRpIXHNLJwTwGTNp79Daka7wvSUyJYAQxPxpw0K4YJFGl3TLUFcl4P2rv27Ro9oiAGgrBjZwOaR/e/p9kLSnqJ+qv/AK2sMr2/AQAAAACAKyrluXaqsHM9rcen0ax2dFOPX7347OjKHP/mYrOj67Gnu+zoljjQPHZ0dY4Dw2NHt8YRix3dFseqw46u54MWO3pxEoOdc4vzbRjs6NZImsOOXpykG+zoeiSbwc4lxVkNdi4pzlwNdi4pzvLyOxSQAlJACkgBKSAFpIAUkAJSQApIASkgBaSAFJACUkAKSAEpIAWkgBSQAlLAFslqsKMbkYtjsKOLZDHY0dVcHIOdiw5uFju6VByPHd1IxbHY0bVUHIsdHiN4jdGV9IxksHOaNtI72tPvAAAAAAAAAAAAAAAAAAAAfAAP/KFvgPAFAwAAAABJRU5ErkJggg==");
}

.snow {
    background-image: url("data:image/png;base64,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");
}

.thunderstorms {
    background-image: url("data:image/png;base64,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");
}

.windy {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAM1BMVEUAAADZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnsRsJXAAAAEXRSTlMAIECAUBAwwP+QYNBw4KDwsB6i++oAAAN6SURBVHja7d0Biq4gGIXhTys9WWr7X+0F4AKjzj8MjFCd8+wgKdN4MRMRERERERERERERERERERERERGReZxfltX7zTiFiP/inpyxSfjqOB3Z9fdiMhoOQzkZiYJvHN4oVHyrbPZ+AR9kb6/n8dFJdgf0ir0dfnBt9m4XfnAQTALcT8FOPwIFP0n2bmfFZzXYy63LUmJkmwh74TwwthgLVzBSndFwkexN0Dsx4IxIqOgUYx8Bxz4Ci1HxaGXjsqAVjEtGYzcuCY3D2G+Bjf0W8MZlQ2MxMrFbDJK/CSNbX+Dx1cHWFwQ06PoCNOj6AjTo+gI06PoCNNj6Ao8GW1+Q8FVk6wv2bgDI+oKMr3ayviCgcZL1BTsagasv2CoaZH3BgsbF1RcEtE6uvuBAy1H1BQWtSNUXJHQSU1+Q0KlMfUFBb+HpC8KBXt1Y+oJtwchJ0heEUjGSGfoCn/aMb/j79wW+ZEyz374v2C5MdNy+L9gOTFTd7fuCCzOF2/cFHjOl+/cFBROlB/QFGfOkJ/QFmKaGCX3BgwbgcBP6ggc9AvuEvuBBk2D2f31nPuo1WM+/fzQftBCqyzZhbnrMUjimOZPzMzZD1+lmPZl33w7HuJ9hal9AZmcfgL4vIDLuC4iM+wIe476AyLgvIDLuC4iM+wIe476ASUInkV9/NSJlRiRD1BeMMfUFY0R9wRhNX9B/4Hi+fcInric5JnzknOBOfcGFNwn2Wx5vkuzXCvn1Wya/fsNr1GAEA/D3fUEmWP8QTIJdX0DzGuz7ArKFUN8XsC2F+76AaTM07gsItsN/1BeIiIiIiIiIiNzx40qO5Qz2HFvEBLl4e4btwCQ52RNEzJNXu72EqaKzm7swV13t3jDdwj4AKOwDgMI+AFjIJsHeyvUa7FXHtRDqRbKlcG/l2gz1MtF2eCwZi5AuDGQj4i70vDFZK1rFyH/Lmo3LSv9T0ov9iAyHRjHyWyAamUQ+C1pAw9igoQEgs7EPgGcfAJ0WRz4AifzX3FtGYyXfC2EjPyvrMCLuQOc0GqFgYDMC4VyWK2Ok2PutGd9zVPNerzCtfDkPS/P45CRb+DCeGIsPjs2on4Aa7P08+fWbJ7v+Htnz37swtBsLj4HDG48drZyMSvl8WA7VbrCODsth+R6wJO9MRERERERERERERERERERERERERER6vX+cDiyGQ1DG3QAAAABJRU5ErkJggg==");
}
</style>