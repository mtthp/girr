// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueSocketio from 'vue-socket.io'
import VueI18n from 'vue-i18n'

Vue.use(VueResource)
Vue.use(VueSocketio, '/')
Vue.use(VueI18n)

const locales = {
  en: require('./assets/locales/en.json'),
  fr: require('./assets/locales/fr.json')
}

const messages = {
  'en': locales.en,
  'en-US': locales.en,
  'fr': locales.fr,
  'fr-FR': locales.fr
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: navigator.language,
  messages
})

Vue.config.productionTip = false

Vue.filter('formatDate', function (value) {
  if (value) {
    const date = new Date(String(value))
    return isNaN(date) ? value : date.toLocaleDateString() + ' at ' + date.toLocaleTimeString()
  }
})

// credit https://stackoverflow.com/a/847196
Vue.filter('formatTime', function (millisecondsTimestamp) {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  if (millisecondsTimestamp < 0) millisecondsTimestamp = 0
  const date = new Date(millisecondsTimestamp)
  // Hours part from the timestamp
  const hours = date.getUTCHours()
  // Minutes part from the timestamp
  const minutes = '0' + date.getUTCMinutes()
  // Seconds part from the timestamp
  const seconds = '0' + date.getUTCSeconds()

  // Will display time in 30:23 or 02:30:23 format
  return (hours > 0 ? hours + ':' : '') + minutes.substr(-2) + ':' + seconds.substr(-2)
})

/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
