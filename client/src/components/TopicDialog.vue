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
              </div>
              <span class="mdc-grid-tile__secondary">
                <span class="mdc-grid-tile__title">{{ media.label }}</span>
              </span>
            </li>
          </ul>
        </div>
      </section>
      <footer class="mdc-dialog__footer">
        <button type="button" class="mdc-button mdc-dialog__footer__button delete">Delete</button>
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">Cancel</button>
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">Confirm</button>
      </footer>
    </div>
    <div class="mdc-dialog__backdrop"></div>
  </aside>
</template>

<script>
import Event from '../utils/EventBus.js'
import { dialog, textfield } from 'material-components-web'

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

    this.$el.querySelector('button.mdc-dialog__footer__button--accept').addEventListener('click', function (event) {
      Event.$emit('topic.update', this.topic)
    }.bind(this))
    this.$el.querySelector('button.delete').addEventListener('click', function (event) {
      Event.$emit('topic.delete', this.topic)
      this.close()
    }.bind(this))
  },
  methods: {
    show: function (topic) {
      if (this.topic._id !== topic._id) {
        this.topic = topic
        this.$el.querySelector('textarea').value = this.topic.description ? this.topic.description : ''
      }
      this.dialog.show()
    },
    close: function () {
      this.dialog.close()
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
  margin-right: auto;
  color: red;
}

.mdc-grid-list {
  margin: 0 auto;
}

.mdc-grid-list img {
  object-fit: contain;
}
</style>
