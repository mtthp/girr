<template>
    <footer v-on:click="goToEpisode($event)">
      <img v-if="thumbnail" class="thumbnail" :src="thumbnail">
      <div class="metadata">
        <label>{{ xsplit.title }}</label>
        <time v-if="timePlayed > 0">{{ timePlayed | formatTime }}</time>
      </div>
      <div class="actions">
        <button class="material-icons mdc-toolbar__icon mdc-ripple-surface" arial-label="Next" data-mdc-auto-init="MDCRipple" v-on:click="nextTopic($event)">skip_next</button>
        <button class="material-icons mdc-toolbar__icon mdc-ripple-surface toggle-menu" arial-label="Menu" data-mdc-auto-init="MDCRipple">more_vert</button>
        <div class="mdc-simple-menu mdc-simple-menu--open-from-bottom-right" tabindex="-1">
          <ul class="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
            <li class="mdc-list-item" role="menuitem" tabindex="0" v-on:click="stopEpisode($event)">Stop</li>
          </ul>
        </div>
      </div>
    </footer>
</template>

<script>
import Event from '../utils/EventBus.js'
import { menu } from 'material-components-web'

export default {
  name: 'Bottombar',
  data () {
    return {
      xsplit: {},
      timePlayed: this.xsplit && this.xsplit.episode ? ((this.xsplit.episode.ended ? new Date(this.xsplit.episode.ended).getTime() : new Date().getTime()) - new Date(this.xsplit.episode.started).getTime()) : 0
    }
  },
  computed: {
    thumbnail () {
      return this.xsplit.picture ? this.xsplit.picture : (this.xsplit.logo ? this.xsplit.logo : null)
    }
  },
  watch: {
    'xsplit.episode' (value) {
      Event.$emit('bottombar.toggle', value !== null)
    },
    'xsplit.episode.started' (value) {
      if (value !== null && this.xsplit && this.xsplit.episode && this.xsplit.episode.ended === null) {
        this.timePlayedHandler = window.setInterval(() => {
          this.timePlayed = this.xsplit && this.xsplit.episode ? ((this.xsplit.episode.ended ? new Date(this.xsplit.episode.ended).getTime() : new Date().getTime()) - new Date(this.xsplit.episode.started).getTime()) : 0
        }, 1000)
      }
      this.timePlayed = this.xsplit && this.xsplit.episode ? ((this.xsplit.episode.ended ? new Date(this.xsplit.episode.ended).getTime() : new Date().getTime()) - new Date(this.xsplit.episode.started).getTime()) : 0
    },
    'xsplit.episode.ended' (value) {
      if (value !== null && this.xsplit && this.xsplit.episode && this.xsplit.episode.started !== null) {
        window.clearInterval(this.timePlayedHandler)
      }
    }
  },
  created () {
    this.fetchData()
    this.$options.sockets['xsplit'] = (data) => {
      this.xsplit = data
    }
  },
  mounted () {
    this.menu = new menu.MDCSimpleMenu(this.$el.querySelector('.mdc-simple-menu'))
    // Add event listener to some button to toggle the menu on and off.
    this.$el.querySelector('.toggle-menu').addEventListener('click', (event) => {
      event.stopPropagation()
      event.preventDefault()
      this.menu.open = !this.menu.open
    })
  },
  methods: {
    fetchData: function () {
      this.$http.get('/api/xsplit/').then(
        (response) => {
          this.xsplit = response.body
        },
        function (response) {
          Event.$emit('http.error', response)
        }
      )
    },
    goToEpisode: function (event) {
      window.location = this.$router.resolve({name: 'Episode', params: { programId: this.xsplit.episode.program, episodeId: this.xsplit.episode._id }}).href
    },
    stopEpisode: function (event) {
      event.stopPropagation()
      this.menu.open = false
      Event.$emit('progressbar.toggle', true)
      this.$http.get(`/api/programs/${this.xsplit.episode.program}/episodes/${this.xsplit.episode._id}/stop`).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('episode.updated', response.body)
          Event.$emit('snackbar.message', `Episode ${response.body.name} stopped`)
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('http.error', response)
        }
      )
    },
    nextTopic: function (event) {
      event.stopPropagation()
      Event.$emit('progressbar.toggle', true)
      this.$http.get(`/api/programs/${this.xsplit.episode.program}/episodes/${this.xsplit.episode._id}/next`).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('topic.updated', response.body)
          Event.$emit('snackbar.message', `Topic ${response.body.title} started`)
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

<style scoped>
footer {
  width: calc(100% - 24px);
  height: 56px;
  background: var(--mdc-theme-secondary);
  box-shadow: 0 -2px 2px 0 rgba(0,0,0,.14), 0 -3px 1px -2px rgba(0,0,0,.2), 0 -1px 5px 0 rgba(0,0,0,.12);
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
}

footer .thumbnail {
  margin: 4px 12px;
  width: 48px;
  height: 48px;
  object-fit: contain;
}

footer .metadata {
  color: white;
}

footer .metadata label {
  font-size: 1rem;
}

footer .metadata time {
  font-size: 0.875rem;
  display: block;
}

footer .actions {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  flex: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>