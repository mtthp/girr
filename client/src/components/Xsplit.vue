<template>
  <main class="xsplit" :style="{ 'background-image': xsplit.picture ? 'url(' + require('../assets/brick-wall.jpg') + ')' : null }">
    <div class="title">{{ xsplit.title }}</div>
    <div class="content">
      <img :src="xsplit.picture">
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
	display: inline-block;
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
</style>
