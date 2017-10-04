<template>
  <div>
    <div v-if="program && program.episodes.length > 0" class="episodes">
      <router-link :to="{ name: 'Episode', params: { programId: program.name, episodeId: episode.number }}" v-for="episode in program.episodes" :key="episode._id" class="mdc-card mdc-card--theme-dark episode" :style="episode.thumbnail ? 'background-image: url(\'' + episode.thumbnail + '\');' : null">
        <section class="mdc-card__primary">
          <h1 class="mdc-card__title mdc-card__title--large">{{ episode.name }}</h1>
          <h2 class="mdc-card__subtitle">Added {{ episode.created | formatDate }}</h2>
        </section>
      </router-link>
    </div>
    <button class="mdc-fab material-icons fab" aria-label="add" data-mdc-auto-init="MDCRipple" v-on:click="addEpisode">
      <span class="mdc-fab__icon">
        add
      </span>
    </button>
  </div>
</template>

<script>
import Event from '../utils/EventBus.js'

export default {
  name: 'program',
  data () {
    return {
      program: null
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
      this.program = null // reset the program
      Event.$emit('progressbar.toggle', true)
      this.$http.get(process.env.API_URL + '/programs/' + this.$route.params.programId).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.program = response.body
          Event.$emit('title.change', this.program.name)
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    deleteProgram: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.delete(process.env.API_URL + '/programs/' + this.$route.params.programId).then(
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
    addEpisode: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.post(process.env.API_URL + '/programs/' + this.$route.params.programId + '/episodes/').then(
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

.mdc-card  {
  margin: 15px;
  width: calc(100%/3 - 30px);
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  background-image: url("../assets/geekinc-logo_512.png");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  height: 21.875rem;
}

a {
  outline: 0;
  text-decoration: none;
  border: none;
  -moz-outline-style: none;
}

.mdc-card section {
  background: rgba(0, 0, 0, .4);
}

.fab {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}

@media screen and (max-width: 991px) {
  .mdc-card {
    width: calc((100% / 2) - 30px);
  }
}
@media screen and (max-width: 767px) {
  .mdc-card {
    width: calc(100% - 30px);
  }
}

@media(min-width: 1024px) {
   .fab {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>
