<template>
  <div id="app">
    <router-view></router-view>
    <Snackbar></Snackbar>
  </div>
</template>

<script>
import Snackbar from './components/Snackbar'
import { autoInit } from 'material-components-web'

export default {
  name: 'app',
  components: { Snackbar },
  data () {
    return {
      title: 'GeekInc Remote Regie'
    }
  },
  mounted: function () {
    autoInit() // autoInit MDC
  },
  sockets: {
    connect: function () {
      console.log('Websocket connection established')
    },
    disconnect: function () {
      console.warn('Disconnected from Websocket')
    }
  }
}
</script>

<style>
#app {
  font-family: Roboto,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  margin: 0;
}
</style>

<!-- Material Design Components -->
<style>@import '../node_modules/material-components-web/dist/material-components-web.min.css'</style>

<!-- Google Material Icons -->
<style>@import '../node_modules/material-design-icons/iconfont/material-icons.css'</style>

<!-- Styling MDC -->
<style>
:root {
  --mdc-theme-primary: #005976; /* customize MDC color */
  --mdc-theme-secondary: #ff4200;
}
</style>