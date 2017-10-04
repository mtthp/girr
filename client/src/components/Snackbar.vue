<template>
  <div class="mdc-snackbar mdc-snackbar--align-start">
    <div class="mdc-snackbar__text"></div>
    <div class="mdc-snackbar__action-wrapper">
      <button type="button" class="mdc-button mdc-snackbar__action-button"></button>
    </div>
  </div>
</template>

<script>
import {snackbar} from 'material-components-web'
import Event from '../utils/EventBus.js'

export default {
  name: 'Snackbar',
  mounted: function () {
    this.sb = snackbar.MDCSnackbar.attachTo(this.$el)
    Event.$on('snackbar.message', this.showMessage)
  },
  methods: {
    showMessage: function (message) {
      this.sb.show({
        message: message
      })
    }
  }
}
</script>

<style scoped>
</style>