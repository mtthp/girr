<template>
  <div class="topic" v-bind:class="{ expanded : topic.expanded, playing : topic.started !== null && topic.ended === null }">
    <li role="separator" class="mdc-list-divider"></li>
    <li class="mdc-list-item" data-mdc-auto-init="MDCRipple" v-on:click="toggle(!topic.expanded)">
      <img v-if="medias.length > 0" class="mdc-list-item__start-detail" :src="medias[0].uri" width="56" height="56" alt="medias[0].label">
      <span v-else class="mdc-list-item__start-detail" role="presentation">
        <i class="material-icons" aria-hidden="true">comment</i>
      </span>
      <span class="mdc-list-item__text">
        {{ topic.title }}
        <span class="mdc-list-item__text__secondary">{{ topic.description }}</span>
      </span>
      <span class="mdc-list-item__end-detail">
        <i class="mdc-icon-toggle material-icons edit-button" arial-label="Edit" v-on:click="editTopic">edit</i>
        <time v-if="topic.started">{{ timePlayed | formatTime }}</time>
        <i v-if="topic.started !== null && topic.ended === null" class="mdc-icon-toggle material-icons" arial-label="Stop" v-on:click="stop">stop</i>
        <i v-else class="mdc-icon-toggle material-icons" arial-label="Playing" v-on:click="start">play_arrow</i>
        <i class="material-icons chevron" arial-label="Chevron">keyboard_arrow_down</i>
      </span>
    </li>
    <div class="content">
      {{ topic.description ? topic.description : 'Empty in here' }}
      <div class="mdc-grid-list">
        <ul class="mdc-grid-list__tiles">
          <MediaTile v-for="media in medias" :key="media._id" :media="media" :topicId="topic._id"></MediaTile>
        </ul>
      </div>
    </div>
  </div> 
</template>

<script>
import Event from '../utils/EventBus.js'
import { autoInit } from 'material-components-web'
import MediaTile from './MediaTile'

