<template>
  <main class="xsplit">
  	<div class="title">{{ title }}</div>
    <div class="content">
    	<img :src="imgUri">
   	</div>
  </main>
</template>

<script>
// import Event from '../utils/EventBus.js'
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
Vue.use(VueSocketio, 'http://localhost:8080')

export default {
  name: 'xsplit',
  data () {
    return {
      title: 'Ohlalalalalalalalalalalalalalalalala',
      imgUri: require('../assets/geekinc-logo_512.png')
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    customEmit: function (val) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.xsplit {
	display: flex;
	flex-flow: column-reverse;
  background-image: url('../assets/brick-wall.jpg');
  background-repeat: no-repeat;
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
