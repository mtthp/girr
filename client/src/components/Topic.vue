<template>
  <div class="topic" v-bind:class="{ expanded : topic.expanded }">
    <li role="separator" class="mdc-list-divider"></li>
    <li class="mdc-list-item" data-mdc-auto-init="MDCRipple" v-on:click="toggle()">
      <img class="mdc-list-item__start-detail" src="../assets/geekinc-logo_512.png" width="56" height="56" alt="Panda">
      <span class="mdc-list-item__text">
        {{ topic.title }}
        <span class="mdc-list-item__text__secondary">{{ topic.description }}</span>
      </span>
      <span class="mdc-list-item__end-detail">
        <time v-if="topic.playing" datetime="2014-01-28T04:36:00.000Z">00:00</time>
        <i v-if="topic.expanded" class="material-icons" arial-label="Edit" v-on:click="editTopic">edit</i>
        <i v-if="topic.playing" class="material-icons" arial-label="Playing">play_arrow</i>
        <i class="material-icons chevron" arial-label="Chevron">keyboard_arrow_down</i>
      </span>
    </li>
    <div class="content">
      {{ topic.description }}
      <div class="medias">
      </div>
    </div>
  </div> 
</template>

<script>
import Event from '../utils/EventBus.js'
import { autoInit } from 'material-components-web'

export default {
  props: ['topic'],
  // data () {
  //   return {
  //     topic: JSON.parse(JSON.stringify(this.topic))
  //   }
  // },
  created () {
    this.topic.expanded = false
  },
  mounted () {
    // code here executes once the component is rendered
    autoInit(this.$el) // reapply MDCRipple to all mdc-list-item
    Event.$on('topic.update', function updateTopic (topic) {
      if (topic === this.topic) {
        this.updateTopic(topic)
      }
    }.bind(this))
    Event.$on('topic.delete', function deleteTopics (topic) {
      if (topic === this.topic) {
        this.deleteTopic()
      }
    }.bind(this))
  },
  methods: {
    toggle: function () {
      this.topic.expanded = !this.topic.expanded
      this.$forceUpdate()
    },
    editTopic: function (event) {
      event.stopImmediatePropagation()
      Event.$emit('topicDialog.show', this.topic)
    },
    updateTopic: function (data) {
      Event.$emit('progressbar.toggle', true)
      this.$http.put('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topic._id, data).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          // this.$set(this, 'topic', response.body)
          // Object.keys(this.topic).map(function (key, index) {
          //   console.log(this)
          //   this.$set(this.topic, key, response.body['key'])
          // })
          // Event.$emit('episode.fetch')
          Event.$emit('snackbar.message', 'Topic ' + this.topic.title + ' updated')
        },
        function (response) {
          Event.$emit('progressbar.toggle', false)
          console.error(response)
          Event.$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'))
        }
      )
    },
    deleteTopic: function () {
      Event.$emit('progressbar.toggle', true)
      this.$http.delete('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topic._id).then(
        function (response) {
          Event.$emit('progressbar.toggle', false)
          Event.$emit('snackbar.message', 'Topic ' + this.topic.title + ' deleted')
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

.topic .content {
  max-height: 0px;
  overflow: hidden;
  transition: all 0.2s, max-height 0.2s; /* close rapidly */
}

.topic.expanded .content {
  transition: all 0.2s, max-height 1s; /* open slowly */
  max-height: 256px;
}

.topic .chevron {
  transition: transform 0.2s;
}

.topic.expanded .chevron {
  transform: rotate(-180deg);
}

.topic.expanded .mdc-list-item__text,
.topic.expanded .mdc-list-item__start-detail,
.topic.expanded .mdc-list-item__end-detail {
  color: var(--mdc-theme-secondary,#ff4081);
}

.topic.expanded .mdc-list-item__text__secondary {
  display: none;
}

.topic .mdc-list-divider {
  display: none;
}

.topic.expanded .mdc-list-divider {
  display: inherit;
}

.topic.expanded + .topic .mdc-list-divider {
  display: inherit;
}

.mdc-list-item .mdc-list-item__text {
  margin-right: 16px;
  /* https://css-tricks.com/flexbox-truncated-text/ */
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mdc-list-item .mdc-list-item__text__secondary {
  min-width: 0;
}

.mdc-list-item .mdc-list-item__end-detail {
  width: auto;
  height: auto;
  display: inline-flex;
  flex-direction: row;
  align-items: flex-end;
}

.mdc-list-item__end-detail.timestamp {
  /* Lock to left of container. */
  align-self: flex-start;
}

a.mdc-list-item {
    color: inherit;
    text-decoration: none;
}
</style>
