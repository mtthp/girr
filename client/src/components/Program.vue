<template>
  <div>
    <Toolbar :title="program.name"></Toolbar>
    <main class="mdc-toolbar-fixed-adjust"> 
      <div class="program">
        <EpisodeDialog></EpisodeDialog>
        <div v-if="program.episodes && program.episodes.length > 0" class="episodes">
          <router-link
            :to="{ name: 'Episode', params: { programId: program._id, episodeId: episode._id }}"
            v-for="episode in program.episodes"
            :key="episode._id"
            class="episode-card">
            <EpisodeCard :episode="episode"></EpisodeCard>
          </router-link>
        </div>
        <button class="mdc-fab material-icons fab" aria-label="add" data-mdc-auto-init="MDCRipple" v-on:click="addEpisode">
          <span class="mdc-fab__icon">
            add
          </span>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import Event from '../utils/EventBus.js'
import EpisodeCard from './EpisodeCard'
import EpisodeDialog from './EpisodeDialog'
// import { menu } from 'material-components-web'
import Toolbar from './Toolbar'

export default {
  name: 'program',
  components: {
    EpisodeCard,
    EpisodeDialog,
    Toolbar
  },
  data () {
    return {
      program: {}
    }
  },
  created () {
    this.fetchData()
    Event.$on('episode.update', function (episode) {
      this.updateEpisode(episode)
    }.bind(this))
    Event.$on('episode.delete', function (episode) {
      this.deleteEpisode(episode)
    }.bind(this))
    Event.$on('episode.updated', function (episode) {
      for (var i = 0; i < this.program.episodes.length; i++) {
        if (this.program.episodes[i]._id === episode._id) {
          this.program.episodes[i] = episode
          this.$forceUpdate()
          break
        }
      }
    }.bind(this))
    Event.$on('episode.deleted', function (episode) {
      var index = this.program.episodes.indexOf(this.program.episodes.find(function (programEpisode) {
        return programEpisode._id === episode._id
      }))
      if (index > -1) {
        this.program.episodes.splice(index, 1)
      }
    }.bind(this))
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData: function () {
      this.program = {} // reset the program
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/programs/' + this.$route.params.programId).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.program = response.body
          this.$options.sockets['programs.' + this.program._id] = function (data) {
            this.program = data
          }.bind(this)
          Event.$emit('title.change', this.program.name)
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    addEpisode: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.post('/api/programs/' + this.$route.params.programId + '/episodes/').then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.program.episodes.push(response.body)
          Event.$emit('snackbar.message', 'Added a new episode')
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    updateEpisode: function (episode) {
      Event.$emit('progressbar.toggle', true)
      this.$http.put('/api/programs/' + this.$route.params.programId + '/episodes/' + episode._id, episode).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('episode.updated', response.body)
          Event.$emit('snackbar.message', 'Episode ' + response.body.name + ' updated')
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    deleteEpisode: function (episode) {
      Event.$emit('progressbar.toggle', true)
      this.$http.delete('/api/programs/' + this.$route.params.programId + '/episodes/' + episode._id).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('episode.deleted', episode)
          Event.$emit('snackbar.message', 'Episode ' + episode.name + ' deleted')
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
.episodes {
  margin: 0 auto;
  max-width: 1280px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: row wrap;
      flex-flow: row wrap;
}

@media (max-width: 1280px) {
  .episodes {
    padding-bottom: 72px
  }
}

.episodes .episode-card {
  margin: 15px;
  width: calc(100%/3 - 30px);
  height: 21.875rem;
}

@media screen and (max-width: 991px) {
  .episodes .episode-card {
    width: calc((100% / 2) - 30px);
  }
}
@media screen and (max-width: 767px) {
  .episodes .episode-card {
    width: calc(100% - 30px);
  }
}

a.episode-card {
  outline: 0;
  text-decoration: none;
  border: none;
  -moz-outline-style: none;
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
