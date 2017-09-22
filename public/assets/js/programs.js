var Program = Vue.component('program', {
  props: {
    name: {
      type: String,
      required: true
    },
    logo: {
      type: String
    },
    programs: []
  },
  template: '#program-template'
})

var vm = new Vue({
  el: '#app',
  data: {
    programs: []
  },
  components: {
    program: Program
  },
  mounted: function() {
    this.getPrograms()
  },
  methods: {
    addProgram: function(){
      document.querySelector('.mdc-linear-progress').classList.add('mdc-linear-progress--indeterminate')
      this.$http.post('/api/programs').then(
        function(response){
          document.querySelector('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate')
          this.programs.push(response.body)
        },
        function(response){
          document.querySelector('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate')
          console.error(response)
          snackbar.show({
            message: "Error : " + (response.statusText ? response.statusText : "no connection")
          })
        }
      )
    },
    getPrograms: function(){
      document.querySelector('.mdc-linear-progress').classList.add('mdc-linear-progress--indeterminate')
      this.$http.get('/api/programs').then(
        function(response){
          document.querySelector('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate')
          this.programs = response.body
        },
        function(response){
          document.querySelector('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate')
          console.error(response)
          snackbar.show({
            message: "Error : " + (response.statusText ? response.statusText : "no connection")
          })
        }
      )
    },
    deleteProgram: function(id){
      document.querySelector('.mdc-linear-progress').classList.add('mdc-linear-progress--indeterminate')
      this.$http.delete('/api/programs/' + id).then(
        function(response){
          document.querySelector('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate')
          this.getPrograms()
        },
        function(response){
          document.querySelector('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate')
          console.error(response)
          snackbar.show({
            message: "Error : " + (response.statusText ? response.statusText : "no connection")
          })
        }
      )
    }
  }
});