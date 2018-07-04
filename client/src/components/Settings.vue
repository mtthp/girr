<template>
  <div>
    <Toolbar :title="'Settings'"></Toolbar>
    <main class="mdc-toolbar-fixed-adjust">
      <div class="mdc-text-field mdc-text-field--fullwidth mdc-text-field--with-trailing-icon" v-bind:class="{ 'mdc-text-field--upgraded' : scene.title }">
        <i class="material-icons mdc-text-field__icon" tabindex="0">label</i>
        <input type="text" id="title" class="mdc-text-field__input" v-model.lazy="scene.title" v-on:change="updateScene({title: $event.target.value})">
        <label for="title" class="mdc-text-field__label" v-bind:class="{ 'mdc-text-field__label--float-above' : scene.title }">{{ $t('settings.title_input_label') }}</label>
      </div>
      <div class="mdc-text-field mdc-text-field--fullwidth mdc-text-field--with-trailing-icon" v-bind:class="{ 'mdc-text-field--upgraded' : scene.picture }">
        <i class="material-icons mdc-text-field__icon" tabindex="0">photo</i>
        <input type="text" id="picture" class="mdc-text-field__input" v-model.lazy="scene.picture" v-on:change="updateScene({picture: $event.target.value})">
        <label for="picture" class="mdc-text-field__label" v-bind:class="{ 'mdc-text-field__label--float-above' : scene.picture }">{{ $t('settings.picture_input_label') }}</label>
      </div>
      <div class="mdc-text-field mdc-text-field--fullwidth mdc-text-field--with-trailing-icon" v-bind:class="{ 'mdc-text-field--upgraded' : scene.logo }">
        <i class="material-icons mdc-text-field__icon flip-vertically" tabindex="0">photo_album</i>
        <input type="text" id="logo" class="mdc-text-field__input" v-model.lazy="scene.logo" v-on:change="updateScene({logo: $event.target.value})">
        <label for="logo" class="mdc-text-field__label" v-bind:class="{ 'mdc-text-field__label--float-above' : scene.logo }">{{ $t('settings.logo_input_label') }}</label>
      </div>
      <div class="mdc-text-field mdc-text-field--fullwidth mdc-text-field--with-trailing-icon" v-bind:class="{ 'mdc-text-field--upgraded' : scene.background }">
        <i class="material-icons mdc-text-field__icon" tabindex="0">photo_size_select_large</i>
        <input type="text" id="background" class="mdc-text-field__input" v-model.lazy="scene.background" v-on:change="updateScene({background: $event.target.value})">
        <label for="background" class="mdc-text-field__label" v-bind:class="{ 'mdc-text-field__label--float-above' : scene.background }">{{ $t('settings.background_input_label') }}</label>
      </div>
      <scenes :scenes="scene.scenes" v-if="scene.scenes"></scenes>
    </main>
  </div>
</template>

<script>
import Event from '../utils/EventBus.js'
import Toolbar from './Toolbar'
import scenes from './XsplitScenes'
import { textField } from 'material-components-web'

export default {
  name: 'settings',
  components: {
    Toolbar,
    scenes
  },
  data () {
    return {
      scene: {}
    }
  },
  computed: {
    scenePath: function () {
      return this.$router.resolve({name: 'Scene'}).href
    }
  },
  watch: {// call again the method if the route changes
    '$route': 'getScene'
  },
  created () {
    this.getScene()
    this.$options.sockets['scene'] = (data) => {
      this.scene = data
    }
  },
  mounted () {
    this.$el.querySelectorAll('.mdc-text-field--with-trailing-icon').forEach(function (mdlTextfield) {
      textField.MDCTextField.attachTo(mdlTextfield)
    })
  },
  methods: {
    getScene: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/scene/').then(
        (response) => {
          Event.$emit('progressbar.toggle', false)
          this.scene = response.body
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('http.error', response)
        }
      )
    },
    updateScene: function (data) {
      Event.$emit('progressbar.toggle', true)
      this.$http.put('/api/scene/', data).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.scene = response.body
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('http.error', response)
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main {
  margin: 0 auto;
  padding: 16px;
  max-width: 1280px;
  max-height: calc(100vh - 68px - 32px);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: column;
      flex-flow: column;
}

iframe {
  width: 100%;
  min-height: 100px;
  flex: 1 1 100%; /* fills remaining space */
}

/* fix mdc-text-field--fullwidth padding */
.mdc-text-field--fullwidth:not(.mdc-text-field--textarea) .mdc-text-field__input {
  padding-top: 10px;
}

.mdc-select {
  margin-top: 24px;
  width: 100%;
  max-width: 100%;
}

.flip-vertically {
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
}
</style>