export default {
  props: ['topic'],
  data () {
    return {
      timePlayed: !this.topic.started ? 0 : (this.topic.ended ? new Date(this.topic.ended).getTime() : new Date().getTime()) - new Date(this.topic.started).getTime(),
      medias: []
    }
  },
  components: {
    MediaTile
  },
  created () {
    this.topic.expanded = false
    this.$options.sockets['topics.' + this.topic._id + '.delete'] = function (data) {
      Event.$emit('topic.deleted', data)
    }
    this.$options.sockets['topics.' + this.topic._id] = function (data) {
      Event.$emit('topic.updated', data)
    }
    this.$options.sockets['medias.add'] = (media) => {
      if (media.topic === this.topic._id) {
        Event.$emit('topic.' + this.topic._id + '.media.added', media)
      }
    }
    if (this.topic.started !== null && this.topic.ended === null) {
      this.timePlayedHandler = window.setInterval(() => {
        this.timePlayed = !this.topic.started ? 0 : (this.topic.ended ? new Date(this.topic.ended).getTime() : new Date().getTime()) - new Date(this.topic.started).getTime()
      }, 1000)
    }
    this.fetchMedias()
  },
  watch: {
    'topic.started' (value) {
      if (value !== null && this.topic.ended === null) {
        this.timePlayedHandler = window.setInterval(() => {
          this.timePlayed = !this.topic.started ? 0 : (this.topic.ended ? new Date(this.topic.ended).getTime() : new Date().getTime()) - new Date(this.topic.started).getTime()
        }, 1000)
      }
    },
    'topic.ended' (value) {
      if (value !== null && this.topic.started !== null) {
        window.clearInterval(this.timePlayedHandler)
      }
    }
  },
  mounted () {
    // code here executes once the component is rendered
    autoInit(this.$el) // reapply MDCRipple to all mdc-list-item
    Event.$on('topic.update', (dialogTopic, dialogMedias) => {
      if (dialogTopic._id === this.topic._id) {
        // parcours des Topic's medias pour savoir lesquels sont à supprimer
        topicMediasLoop:
        for (let i = 0; i < this.medias.length; i++) {
          for (let j = 0; j < dialogMedias.length; j++) {
            if (this.medias[i]._id === dialogMedias[j]._id) {
              continue topicMediasLoop
            }
          }
          this.deleteMedia(this.medias[i])
        }

        // parcours des Dialog's medias pour savoir lesquels sont à ajouter
        dialogMedias.forEach((dialogMedia) => {
          if (!dialogMedia._id && dialogMedia.file) {
            this.addMedia(dialogMedia.file)
          }
        })
      }
    })
    // remove this to expand multiple topics at the same time
    Event.$on('topic.toggle', (topic) => {
      if (this.topic !== topic) {
        this.topic.expanded = false
        this.$forceUpdate()
      }
    })
    Event.$on('topic.' + this.topic._id + '.media.added', (media) => {
      const index = this.medias.indexOf(this.medias.find(function (topicMedia) {
        return topicMedia._id === media._id
      }))
      if (index < 0) this.medias.push(media)
    })
    Event.$on('topic.' + this.topic._id + '.media.updated', (media) => {
      for (let i = 0; i < this.medias.length; i++) {
        if (this.medias[i]._id === media._id) {
          this.medias[i] = media
          this.$forceUpdate()
          break
        }
      }
    })
    Event.$on('topic.' + this.topic._id + '.media.deleted', (media) => {
      const index = this.medias.indexOf(this.medias.find(function (topicMedia) {
        return topicMedia._id === media._id
      }))
      if (index > -1) this.medias.splice(index, 1)
    })
  },
  methods: {
    fetchMedias: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topic._id + '/medias').then(
        (response) => {
          Event.$emit('progressbar.toggle', false)
          this.medias = response.body
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    toggle: function (bool) {
      Event.$emit('topic.toggle', this.topic)
      this.topic.expanded = bool
      this.$forceUpdate()
    },
    editTopic: function (event) {
      event.stopImmediatePropagation()
      Event.$emit('topicDialog.show', this.topic, this.medias)
    },
    start: function (event) {
      event.stopImmediatePropagation()
      this.toggle(true)
      this.timePlayed = 0
      Event.$emit('topic.start', this.topic)
      Event.$emit('xsplit.update', { title: this.topic.title, picture: null })
    },
    stop: function (event) {
      event.stopImmediatePropagation()
      Event.$emit('topic.stop', this.topic)
    },
    addMedia: function (file) {
      let formData = new FormData()
      formData.append('file', file)
      Event.$emit('progressbar.toggle', true)
      this.$http.post('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topic._id + '/medias/', formData).then(
        (response) => {
          Event.$emit('progressbar.toggle', false)
          // Event.$emit('topic.' + this.topic._id + '.media.updated', response.body)
          Event.$emit('topic.' + this.topic._id + '.media.added', response.body)
          Event.$emit('snackbar.message', 'Added ' + response.body.label)
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    deleteMedia: function (media) {
      Event.$emit('progressbar.toggle', true)
      this.$http.delete('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topic._id + '/medias/' + media._id).then(
        (response) => {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('topic.' + this.topic._id + '.media.deleted', media)
          Event.$emit('snackbar.message', 'Media ' + media.label + ' deleted')
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.topic .mdc-list-item {
  cursor: pointer;
}

.topic .content {
  max-height: 0px;
  margin: 10px 0;
  overflow: hidden;
  transition: all 0.2s, max-height 0.2s; /* close rapidly */
}

.topic.expanded .content {
  transition: all 0.2s, max-height 1s; /* open slowly */
  max-height: 2048px;
  overflow: auto;
}

.topic .chevron {
  padding: 12px;
  transition: transform 0.2s;
}

.topic.expanded .chevron {
  transform: rotate(-180deg);
}

.topic time {
  margin: auto;
}

.topic .mdc-list-item__start-detail {
  cursor: move; /* fallback: */
  cursor: -webkit-grab; /* Chrome 1-21, Safari 4+ */
  cursor:    -moz-grab; /* Firefox 1.5-26 */
  cursor:         grab; /* W3C standards syntax, should come least */
}

.topic img.mdc-list-item__start-detail {
  object-fit: cover;
}

.topic.playing .mdc-list-item__text,
.topic.playing .mdc-list-item__start-detail,
.topic.playing .mdc-list-item__end-detail,
.topic.playing i {
  color: var(--mdc-theme-secondary,#ff4081);
}

.topic.expanded .mdc-list-item__text__secondary {
  display: none;
}

.topic .mdc-list-divider {
  display: none;
}

.topic.expanded .mdc-list-divider {
  display: inherit;
}

.topic.expanded + .topic .mdc-list-divider {
  display: inherit;
}

.topic:not(.expanded) .edit-button {
  display: none;
}

.mdc-list-item .mdc-list-item__text {
  margin-right: 16px;
  /* https://css-tricks.com/flexbox-truncated-text/ */
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mdc-list-item .mdc-list-item__text__secondary {
  min-width: 0;
}

.mdc-list-item .mdc-list-item__end-detail {
  width: auto;
  height: auto;
  display: inline-flex;
  flex-direction: row;
  align-items: flex-end;
}

.mdc-list-item .mdc-list-item__start-detail {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: rgba(0, 0, 0, .26);
}

.topic .mdc-icon-toggle::before,
.topic .mdc-icon-toggle::after {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

a.mdc-list-item {
  color: inherit;
  text-decoration: none;
}

.mdc-grid-tile {
  --mdc-grid-list-tile-width: 192px;
  margin: 2px auto;
}

@media screen and (max-width: 991px) {
  .mdc-grid-tile {
    --mdc-grid-list-tile-width: 144px;
  }
}
@media screen and (max-width: 767px) {
  .mdc-grid-tile {
    --mdc-grid-list-tile-width: 96px;
  }
}
</style>
