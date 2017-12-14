// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// Astronomy data API is documented at: http://aa.usno.navy.mil/data/docs/api.php

import Vue from 'vue'
import World from './components/World'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<World/>',
  components: { World }
})
