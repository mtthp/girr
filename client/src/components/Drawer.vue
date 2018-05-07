<template>
  <aside class="mdc-drawer mdc-drawer--temporary mdc-typography">
    <nav class="mdc-drawer__drawer">
      <header class="mdc-drawer__header">
        <div class="mdc-drawer__header-content">
          <div class="title">
            Studio Renegade Remote Regie
            <i class="material-icons mdc-badge mdc-badge--overlap" :data-badge="usersCount" v-if="usersCount > 1">people</i>
          </div>
        </div>
      </header>
      <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
        <router-link :to="{ name: 'Programs' }" @click.native="toggleDrawer(false)" class="mdc-list-item" active-class="mdc-list-item--activated" data-mdc-auto-init="MDCRipple">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">event</i>Programs
        </router-link>
        <router-link :to="{ name: 'Scene' }" @click.native="toggleDrawer(false)" class="mdc-list-item" active-class="mdc-list-item--activated" data-mdc-auto-init="MDCRipple">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">tv</i>Scene
        </router-link>
        <router-link :to="{ name: 'Settings' }" @click.native="toggleDrawer(false)" class="mdc-list-item" active-class="mdc-list-item--activated" data-mdc-auto-init="MDCRipple">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings</i>Settings
        </router-link>
        <a class="mdc-list-item" href="/api/" target="_blank" data-mdc-auto-init="MDCRipple">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">code</i>API
        </a>
      </nav>
    </nav>
  </aside>
</template>

<script>
import { drawer } from 'material-components-web'
import Event from '../utils/EventBus.js'

export default {
  data () {
    return {
      usersCount: 0
    }
  },
  created () {
    this.$options.sockets['users.count'] = (data) => {
      this.usersCount = parseInt(data)
    }
  },
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
.mdc-drawer__header-content {
  padding: 0px;
  background-image: url('../assets/studiorenegade-logo_157.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
}

.mdc-drawer__header-content::after {
  background-image: url('../assets/img-background.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  display: block;
  content: '';
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: -1;
}

.mdc-drawer__header-content .title {
  width: 100%;
  font-size: 18px;
  padding: 12px 16px;
  color: rgb(255, 255, 255);
  background-color: rgba(0, 0, 0, 0.5);
}

.mdc-drawer__header-content .material-icons {
  float: right;
}
</style>