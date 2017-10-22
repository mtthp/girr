<template>
  <li class="mdc-grid-tile" :class="{ playing : media.started && !media.ended }" v-on:click="toggleMedia(media)">
    <div class="mdc-grid-tile__primary">
      <img class="mdc-grid-tile__primary-content" :src="media.uri" />
    </div>
    <span class="mdc-grid-tile__secondary">
      <span class="mdc-grid-tile__title">{{ media.label }}</span>
    </span>
  </li>
</template>

<script>
import Event from '../utils/EventBus.js'

export default {
  props: ['media', 'topicId'],
  created () {
    this.$options.sockets[`medias.${this.media._id}.delete`] = (data) => {
      Event.$emit(`topics.${this.topicId}.media.deleted`, data)
    }
    this.$options.sockets[`medias.${this.media._id}`] = (data) => {
      Event.$emit(`topics.${this.topicId}.media.updated`, data)
    }
  },
  methods: {
    startMedia: function (media) {
      Event.$emit('progressbar.toggle', true)
      this.$http.get(`/api/programs/${this.$route.params.programId}/episodes/${this.$route.params.episodeId}/topics/${this.topicId}/medias/${media._id}/start`).then(
        (response) => {
          Event.$emit('progressbar.toggle', false)
          Event.$emit(`topics.${this.topicId}.media.updated`, response.body)
          Event.$emit('snackbar.message', `Media ${response.body.label} started`)
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', `Error : ${response.statusText ? response.statusText : 'no connection'}`)
        }
      )
    },
    stopMedia: function (media) {
      Event.$emit('progressbar.toggle', true)
      this.$http.get(`/api/programs/${this.$route.params.programId}/episodes/${this.$route.params.episodeId}/topics/${this.topicId}/medias/${media._id}/stop`).then(
        (response) => {
          Event.$emit('progressbar.toggle', false)
          Event.$emit(`topics.${this.topicId}.media.updated`, response.body)
          Event.$emit('snackbar.message', `Media ${response.body.label} stopped`)
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', `Error : ${response.statusText ? response.statusText : 'no connection'}`)
        }
      )
    },
    toggleMedia: function (media) {
      if (media.started && !media.ended) {
        this.stopMedia(media)
      } else {
        this.startMedia(media)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

img {
  object-fit: contain;
  cursor: pointer;
}

.mdc-grid-tile__icon {
  color: var(--mdc-theme-secondary,#ff4081);
  right: 0;
  margin-right: 12px;
  background-color: white;
  border-radius: 50%;
}

.mdc-grid-tile.playing .mdc-grid-tile__secondary {
  background-color: var(--mdc-theme-secondary,#ff4081);
}
</style>
