<template>
  <aside id="topic-dialog"
    class="mdc-dialog"
    role="alertdialog"
    aria-labelledby="my-mdc-dialog-label"
    aria-describedby="my-mdc-dialog-description">
    <div class="mdc-dialog__surface">
      <header class="mdc-dialog__header">
        <h2 id="my-mdc-dialog-label" class="mdc-dialog__header__title">
          {{ topic.title }}
        </h2>
      </header>
      <section id="my-mdc-dialog-description" class="mdc-dialog__body mdc-dialog__body--scrollable">
        <div class="mdc-textfield" v-bind:class="{ 'mdc-textfield--upgraded' : topic.title }">
          <input type="text" id="title" class="mdc-textfield__input" :value="topic.title" v-model.lazy="topic.title">
          <label for="title" class="mdc-textfield__label" v-bind:class="{ 'mdc-textfield__label--float-above' : topic.title }">Title</label>
        </div>
        <div class="mdc-textfield mdc-textfield--fullwidth mdc-textfield--textarea">
          <textarea id="description" class="mdc-textfield__input" rows="8" placeholder="Description" v-model.lazy="topic.description">{{ topic.description }}</textarea>
        </div>
        <div class="mdc-grid-list">
          <ul class="mdc-grid-list__tiles">
            <li class="mdc-grid-tile" v-for="media in topic.medias">
              <div class="mdc-grid-tile__primary">
                <img class="mdc-grid-tile__primary-content" :src="media.uri" />
                <i class="material-icons" v-on:click="deleteMedia(media)">cancel</i>
              </div>
              <span class="mdc-grid-tile__secondary">
                <span class="mdc-grid-tile__title">{{ media.label }}</span>
              </span>
            </li>
          </ul>
        </div>
      </section>
      <footer class="mdc-dialog__footer">
        <div style="margin-right: auto;">
          <button type="button" class="mdc-button mdc-dialog__footer__button delete" v-on:click="deleteTopic">
            <i class="material-icons mdc-button__icon">delete</i>
            Delete
          </button>
          <button type="button" class="mdc-button mdc-dialog__footer__button upload" v-on:click="$event.currentTarget.querySelector('input').click()">
            <input type="file" name="file" accept="image/*" class="input-file" v-on:change="fileChange($event.target.name, $event.target.files);" style="display: none;">
            <i class="material-icons mdc-button__icon">file_upload</i>
            Upload
          </button>
        </div>
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">Cancel</button>
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept" v-on:click="confirm">Update</button>
      </footer>
    </div>
    <div class="mdc-dialog__backdrop"></div>
  </aside>
</template>

<script>
import Event from '../utils/EventBus.js'
import { dialog, textfield } from 'material-components-web'
import assign from 'object-assign'

export default {
  name: 'TopicDialog',
  data () {
    return {
      dialog: null,
      topic: {}
    }
  },
  mounted () {
    this.dialog = new dialog.MDCDialog(this.$el)
    textfield.MDCTextfield.attachTo(this.$el.querySelector('.mdc-textfield'))
    Event.$on('topicDialog.show', this.show)
    Event.$on('topicDialog.close', this.close)
  },
  methods: {
    show: function (topic) {
      this.topic = assign({}, topic)
      this.$el.querySelector('textarea').value = this.topic.description ? this.topic.description : ''
      this.dialog.show()
    },
    close: function () {
      this.dialog.close()
    },
    confirm: function () {
      Event.$emit('topic.update', this.topic)
    },
    deleteTopic: function () {
      Event.$emit('topic.delete', this.topic)
      this.close()
    },
    fileChange: function (name, files) {
      if (files.length > 0) {
        Event.$emit('topic.medias.add', this.topic, files[0])
      }
    },
    deleteMedia: function (media) {
      Event.$emit('topic.medias.delete', this.topic, media)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mdc-textfield--textarea {
  margin-top: 16px;
}

.mdc-dialog__body--scrollable {
  max-height: calc(80vh - 56px - 52px); /* main - header - footer */
}

button.delete {
  color: red;
}

.mdc-grid-list {
  margin: 0 auto;
}

.mdc-grid-tile {
  --mdc-grid-list-tile-width: 192px;
  margin: 2px auto;
}

.mdc-grid-tile img {
  object-fit: contain;
}

.mdc-button__icon {
  vertical-align: text-bottom;
}

.mdc-grid-tile__primary i {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 3;
  cursor: pointer;
}
</style>
