<template>
  <div class="episode mdc-card mdc-card--theme-dark" :style="episode.thumbnail ? 'background-image: url(\'' + episode.thumbnail + '\');' : null">
    <section class="mdc-card__primary">
      <h1 class="mdc-card__title mdc-card__title--large">{{ episode.name }}</h1>
      <h2 class="mdc-card__subtitle">Added {{ episode.created | formatDate }}</h2>
    </section>
    <div class="mdc-menu-anchor">
      <i class="mdc-icon-toggle material-icons toggle-menu" arial-label="Menu">more_vert</i>
      <div class="mdc-simple-menu mdc-simple-menu--open-from-top-right" tabindex="-1">
        <ul class="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
          <li class="mdc-list-item" role="menuitem" tabindex="0" v-on:click="deleteEpisode()">Delete</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Event from '../utils/EventBus.js'
import { menu } from 'material-components-web'

export default {
  props: ['episode'],
  mounted () {
    this.menu = new menu.MDCSimpleMenu(this.$el.querySelector('.mdc-simple-menu'))
    // Add event listener to some button to toggle the menu on and off.
    this.$el.querySelector('.toggle-menu').addEventListener('click', function (event) {
      event.preventDefault()
      this.menu.open = !this.menu.open
    }.bind(this))
  },
  methods: {
    deleteEpisode: function (event) {
      event.preventDefault()
      Event.$emit('episode.delete', this.episode)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.episode.mdc-card  {
  position: relative;
  width: 100%;
  height: 21.875rem;
  background-image: url("../assets/geekinc-logo_512.png");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.episode.mdc-card section {
  background: rgba(0, 0, 0, .4);
  text-align: center;
}

.episode .mdc-icon-toggle::before,
.episode .mdc-icon-toggle::after {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.episode .mdc-menu-anchor {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
