<template>
  <header class="mdc-toolbar mdc-toolbar--fixed mdc-toolbar--waterfall">
    <drawer></drawer>
    <div class="mdc-toolbar__row">
      <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
          <a class="material-icons mdc-toolbar__icon--menu menu" aria-label="Menu" alt="Menu">menu</a>
          <span class="mdc-toolbar__title">{{ title }}</span>
      </section>
      <section class="mdc-toolbar__section mdc-toolbar__section--align-end mdc-toolbar__section--shrink-to-fit">
          <a class="material-icons mdc-toolbar__icon mdc-ripple-surface mdc-ripple-surface--primary" href="/api#!/Programs/get_programs" target="_blank" aria-label="API" alt="API">code</a>
      </section>
    </div>
    <div role="progressbar" class="mdc-linear-progress">
      <div class="mdc-linear-progress__buffering-dots"></div>
      <div class="mdc-linear-progress__buffer"></div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
    </div>
  </header>
</template>

<script>
import Drawer from './Drawer'
import Event from '../utils/EventBus.js'

// import { toolbar } from 'material-components-web'
// toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'))
// tb.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust')

export default {
  name: 'Toolbar',
  props: ['title'],
  components: { Drawer },
  mounted: function () {
    Event.$on('progressbar.toggle', this.toggleProgressBar)
    this.$el.querySelector('.menu').addEventListener('click', function () {
      Event.$emit('drawer.toggle', true)
    })
  },
  methods: {
    toggleProgressBar: function (bool) {
      if (bool) {
        document.querySelector('.mdc-linear-progress').classList.add('mdc-linear-progress--indeterminate')
      } else {
        document.querySelector('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate')
      }
    }
  }
}
</script>

<style scoped>
</style>