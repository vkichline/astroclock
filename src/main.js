// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// Astronomy data API is documented at: http://aa.usno.navy.mil/data/docs/api.php

import Vue from 'vue'
import World from './components/World'

Vue.config.productionTip = false
Vue.config.strict = true

// These 'global' variables can be used by any component that needs to know the location.
// (Currently, all are consumed in QueryHelper.vue mixin.)
//
export const clockLocation = new Vue({
  data: {
    latitude: '47.725430',
    longitude: '-122.180099',
    altitude: '93',
    tz: (function () {
      let d = new Date()
      let diff = -(d.getTimezoneOffset() / 60)
      return diff.toString()
    })(),
    nws_station: 'SEW/130,72' // Kirkland, WA (for NWS weather API)
  }
})

// This phrase kicks off the entire application
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<World/>',
  components: { World }
})
