<template>
  <div v-if="programs.length > 0" class="programs">
    <ProgramDialog></ProgramDialog>
    <router-link
      :to="{ name: 'Program', params: { programId: program._id }}"
      v-for="program in programs"
      :key="program.name"
      class="program-card">
      <ProgramCard :program="program"></ProgramCard>
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
import ProgramCard from './ProgramCard'
import ProgramDialog from './ProgramDialog'

export default {
  name: 'programs',
  components: {
    ProgramCard,
    ProgramDialog
  },
  data () {
    return {
      programs: []
    }
  },
  created () {
    this.getPrograms()
    Event.$on('program.update', function (program) {
      this.updateProgram(program)
    }.bind(this))
    Event.$on('program.delete', function (program) {
      this.deleteProgram(program)
    }.bind(this))
  },
  watch: {
    // call again the method if the route changes
    '$route': 'getPrograms'
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
    updateProgram: function (program) {
      Event.$emit('progressbar.toggle', true)
      this.$http.put('/api/programs/' + program._id, program).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          for (var i = 0; i < this.programs.length; i++) {
            if (this.programs[i] === program) {
              this.programs[i] = response.body
              Event.$emit('snackbar.message', 'Program ' + this.programs[i].name + ' updated')
              break
            }
          }
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    deleteProgram: function (program) {
      Event.$emit('progressbar.toggle', true)
      this.$http.delete('/api/programs/' + program._id).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          var index = this.programs.indexOf(this.programs.find(function (listProgram) {
            return listProgram === program
          }))
          if (index > -1) {
            this.programs.splice(index, 1)
            Event.$emit('snackbar.message', 'Program ' + program.name + ' deleted')
          }
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

@media (max-width: 1280px) {
  .programs {
    padding-bottom: 72px
  }
}

.programs .program-card {
  margin: 15px;
  width: calc(100% - 30px);
  height: 21.875rem;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
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
