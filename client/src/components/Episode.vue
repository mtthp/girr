<template>
  <div class="episode">
    <TopicDialog></TopicDialog>
    <draggable
      v-if="episode && episode.topics.length > 0"
      element="ul"
      v-model="episode.topics"
      :options="dragOptions"
      class="topics mdc-list mdc-list--avatar-list mdc-list--two-line">
      <transition-group name="fade">
        <Topic v-for="topic in episode.topics" :key="topic._id" :topic="topic" ></Topic>
      </transition-group>
    </draggable>
    <button class="mdc-fab material-icons fab" aria-label="add" data-mdc-auto-init="MDCRipple" v-on:click="addTopic">
      <span class="mdc-fab__icon">
        add
      </span>
    </button>
  </div>  
</template>

<script>
import Event from '../utils/EventBus.js'
import draggable from 'vuedraggable'
import Topic from './Topic'
import TopicDialog from './TopicDialog'

export default {
  name: 'episode',
  components: {
    draggable,
    Topic,
    TopicDialog
  },
  computed: {
    dragOptions () {
      return {
        animation: 0,
        delay: 0
      }
    }
  },
  data () {
    return {
      episode: {}
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
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId).then(
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
      this.$http.delete('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId).then(
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
      this.$http.post('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/').then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.episode.topics.push(response.body)
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

.topics {
  max-width: 1024px;
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>
