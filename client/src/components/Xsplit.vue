<template>
  <main class="xsplit" :style="{ 'background-image': xsplit.picture ? 'url(' + require('../assets/brick-wall.jpg') + ')' : null }">
    <div class="title">{{ xsplit.title }}</div>
    <div class="content">
      <img :src="xsplit.picture" v-bind:class="{ loading: xsplit.picture }" v-on:load="loaded($event)" v-on:error="failed($event)">
   	</div>
  </main>
</template>

<script>
import Event from '../utils/EventBus.js'

export default {
  name: 'xsplit',
  data () {
    return {
      xsplit: {}
    }
  },
  created () {
    this.fetchData()
    // malheureusement, je n'ai pas trouvé d'autre moyen pour observer un event contenant un '.' - @Matthieu Petit
    // si jamais on en a besoin, je laisse ça ici
    this.$options.sockets['xsplit'] = function (data) {
      this.xsplit = data
    }.bind(this)
  },
  methods: {
    fetchData: function () {
      this.$http.get('/api/xsplit/').then(
        function (response) {
          this.xsplit = response.body
        },
        function (response) {
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    loaded: function (event) {
      event.target.classList.remove('loading')
      event.target.classList.remove('failed')
    },
    failed: function (event) {
      event.target.classList.remove('loading')
      event.target.classList.add('failed')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.xsplit {
	display: flex;
	flex-flow: column-reverse;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  width: 100vw;
  height: 100vh;
}

.title {
	flex: 1 0 auto; /* sized to content */
  margin: 0.5em 1em;
  padding: 0em 0.3em;
  max-width: calc(100% - 400px); /* je ne sais pas quelle taille fait exactement le twitch chat donc j'ai mis 400px à l'arrache */
  font-family: 'Oswald', sans-serif;
  font-weight: 400;
  font-size: 52px;
  color: black;
  text-transform: uppercase;
  text-overflow: ellipsis; /* ou au pire clip */
  overflow: hidden;
  box-sizing: border-box;
  background-color: white; 
}

.title:not(.hidden) {
  /* en mode apparition, on veut que le texte apparaisse vers la fin de l'animation */
  transition: transform 1s, color 2s ease-in-out;
  transform-origin: left;
}

.title.hidden {
  /* en mode disparition, on veut que le texte disparaisse plus tôt pour éviter l'écrasement */
  transition: transform 1s, color 0.5s ease-in-out;
  transform : scaleX(0);
  color: white;
}

.xsplit .content {
	flex: 1 1 100%; /* fills remaining space */
	display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.xsplit .content img {
	width: 100%;
	object-fit: contain;
}

.loading {
  background: transparent;
  background-repeat: no-repeat;
  background-position: center center;
  /* inspired by http://david.ingledow.co.uk/blog/google-material-designs-animated-loading-spinner-svg-and-css/ and https://stackoverflow.com/a/41935729 */
  background-image: url("\
  data:image/svg+xml;utf8, \
    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='100px' height='100px' \
      style='-webkit-transform-origin: center center; \
            transform-origin: center center; \
            -webkit-animation: rotate 2s linear infinite; \
            animation: rotate 2s linear infinite; \
            position: absolute; \
            top: 0; \
            bottom: 0; \
            left: 0; \
            right: 0; \
            margin: auto;'> \
      <style type='text/css'> \
        .path { \
          stroke-dasharray: 1,200; \
          stroke-dashoffset: 0; \
          animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite; \
          stroke-linecap: round; \
        } \
        @keyframes rotate { 100% { transform: rotate(360deg); } } \
        @keyframes dash { \
          0% { stroke-dasharray: 1,200; stroke-dashoffset: 0; } \
          50% { stroke-dasharray: 89,200; stroke-dashoffset: -35; } \
          100% { stroke-dasharray: 89,200; stroke-dashoffset: -124; } \
        } \
        %40keyframes color { \
          100%, 0% { stroke: #d62d20; } \
          40% { stroke: #0057e7; } \
          66% { stroke: #008744; } \
          80%, 90% { stroke: #ffa700; } \
        } \
      %3C/style%3E \
      <circle cx='50' cy='50' r='20' fill='none' stroke-width='2' stroke-miterlimit='10' class='path'/> \
    </svg>\
  ");
}

.failed {
  background: transparent;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url('../assets/error.gif');
}
</style>
