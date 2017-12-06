<template>
  <div>
    <Toolbar :title="'Settings'"></Toolbar>
    <main class="mdc-toolbar-fixed-adjust">
      <div class="mdc-text-field mdc-text-field--fullwidth mdc-text-field--with-trailing-icon" v-bind:class="{ 'mdc-text-field--upgraded' : xsplit.title }">
        <i class="material-icons mdc-text-field__icon" tabindex="0">label</i>
        <input type="text" id="title" class="mdc-text-field__input" :value="xsplit.title" v-model.lazy="xsplit.title" v-on:change="updateXsplit({title: $event.target.value})">
        <label for="title" class="mdc-text-field__label" v-bind:class="{ 'mdc-text-field__label--float-above' : xsplit.title }">Title</label>
      </div>
      <div class="mdc-text-field mdc-text-field--fullwidth mdc-text-field--with-trailing-icon" v-bind:class="{ 'mdc-text-field--upgraded' : xsplit.picture }">
        <i class="material-icons mdc-text-field__icon" tabindex="0">photo</i>
        <input type="text" id="picture" class="mdc-text-field__input" :value="xsplit.picture" v-model.lazy="xsplit.picture" v-on:change="updateXsplit({picture: $event.target.value})">
        <label for="picture" class="mdc-text-field__label" v-bind:class="{ 'mdc-text-field__label--float-above' : xsplit.picture }">Picture</label>
      </div>
      <div class="mdc-text-field mdc-text-field--fullwidth mdc-text-field--with-trailing-icon" v-bind:class="{ 'mdc-text-field--upgraded' : xsplit.logo }">
        <i class="material-icons mdc-text-field__icon flip-vertically" tabindex="0">photo_album</i>
        <input type="text" id="logo" class="mdc-text-field__input" :value="xsplit.logo" v-model.lazy="xsplit.logo" v-on:change="updateXsplit({logo: $event.target.value})">
        <label for="logo" class="mdc-text-field__label" v-bind:class="{ 'mdc-text-field__label--float-above' : xsplit.logo }">Logo</label>
      </div>
      <div class="mdc-text-field mdc-text-field--fullwidth mdc-text-field--with-trailing-icon" v-bind:class="{ 'mdc-text-field--upgraded' : xsplit.background }">
        <i class="material-icons mdc-text-field__icon" tabindex="0">photo_size_select_large</i>
        <input type="text" id="background" class="mdc-text-field__input" :value="xsplit.background" v-model.lazy="xsplit.background" v-on:change="updateXsplit({background: $event.target.value})">
        <label for="background" class="mdc-text-field__label" v-bind:class="{ 'mdc-text-field__label--float-above' : xsplit.background }">Background</label>
      </div>
      <div class="mdc-text-field mdc-text-field--fullwidth">
        <select v-if="xsplit.scenes" class="mdc-select" v-on:change="changeScene($event)" id="activeScene">
          <option v-for="scene in xsplit.scenes" :key="scene._id" :value="scene._id" :selected="scene.active">{{ scene.name }}</option>
        </select>
        <label for="activeScene" class="mdc-text-field__label mdc-text-field__label--float-above">Scene</label>
      </div>
    </main>
  </div>
</template>

<script>
import Event from '../utils/EventBus.js'
import Toolbar from './Toolbar'
import { textField } from 'material-components-web'
import xjs from 'xjs-framework/dist/xjs-es2015' // be aware of https://github.com/xjsframework/xjs/issues/171

export default {
  name: 'settings',
  components: {
    Toolbar
  },
  data () {
    return {
      xsplit: {}
    }
  },
  computed: {
    xsplitPath: function () {
      return this.$router.resolve({name: 'Xsplit'}).href
    }
  },
  watch: {// call again the method if the route changes
    '$route': 'getXsplit',
    'xsplit.scenes' (scenes) {
      xjs.Scene.getActiveScene().then(currentActiveScene => {
        const sceneToActive = scenes.find(scene => {
          return scene.active
        })
        if (sceneToActive && currentActiveScene._id !== sceneToActive._id) {
          xjs.Scene.setActiveScene(sceneToActive.index)
        }
      })
    }
  },
  created () {
    this.getXsplit()
    this.$options.sockets['xsplit'] = (data) => {
      this.xsplit = data
    }
    xjs
      .ready()
      .then(xjs.Scene.getSceneCount)
      .then(count => {
        function getScene (index) {
          return new Promise(function (resolve, reject) {
            resolve(xjs.Scene.getById(index).then(scene => {
              scene.index = index
              return scene.getName().then(name => {
                scene.name = name
                return scene.getItems().then(items => {
                  scene.items = items
                  return scene
                })
              })
            }))
          })
        }
        // inspired by https://stackoverflow.com/a/29906506
        function processArray (array, fn) {
          let results = []
          return array.reduce(function (p, item) {
            return p.then(function () {
              return fn(item).then(function (data) {
                results.push(data)
                return results
              })
            })
          }, Promise.resolve())
        }
        let indexesArray = Array.from({length: count}, (v, k) => k + 1)
        processArray(indexesArray, getScene).then((scenes) => {
          xjs.Scene.getActiveScene().then(activeScene => {
            scenes.forEach((scene) => {
              scene.active = (scene._id === activeScene._id)
            })
            this.xsplit.scenes = scenes
            this.updateXsplit(this.xsplit)
          })
        })
      })
  },
  mounted () {
    this.$el.querySelectorAll('.mdc-text-field').forEach(function (mdlTextfield) {
      textField.MDCTextField.attachTo(mdlTextfield)
    })
  },
  methods: {
    getXsplit: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/xsplit/').then(
        (response) => {
          Event.$emit('progressbar.toggle', false)
          this.xsplit = response.body
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('http.error', response)
        }
      )
    },
    updateXsplit: function (data) {
      Event.$emit('progressbar.toggle', true)
      this.$http.put('/api/xsplit/', data).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.xsplit = response.body
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('http.error', response)
        }
      )
    },
    changeScene: function (event) {
      this.xsplit.scenes.forEach((scene) => {
        scene.active = (Number(event.target.value) === scene._id)
      })
      this.updateXsplit({ scenes: this.xsplit.scenes })
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
  height: calc(100vh - 68px - 32px);
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
