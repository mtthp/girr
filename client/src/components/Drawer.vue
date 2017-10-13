<template>
  <aside class="mdc-temporary-drawer mdc-typography">
    <nav class="mdc-temporary-drawer__drawer">
        <header class="mdc-temporary-drawer__header">
            <div class="mdc-temporary-drawer__header-content">
                GeekInc Remote Regie
            </div>
        </header>
        <nav id="icon-with-text-demo" class="mdc-temporary-drawer__content mdc-list">
          <router-link :to="{ name: 'Programs' }" @click.native="dw.open = false" class="mdc-list-item" active-class="mdc-temporary-drawer--selected" data-mdc-auto-init="MDCRipple">
            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">event</i>Programs
          </router-link>
          <router-link :to="{ name: 'Xsplit' }" @click.native="dw.open = false" class="mdc-list-item" active-class="mdc-temporary-drawer--selected" data-mdc-auto-init="MDCRipple">
            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">tv</i>Xsplit
          </router-link>
          <a class="mdc-list-item" href="/admin.html" data-mdc-auto-init="MDCRipple">
            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">build</i>Admin
          </a>
          <a class="mdc-list-item" href="/api/" target="_blank" data-mdc-auto-init="MDCRipple">
            <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">code</i>API
          </a>
        </nav>
    </nav>
</aside>
</template>

<script>
import { drawer } from 'material-components-web'
import Event from '../utils/EventBus.js'

export default {
  mounted: function () {
    this.dw = new drawer.MDCTemporaryDrawer(this.$el)
    Event.$on('drawer.toggle', this.toggleDrawer)
  },
  methods: {
    toggleDrawer: function (bool) {
      this.dw.open = bool
    }
  }
}
</script>

<style scoped>
.mdc-temporary-drawer__header-content {
  color: black;
}
</style>