<template>
  <div class="episode mdc-card mdc-card--theme-dark " :style="episode.thumbnail ? 'background-image: url(\'' + episode.thumbnail + '\');' : null">
    <section class="mdc-card__primary mdc-menu-anchor" v-bind:class="{ 'mdc-theme--secondary-bg' : episode.started && !episode.ended }">
      <h1 class="mdc-card__title mdc-card__title--large">{{ episode.name }}</h1>
      <h2 class="mdc-card__subtitle">{{ $t('episode.subtitle', [episode.number, startedDate]) }}</h2>
      <i class="mdc-icon-toggle material-icons toggle-menu" arial-label="Menu">more_vert</i>
      <div class="mdc-simple-menu mdc-simple-menu--open-from-bottom-right" tabindex="-1">
        <ul class="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
          <li class="mdc-list-item" role="menuitem" tabindex="0" v-on:click="editEpisode($event)">{{ $t('actions.edit') }}</li>
          <li class="mdc-list-item" role="menuitem" tabindex="0" v-on:click="cloneEpisode(episode)">{{ $t('actions.clone') }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import Event from '../../utils/EventBus.js'
import { menu } from 'material-components-web'

export default {
  props: ['episode'],
  computed: {
    startedDate () {
      return !this.episode.started ? this.$t('episode.not_yet_started') : this.$options.filters.formatDate(this.episode.started)
    }
  },
  created () {
    this.$options.sockets[`episodes.${this.episode._id}.delete`] = function (data) {
      Event.$emit('episode.deleted', data)
    }
    this.$options.sockets[`episodes.${this.episode._id}`] = function (data) {
      Event.$emit('episode.updated', data)
    }
  },
  mounted () {
    this.menu = new menu.MDCSimpleMenu(this.$el.querySelector('.mdc-simple-menu'))
    // Add event listener to some button to toggle the menu on and off.
    this.$el.querySelector('.toggle-menu').addEventListener('click', (event) => {
      event.preventDefault()
      this.menu.open = !this.menu.open
    })
  },
  methods: {
    editEpisode: function (event) {
      event.preventDefault()
      event.stopPropagation()
      Event.$emit('episodeDialog.show', this.episode)
    },
    cloneEpisode: function (episode) {
      event.preventDefault()
      Event.$emit('progressbar.toggle', true)
      this.$http.get(`/api/programs/${this.$route.params.programId}/episodes/${episode._id}/clone`).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          window.location = this.$router.resolve({ name: 'Episode', params: { programId: response.body.program, episodeId: response.body._id } }).href
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('http.error', response)
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.episode.mdc-card  {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/studiorenegade-logo_157.png");
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

.episode .toggle-menu {
  position: absolute;
  bottom: 0;
  right: 0;
  color: white;
}

@media screen and (min-width: 840px) {
  .episode:not(:hover) .toggle-menu {
    display: none;
  }
}

.episode .mdc-simple-menu {
  bottom: 0;
  right: 0;
  top: inherit  !important;
  left: inherit !important;
}
</style>
