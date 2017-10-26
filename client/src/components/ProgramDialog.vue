<template>
  <aside id="program-dialog"
    class="mdc-dialog"
    role="alertdialog"
    aria-labelledby="my-mdc-dialog-label"
    aria-describedby="my-mdc-dialog-description">
    <div class="mdc-dialog__surface">
      <header class="mdc-dialog__header">
        <h2 id="my-mdc-dialog-label" class="mdc-dialog__header__title">
          {{ program.name }}
        </h2>
      </header>
      <section id="my-mdc-dialog-description" class="mdc-dialog__body mdc-dialog__body--scrollable">
        <div class="mdc-textfield mdc-textfield--fullwidth mdc-textfield--with-trailing-icon" v-bind:class="{ 'mdc-textfield--upgraded' : program.name }">
          <i class="material-icons mdc-textfield__icon" tabindex="0">label</i>
          <input type="text" id="name" class="mdc-textfield__input" :value="program.name" v-model.lazy="program.name">
          <label for="name" class="mdc-textfield__label" v-bind:class="{ 'mdc-textfield__label--float-above' : program.name }">Name</label>
        </div>
        <div class="thumbnail" v-on:click="$event.currentTarget.querySelector('input').click()">
          <i class="material-icons">edit</i>
          <img :src="program.thumbnail"/>
          <input type="file" name="file" accept="image/*" class="input-file" v-on:change="fileChange($event.target.name, $event.target.files);" style="display: none;">
        </div>
      </section>
      <footer class="mdc-dialog__footer">
        <div style="margin-right: auto;">
          <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--delete" v-on:click="deleteProgram">
            <i class="material-icons mdc-button__icon">delete</i>
            <span>Delete</span>
          </button>
        </div>
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel" v-on:click="close"><i class="material-icons mdc-button__icon">clear</i><span>Cancel</span></button>
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept mdc-button--raised" v-on:click="confirm"><i class="material-icons mdc-button__icon">check</i><span>Update</span></button>
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
  name: 'ProgramDialog',
  data () {
    return {
      dialog: null,
      program: {}
    }
  },
  mounted () {
    this.dialog = new dialog.MDCDialog(this.$el)
    textfield.MDCTextfield.attachTo(this.$el.querySelector('.mdc-textfield'))
    Event.$on('programDialog.show', this.show)
    Event.$on('programDialog.close', this.close)
  },
  methods: {
    show: function (program) {
      this.program = assign({}, program)
      this.$el.querySelector('input[type=file]').value = null
      this.dialog.show()
    },
    close: function () {
      this.dialog.close()
    },
    confirm: function () {
      Event.$emit('program.update', this.program, this.$el.querySelector('input[type=file]').files[0])
      this.close()
    },
    fileChange: function (name, files) {
      if (files.length > 0) {
        let FR = new FileReader()
        FR.addEventListener('load', (e) => {
          this.$el.querySelector('img').src = e.target.result
        })
        FR.readAsDataURL(files[0])
      }
    },
    deleteProgram: function () {
      Event.$emit('program.delete', this.program)
      this.close()
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

.mdc-dialog__body .thumbnail {
  position: relative;
  cursor: pointer;
  text-align: center;
}

.mdc-dialog__body .thumbnail .material-icons {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px;
}

.mdc-dialog__body .thumbnail:not(:hover) .material-icons {
  display: none;
}

.mdc-dialog__body .thumbnail img {
  object-fit: contain;
  min-height: 100px;
  max-width: 100%;
  background: transparent;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url("\
  data:image/svg+xml;utf8, \
    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='170px' height='50px'> \
      <rect x='0' y='0' width='200' height='100'\
        style='fill: transparent; fill-opacity: 0.7; '/> \
      <text x='85' y='28' \
        style='text-anchor: middle' font-size='16'> \
        Thumbnail \
      </text> \
    </svg>\
  ");
}

/* fix mdc-textfield--fullwidth padding */
.mdc-textfield--fullwidth:not(.mdc-textfield--textarea) .mdc-textfield__input {
  padding: 10px 0;
}

.mdc-button .mdc-button__icon {
  line-height: 32px;
  vertical-align: initial;
}

@media screen and (max-width: 480px) {
  .mdc-button span {
    display: none;
  }
}
@media screen and (min-width: 481px) {
  .mdc-button .mdc-button__icon {
    display: none;
  }
}

.mdc-dialog__footer__button--delete {
  color: red;
}
</style>
