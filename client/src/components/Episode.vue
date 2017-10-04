<template>
  <div>
    <div v-if="episode && episode.topics.length > 0" class="episodes">
      
    </div>
    <button class="mdc-fab material-icons fab" aria-label="add" data-mdc-auto-init="MDCRipple" v-on:click="addTopic">
      <span class="mdc-fab__icon">
        add
      </span>
    </button>
  </div>
</template>

<script>
import Event from '../utils/EventBus.js'

export default {
  name: 'episode',
  data () {
    return {
      episode: null
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData: function () {
      this.episode = null // reset the episode
      Event.$emit('progressbar.toggle', true)
      this.$http.get(process.env.API_URL + '/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.episode = response.body
          Event.$emit('title.change', this.episode.name)
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    deleteEpisode: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.delete(process.env.API_URL + '/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    addTopic: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.post(process.env.API_URL + '/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/').then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.episode.episodes.push(response.body)
          Event.$emit('snackbar.message', 'Added a new episode')
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
.fab {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}

@media(min-width: 1024px) {
   .fab {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>
