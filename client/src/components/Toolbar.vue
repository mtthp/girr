<template>
  <header class="mdc-toolbar mdc-toolbar--fixed mdc-toolbar--waterfall">
    <div class="mdc-toolbar__row">
      <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
        <a class="material-icons mdc-toolbar__icon--menu mdc-ripple-surface menu" aria-label="Menu" alt="Menu" data-mdc-auto-init="MDCRipple">menu</a>
        <span class="mdc-toolbar__title">{{ title }}</span>
      </section>
      <section class="mdc-toolbar__section mdc-toolbar__section--align-end mdc-toolbar__section--shrink-to-fit">
        <a class="material-icons mdc-toolbar__icon mdc-ripple-surface" data-mdc-auto-init="MDCRipple" href="/api#!/Programs/get_programs" target="_blank" aria-label="API" alt="API">code</a>
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
    <drawer></drawer>
  </header>
</template>

<script>
import Drawer from './Drawer'
import Event from '../utils/EventBus.js'
import { toolbar } from 'material-components-web'
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

    this.tb = toolbar.MDCToolbar.attachTo(this.$el)
    this.tb.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust')
    // this.tb.listen('MDCToolbar:change', function (evt) {
    //   var flexibleExpansionRatio = evt.detail.flexibleExpansionRatio
    //   console.log(flexibleExpansionRatio.toFixed(2))
    // })
  },
  methods: {
    toggleProgressBar: function (bool) {
      if (bool) {
        this.$el.querySelector('.mdc-linear-progress').classList.add('mdc-linear-progress--indeterminate')
      } else {
        this.$el.querySelector('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate')
      }
    }
  }
}
</script>

<style scoped>
.mdc-toolbar__title:hover {
  cursor: pointer;
}

.mdc-toolbar--flexible {
  --mdc-toolbar-ratio-to-extend-flexible: 3;
}

.mdc-toolbar__row:first-child::after {
  background-image: url("../assets/geekinc-logo_512.png");
  background-size: cover;
  background-position: center;
}
</style>