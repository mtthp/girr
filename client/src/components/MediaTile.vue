<template>
  <li class="mdc-grid-tile" v-on:click="toggleMedia(media)">
    <div class="mdc-grid-tile__primary">
      <img class="mdc-grid-tile__primary-content" :src="media.uri" />
    </div>
    <span class="mdc-grid-tile__secondary">
      <i v-if="media.started && !media.ended" class="mdc-grid-tile__icon material-icons">check_circle</i>
      <span class="mdc-grid-tile__title">{{ media.label }}</span>
    </span>
  </li>
</template>

<script>
import Event from '../utils/EventBus.js'

export default {
  props: ['media', 'topicId'],
  created () {
    this.$options.sockets['medias.' + this.media._id + '.delete'] = function (data) {
      Event.$emit('topic.' + this.topicId + '.media.deleted', data)
    }
    this.$options.sockets['medias.' + this.media._id] = function (data) {
      Event.$emit('topic.' + this.topicId + '.media.updated', data)
    }
  },
  methods: {
    startMedia: function (media) {
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topicId + '/medias/' + media._id + '/start').then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('topic.' + this.topicId + '.media.updated', response.body)
          Event.$emit('snackbar.message', 'Media ' + response.body.label + ' started')
        }.bind(this),
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    stopMedia: function (media) {
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topicId + '/medias/' + media._id + '/stop').then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('topic.' + this.topicId + '.media.updated', response.body)
          Event.$emit('snackbar.message', 'Media ' + response.body.label + ' stopped')
        }.bind(this),
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    toggleMedia: function (media) {
      if (media.started && !media.ended) {
        this.stopMedia(media)
      } else {
        this.startMedia(media)
      }
      // Event.$emit('xsplit.update', { title: this.topic.title, picture: media.uri })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  object-fit: contain;
  cursor: pointer;
}

.mdc-grid-tile__icon {
  right: 0;
  margin-right: 12px;
  background-color: white;
  border-radius: 50%;
}
</style>
