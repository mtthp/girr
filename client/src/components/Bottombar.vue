<template>
    <footer v-on:click="goToEpisode($event)" v-on:keyup.right="nextTopic">
      <img v-if="thumbnail" class="thumbnail" :src="thumbnail">
      <div class="metadata">
        <div class="mdc-typography--subheading2">{{ scene.title }}</div>
        <div v-if="timePlayed > 0" class="mdc-typography--body1">{{ timePlayed | formatTime }}</div>
      </div>
      <div class="actions">
        <button class="material-icons mdc-toolbar__icon mdc-ripple-surface" arial-label="Next" data-mdc-auto-init="MDCRipple" v-on:click="nextTopic($event)">skip_next</button>
        <div class="mdc-menu-anchor" v-show="scene.scenes && scene.scenes.length > 0">
          <button class="material-icons mdc-toolbar__icon mdc-ripple-surface toggle-scenes-menu" arial-label="Menu" data-mdc-auto-init="MDCRipple">videocam</button>
          <div class="mdc-simple-menu mdc-simple-menu--open-from-bottom-right scenes-menu" tabindex="-1">
            <ul class="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
              <li class="mdc-list-item" v-for="scene in scene.scenes" :class="{ active: scene.active }" v-on:click="activeScene(scene)">{{ scene.name }}</li>
            </ul>
          </div>
        </div>
        <div class="mdc-menu-anchor">
          <button class="material-icons mdc-toolbar__icon mdc-ripple-surface toggle-menu" arial-label="Menu" data-mdc-auto-init="MDCRipple">more_vert</button>
          <div class="mdc-simple-menu mdc-simple-menu--open-from-bottom-right bottombar-menu" tabindex="-1">
            <ul class="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
              <li class="mdc-list-item" role="menuitem" tabindex="0" :aria-disabled="isAtEpisode" v-if="scene.episode" v-on:click="goToEpisode($event)">{{ $t('bottom_bar.go_to_episode', [scene.episode.name]) }}}</li>
              <li class="mdc-list-divider" role="separator"></li>
              <li class="mdc-list-item" role="menuitem" tabindex="0" v-on:click="stopEpisode($event)">{{ $t('actions.stop') }}</li>
              <li class="mdc-list-item" role="menuitem" tabindex="0" :aria-disabled="isTopicPlaying" v-on:click="stopTopic($event)">{{ $t('actions.pause') }}</li>
            </ul>
          </div>
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
      scene: {},
      timePlayed: this.scene && this.scene.episode ? ((this.scene.episode.ended ? new Date(this.scene.episode.ended).getTime() : new Date().getTime()) - new Date(this.scene.episode.started).getTime()) : 0
    }
  },
  computed: {
    thumbnail () {
      return this.scene.picture ? this.scene.picture : (this.scene.logo ? this.scene.logo : null)
    },
    isAtEpisode () {
      return this.$router.resolve({name: 'Episode', params: { programId: this.scene.episode.program, episodeId: this.scene.episode._id }}).route.fullPath === this.$route.fullPath
    },
    isTopicPlaying () {
      return !(this.scene.topic ? this.scene.topic.started && !this.scene.topic.ended : false)
    }
  },
  watch: {
    'scene.episode' (value) {
      Event.$emit('bottombar.toggle', value !== null)
    },
    'scene.topic.started' (value) {
      if (value !== null && this.scene && this.scene.topic && this.scene.topic.ended === null) {
        this.timePlayedHandler = window.setInterval(() => {
          this.timePlayed = this.scene && this.scene.topic ? ((this.scene.topic.ended ? new Date(this.scene.topic.ended).getTime() : new Date().getTime()) - new Date(this.scene.topic.started).getTime()) : 0
        }, 1000)
      }
      this.timePlayed = this.scene && this.scene.topic ? ((this.scene.topic.ended ? new Date(this.scene.topic.ended).getTime() : new Date().getTime()) - new Date(this.scene.topic.started).getTime()) : 0
    },
    'scene.topic.ended' (value) {
      if (value !== null && this.scene && this.scene.topic && this.scene.topic.started !== null) {
        window.clearInterval(this.timePlayedHandler)
      }
    }
  },
  created () {
    this.fetchData()
    this.$options.sockets['scene'] = (data) => {
      this.scene = data
    }
  },
  mounted () {
    this.menu = new menu.MDCSimpleMenu(this.$el.querySelector('.bottombar-menu'))
    // Add event listener to some button to toggle the menu on and off.
    this.$el.querySelector('.toggle-menu').addEventListener('click', (event) => {
      event.stopPropagation()
      event.preventDefault()
      this.scenesMenu.open = false
      this.menu.open = !this.menu.open
    })

    this.scenesMenu = new menu.MDCSimpleMenu(this.$el.querySelector('.scenes-menu'))
    // Add event listener to some button to toggle the menu on and off.
    this.$el.querySelector('.toggle-scenes-menu').addEventListener('click', (event) => {
      event.stopPropagation()
      event.preventDefault()
      this.menu.open = false
      this.scenesMenu.open = !this.scenesMenu.open
    })
  },
  methods: {
    fetchData: function () {
      this.$http.get('/api/scene/').then(
        (response) => {
          this.scene = response.body
        },
        function (response) {
          Event.$emit('http.error', response)
        }
      )
    },
    updateScene: function (data) {
      Event.$emit('progressbar.toggle', true)
      this.$http.put('/api/scene/', data).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.scene = response.body
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('http.error', response)
        }
      )
    },
    goToEpisode: function (event) {
      if (!this.isAtEpisode) {
        window.location = this.$router.resolve({name: 'Episode', params: { programId: this.scene.episode.program, episodeId: this.scene.episode._id }}).href
      }
    },
    stopEpisode: function (event) {
      event.stopPropagation()
      this.menu.open = false
      Event.$emit('progressbar.toggle', true)
      this.$http.get(`/api/programs/${this.scene.episode.program}/episodes/${this.scene.episode._id}/stop`).then(
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
    stopTopic: function (event) {
      event.stopPropagation()
      this.menu.open = false
      Event.$emit('progressbar.toggle', true)
      this.$http.get(`/api/programs/${this.scene.episode.program}/episodes/${this.scene.episode._id}/topics/${this.scene.topic._id}/stop`).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('topic.updated', response.body)
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
      this.$http.get(`/api/programs/${this.scene.episode.program}/episodes/${this.scene.episode._id}/next`).then(
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
    },
    activeScene: function (activeScene) {
      event.stopPropagation()
      this.scene.scenes.forEach((scene) => {
        scene.active = (activeScene === scene)
      })
      this.updateScene({ scenes: this.scene.scenes })
      this.scenesMenu.open = false
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
  z-index: 2;
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
  color: rgb(255, 255, 255);
}

footer .mdc-simple-menu {
  bottom: 0px;
}

footer .scenes-menu .mdc-list-item.active {
  background: var(--mdc-theme-secondary);
  color: #fff;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>