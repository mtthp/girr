<template>
  <aside class="mdc-temporary-drawer mdc-typography">
    <nav class="mdc-temporary-drawer__drawer">
      <header class="mdc-temporary-drawer__header">
        <div class="mdc-temporary-drawer__header-content">
          <div>GeekInc Remote Regie</div>
        </div>
      </header>
      <nav id="icon-with-text-demo" class="mdc-temporary-drawer__content mdc-list">
        <router-link :to="{ name: 'Programs' }" @click.native="toggleDrawer(false)" class="mdc-list-item" active-class="mdc-temporary-drawer--selected" data-mdc-auto-init="MDCRipple">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">event</i>Programs
        </router-link>
        <router-link :to="{ name: 'Xsplit' }" @click.native="toggleDrawer(false)" class="mdc-list-item" active-class="mdc-temporary-drawer--selected" data-mdc-auto-init="MDCRipple">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">tv</i>Xsplit
        </router-link>
        <router-link :to="{ name: 'Admin' }" @click.native="toggleDrawer(false)" class="mdc-list-item" active-class="mdc-temporary-drawer--selected" data-mdc-auto-init="MDCRipple">
          <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">build</i>Admin
        </router-link>
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

      // fix body.mdc-drawer-scroll-lock when changing routes
      if (!this.dw.open) {
        document.querySelector('body').classList.remove('mdc-drawer-scroll-lock')
      }
    }
  }
}
</script>

<style scoped>
.mdc-temporary-drawer__header-content {
  padding: 0px;
  background-image: url('../assets/geekinc-header_600.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.mdc-temporary-drawer__header-content div {
  width: 100%;
  padding: 12px 16px;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>