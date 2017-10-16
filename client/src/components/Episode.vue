<template>
  <div>
    <Toolbar :title="episode.name"></Toolbar>
    <main class="mdc-toolbar-fixed-adjust" :class="{ empty: topics.length == 0 }">
      <div class="episode">
        <TopicDialog></TopicDialog>
        <draggable
          v-if="topics.length > 0"
          element="ul"
          v-model="topics"
          :options="dragOptions"
          @change="itemMoved"
          class="topics mdc-list mdc-list--avatar-list mdc-list--two-line">
          <transition-group name="fade">
            <TopicCard v-for="topic in topics" :key="topic._id" :topic="topic" ></TopicCard>
          </transition-group>
        </draggable>
        <EmptyState v-else></EmptyState>
        <button class="mdc-fab material-icons fab" aria-label="add" data-mdc-auto-init="MDCRipple" v-on:click="addTopic">
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
import draggable from 'vuedraggable'
import TopicCard from './TopicCard'
import TopicDialog from './TopicDialog'
import Toolbar from './Toolbar'
import EmptyState from './EmptyState'

export default {
  name: 'episode',
  components: {
    draggable,
    TopicCard,
    TopicDialog,
    Toolbar,
    EmptyState
  },
  computed: {
    dragOptions () {
      return {
        animation: 0,
        handle: '.mdc-list-item__start-detail',
        delay: 0
      }
    }
  },
  data () {
    return {
      episode: {},
      topics: []
    }
  },
  created () {
    this.fetchData()
    this.$options.sockets['topics.add'] = function (topic) {
      if (topic.episode === this.episode._id) {
        Event.$emit('topic.added', topic)
      }
    }.bind(this)
    Event.$on('topic.update', function (topic, medias) {
      this.updateTopic(topic)
    }.bind(this))
    Event.$on('topic.delete', function (topic) {
      this.deleteTopic(topic)
    }.bind(this))
    Event.$on('topic.start', function (topic) {
      this.startTopic(topic)
    }.bind(this))
    Event.$on('topic.stop', function (topic) {
      this.stopTopic(topic)
      this.updateXsplit({title: this.episode.name, picture: null})
    }.bind(this))
    Event.$on('topic.added', function (topic) {
      const index = this.topics.indexOf(this.topics.find(function (episodeTopic) {
        return episodeTopic._id === topic._id
      }))
      if (index < 0) this.topics.push(topic)
    }.bind(this))
    Event.$on('topic.updated', function (topic) {
      for (let i = 0; i < this.topics.length; i++) {
        if (this.topics[i]._id === topic._id) {
          topic.expanded = this.topics[i].expanded // to keep expanded topics, well... expanded
          this.topics[i] = topic
          this.topics.sort(function (t1, t2) {
            return t1.position === t2.position ? 0 : (t1.position < t2.position ? -1 : 1)
          })
          this.$forceUpdate()
          break
        }
      }
    }.bind(this))
    Event.$on('topic.deleted', function (topic) {
      const index = this.topics.indexOf(this.topics.find(function (episodeTopic) {
        return episodeTopic._id === topic._id
      }))
      if (index > -1) this.topics.splice(index, 1)
    }.bind(this))
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData: function () {
      this.episode = {} // reset the episode
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.episode = response.body
          this.$options.sockets['episodes.' + this.episode._id] = function (data) {
            this.episode = data
          }.bind(this)
          this.fetchTopics()
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    fetchTopics: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics').then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          this.topics = response.body
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    addTopic: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.post('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/').then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('topic.added', response.body)
          Event.$emit('snackbar.message', 'Added a new topic')
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    updateTopic: function (topic) {
      Event.$emit('progressbar.toggle', true)
      this.$http.put('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + topic._id, topic).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('topic.updated', response.body)
          Event.$emit('snackbar.message', 'Topic ' + response.body.title + ' updated')
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    deleteTopic: function (topic) {
      Event.$emit('progressbar.toggle', true)
      this.$http.delete('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + topic._id).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('topic.deleted', topic)
          Event.$emit('snackbar.message', 'Topic ' + topic.title + ' deleted')
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    startTopic: function (topic) {
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + topic._id + '/start').then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('topic.updated', response.body)
          Event.$emit('snackbar.message', 'Topic ' + response.body.title + ' started')
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    stopTopic: function (topic) {
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + topic._id + '/stop').then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('topic.updated', response.body)
          Event.$emit('snackbar.message', 'Topic ' + response.body.title + ' stopped')
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    moveTopic: function (topic, newPosition) {
      Event.$emit('progressbar.toggle', true)
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + topic._id + '/move',
        {
          params: {
            position: newPosition
          }
        }
      ).then(
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
    updateXsplit: function (data) {
      Event.$emit('progressbar.toggle', true)
      this.$http.put('/api/xsplit/', data).then(
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
    itemMoved: function (event) {
      if (event.moved.element) {
        this.moveTopic(event.moved.element, event.moved.newIndex)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.topics {
  max-width: 1024px;
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

@media (max-width: 1280px) {
  main:not(.empty) {
    padding-bottom: 72px
  }
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
