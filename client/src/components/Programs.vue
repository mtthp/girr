<template>
  <div v-if="programs.length > 0" class="programs">
    <router-link :to="{ name: 'Program', params: { programId: program.name }}" v-for="program in programs" :key="program.name" class="mdc-card mdc-card--theme-dark program" :style="program.thumbnail ? 'background-image: url(\'' + program.thumbnail + '\');' : null">
        <section class="mdc-card__primary">
          <h1 class="mdc-card__title mdc-card__title--large">{{ program.name }}</h1>
          <h2 class="mdc-card__subtitle">Added {{ program.created | formatDate }}</h2>
        </section>
      <section class="mdc-card__actions">
        <button class="mdc-button mdc-button--compact mdc-card__action" v-on:click="deleteProgram(program.name)">Delete</button>
      </section>
    </router-link>
    <button class="mdc-fab material-icons fab" aria-label="add" data-mdc-auto-init="MDCRipple" v-on:click="addProgram">
      <span class="mdc-fab__icon">
        add
      </span>
    </button>
  </div>
</template>

<script>
import Event from '../utils/EventBus.js'

export default {
  name: 'programs',
  data () {
    return {
      programs: []
    }
  },
  mounted: function () {
    this.getPrograms()
  },
  methods: {
    addProgram: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.post('/api/programs').then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.programs.push(response.body)
          Event.$emit('snackbar.message', 'Added ' + response.body.name)
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    getPrograms: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/programs').then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.programs = response.body
          Event.$emit('title.change', this.programs.length + ' Programs')
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    deleteProgram: function (id) {
      Event.$emit('progressbar.toggle', true)
      this.$http.delete('/api/programs/' + id).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.getPrograms()
          Event.$emit('snackbar.message', 'Program ' + id + ' deleted')
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
.programs {
  margin: 0 auto;
  max-width: 1280px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: row wrap;
      flex-flow: row wrap;
}

.program {
  margin: 15px;
  width: calc(100% - 30px);
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.program.mdc-card {
  background-image: url("../assets/geekinc-logo_512.png");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  height: 21.875rem;
}

.program.mdc-card section {
  background: rgba(0, 0, 0, .4);
}

a {
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
</style>
