<template>
    <div class="moon-phase">
        <div id="moonPhaseImage"></div>
    </div>
</template>

<script>
import QueryHelper from './QueryHelper'
const http = require('http')

// from https://github.com/codebox/js-planet-phase/blob/master/planet_phase.js:
/*
    Defines the function 'drawPlanetPhase' which will render a 'kind of' realistic lunar or planetary disc with
    shadow.

    The simplest way to call the function is like this:

        drawPlanetPhase(document.getElementById('container'), 0.15, true)

    the first argument is the HTML element that you want to contain the disc

    the second argument must be a value between 0 and 1, indicating how large the shadow should be:
           0 = new moon
        0.25 = crescent
        0.50 = quarter
        0.75 = gibbous
        1.00 = full moon

    the third argument is a boolean value indicating whether the disc should be waxing or waning (ie which
    side of the disc the shadow should be on):
         true = waxing - shadow on the left
        false = waning - shadow on the right

    the function accepts an optional fourth argument, containing configuration values which change the
    size, colour and appearance of the disc - see the comments on the 'defaultConfig' object for details.

    Copyright 2014 Rob Dawson
    http://codebox.org.uk/pages/planet-phase
*/

var drawPlanetPhase = (function () {
  /* jslint browser: true, forin: true, white: true */

  function calcInner (outerDiameter, semiPhase) {
    var innerRadius
    var absPhase = Math.abs(semiPhase)
    var n = ((1 - absPhase) * outerDiameter / 2) || 0.01

    innerRadius = n / 2 + outerDiameter * outerDiameter / (8 * n)

    return {
      d: innerRadius * 2,
      o: semiPhase > 0 ? (outerDiameter / 2 - n) : (-2 * innerRadius + outerDiameter / 2 + n)
    }
  }

  function setCss (el, props) {
    var p
    for (p in props) {
      el.style[p] = props[p]
    }
  }
  function drawDiscs (outer, inner, blurSize) {
    var blurredDiameter, blurredOffset
    setCss(outer.box, {
      'position': 'absolute',
      'height': outer.diameter + 'px',
      'width': outer.diameter + 'px',
      'border': '1px solid black',
      'backgroundColor': outer.colour,
      'borderRadius': (outer.diameter / 2) + 'px',
      'overflow': 'hidden'
    })

    blurredDiameter = inner.diameter - blurSize
    blurredOffset = inner.offset + blurSize / 2

    setCss(inner.box, {
      'position': 'absolute',
      'backgroundColor': inner.colour,
      'borderRadius': (blurredDiameter / 2) + 'px',
      'height': blurredDiameter + 'px',
      'width': blurredDiameter + 'px',
      'left': blurredOffset + 'px',
      'top': ((outer.diameter - blurredDiameter) / 2) + 'px',
      'boxShadow': '0px 0px ' + blurSize + 'px ' + blurSize + 'px ' + inner.colour,
      'opacity': inner.opacity
    })
  }
  function makeDiv (container) {
    var div = document.createElement('div')
    container.appendChild(div)
    return div
  }
  function setPhase (outerBox, phase, isWaxing, config) {
    var innerBox = makeDiv(outerBox)
    var outerColour
    var innerColour
    var innerVals

    if (phase < 0.5) {
      outerColour = config.lightColour
      innerColour = config.shadowColour
      if (isWaxing) {
        phase *= -1
      }
    } else {
      outerColour = config.shadowColour
      innerColour = config.lightColour
      phase = 1 - phase
      if (!isWaxing) {
        phase *= -1
      }
    }

    innerVals = calcInner(config.diameter, phase * 2)

    drawDiscs({
      box: outerBox,
      diameter: config.diameter,
      colour: outerColour
    }, {
      box: innerBox,
      diameter: innerVals.d,
      colour: innerColour,
      offset: innerVals.o,
      opacity: 1 - config.earthshine
    }, config.blur)
  }

  var defaultConfig = {
    shadowColour: 'black', // CSS background-colour value for the shaded part of the disc
    lightColour: 'white', // CSS background-colour value for the illuminated part of the disc
    diameter: 100, // diameter of the moon/planets disc in pixels
    earthshine: 0.1, // between 0 and 1, the amount of light falling on the shaded part of the disc 0=none, 1=full illumination
    blur: 3 // amount of blur on the terminator in pixels, 0=no blur
  }

  function populateMissingConfigValues (config) {
    var p
    for (p in defaultConfig) {
      config[p] = (config[p] === undefined) ? defaultConfig[p] : config[p]
    }
    return config
  }

  return function (containerEl, phase, isWaxing, config) {
    config = populateMissingConfigValues(Object.create(config || {}))
    var el = makeDiv(containerEl)
    setPhase(el, phase, isWaxing, config)
  }
}())

const timeDelay = 1000 * 60 * 60  // Redraw moon phase once an hour

export default {
  name: 'MoonPhase',
  mixins: [QueryHelper],
  data () {
    return {
      timer: null
    }
  },
  mounted () {
    this.timer = setInterval(this.refreshMoonImage, timeDelay)
    this.refreshMoonImage()
  },
  beforeDestroy () {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  },
  methods: {
    getPhaseInfo (cb) {
      let data = ''
      http.get('http://astroclock.local:8080/moon', (resp) => {
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          if (this.verbose) console.log('Data: ', chunk.length)
          data += chunk
        })
        resp.on('error', (err) => {
          console.error('Error: ' + err.message)
        })
        resp.on('end', () => {
          // The whole response has been received. Print out the result.
          if (this.verbose) console.log('End: ', data.length)
          let response = JSON.parse(data)
          var illum = response['illum'] / 100.0
          var waxing = parseFloat(response['phase']) < 50.0
          cb(illum, waxing)
        })
      })
    },
    drawMoonPhase (illum, waxing) {
      const elem = document.getElementById('moonPhaseImage')
      if (elem) {
        // elem.style.backgroundImage = `url(${this.getMoonPhaseImageUrl()})`
        drawPlanetPhase(elem, illum, waxing, {diameter: 180, earthshine: 0.1, blur: 10, lightColour: '#999'})
      }
    },
    refreshMoonImage () {
      this.getPhaseInfo(this.drawMoonPhase)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./_globals.scss";

$size: 5em;
$curve: 1em;

.moon-phase  {
  position: absolute;
  left: $gap;
  bottom: $gap;
  background-color: $bgcolor;
  height: $size;
  width: $size;
  border-radius: $curve;
  overflow: hidden;
}

.moon-phase #moonPhaseImage {
  padding: 28px;
  height: 100%;
  width: 100%;
}
</style>
