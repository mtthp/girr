webpackJsonp([1],{

/***/ "+ac5":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "/Bag":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"app"}},[_c('router-view'),_vm._v(" "),_c('Snackbar')],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "/WJU":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_MediaTile_vue__ = __webpack_require__("cpbg");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7a11e66c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_MediaTile_vue__ = __webpack_require__("kysZ");
function injectStyle (ssrContext) {
  __webpack_require__("pZxc")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7a11e66c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_MediaTile_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7a11e66c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_MediaTile_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 0:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "20bV":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_material_components_web__ = __webpack_require__("Qj28");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__MediaTile__ = __webpack_require__("/WJU");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['topic'],
  data: function data() {
    return {
      timePlayed: !this.topic.started ? 0 : (this.topic.ended ? new Date(this.topic.ended).getTime() : new Date().getTime()) - new Date(this.topic.started).getTime(),
      medias: []
    };
  },

  components: {
    MediaTile: __WEBPACK_IMPORTED_MODULE_2__MediaTile__["a" /* default */]
  },
  created: function created() {
    var _this = this;

    this.topic.expanded = false;
    this.$options.sockets['topics.' + this.topic._id + '.delete'] = function (data) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.deleted', data);
    };
    this.$options.sockets['topics.' + this.topic._id] = function (data) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.updated', data);
    };
    this.$options.sockets['medias.add'] = function (media) {
      if (media.topic === this.topic._id) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.' + this.topic._id + '.media.added', media);
      }
    }.bind(this);
    if (this.topic.started !== null && this.topic.ended === null) {
      this.timePlayedHandler = window.setInterval(function () {
        _this.timePlayed = !_this.topic.started ? 0 : (_this.topic.ended ? new Date(_this.topic.ended).getTime() : new Date().getTime()) - new Date(_this.topic.started).getTime();
      }, 1000);
    }
    this.fetchMedias();
  },

  watch: {
    'topic.started': function topicStarted(value) {
      var _this2 = this;

      if (value !== null && this.topic.ended === null) {
        this.timePlayedHandler = window.setInterval(function () {
          _this2.timePlayed = !_this2.topic.started ? 0 : (_this2.topic.ended ? new Date(_this2.topic.ended).getTime() : new Date().getTime()) - new Date(_this2.topic.started).getTime();
        }, 1000);
      }
    },
    'topic.ended': function topicEnded(value) {
      if (value !== null && this.topic.started !== null) {
        window.clearInterval(this.timePlayedHandler);
      }
    }
  },
  mounted: function mounted() {
    // code here executes once the component is rendered
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_material_components_web__["a" /* autoInit */])(this.$el); // reapply MDCRipple to all mdc-list-item
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.update', function (dialogTopic, dialogMedias) {
      if (dialogTopic._id === this.topic._id) {
        // parcours des Topic's medias pour savoir lesquels sont à supprimer
        topicMediasLoop: for (var i = 0; i < this.medias.length; i++) {
          for (var j = 0; j < dialogMedias.length; j++) {
            if (this.medias[i]._id === dialogMedias[j]._id) {
              continue topicMediasLoop;
            }
          }
          this.deleteMedia(this.medias[i]);
        }

        // parcours des Dialog's medias pour savoir lesquels sont à ajouter
        dialogMedias.forEach(function (dialogMedia) {
          if (!dialogMedia._id && dialogMedia.file) {
            this.addMedia(dialogMedia.file);
          }
        }.bind(this));
      }
    }.bind(this));
    // remove this to expand multiple topics at the same time
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.toggle', function (topic) {
      if (this.topic !== topic) {
        this.topic.expanded = false;
        this.$forceUpdate();
      }
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.' + this.topic._id + '.media.added', function (media) {
      var index = this.medias.indexOf(this.medias.find(function (topicMedia) {
        return topicMedia._id === media._id;
      }));
      if (index < 0) this.medias.push(media);
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.' + this.topic._id + '.media.updated', function (media) {
      for (var i = 0; i < this.medias.length; i++) {
        if (this.medias[i]._id === media._id) {
          this.medias[i] = media;
          this.$forceUpdate();
          break;
        }
      }
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.' + this.topic._id + '.media.deleted', function (media) {
      var index = this.medias.indexOf(this.medias.find(function (topicMedia) {
        return topicMedia._id === media._id;
      }));
      if (index > -1) this.medias.splice(index, 1);
    }.bind(this));
  },

  methods: {
    fetchMedias: function fetchMedias() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topic._id + '/medias').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        this.medias = response.body;
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    toggle: function toggle(bool) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.toggle', this.topic);
      this.topic.expanded = bool;
      this.$forceUpdate();
    },
    editTopic: function editTopic(event) {
      event.stopImmediatePropagation();
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topicDialog.show', this.topic, this.medias);
    },
    start: function start(event) {
      event.stopImmediatePropagation();
      this.toggle(true);
      this.timePlayed = 0;
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.start', this.topic);
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('xsplit.update', { title: this.topic.title, picture: null });
    },
    stop: function stop(event) {
      event.stopImmediatePropagation();
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.stop', this.topic);
    },
    addMedia: function addMedia(file) {
      var formData = new FormData();
      formData.append('file', file);
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.post('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topic._id + '/medias/', formData).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        // Event.$emit('topic.' + this.topic._id + '.media.updated', response.body)
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.' + this.topic._id + '.media.added', response.body);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Added ' + response.body.label);
      }.bind(this), function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    deleteMedia: function deleteMedia(media) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.delete('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topic._id + '/medias/' + media._id).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.' + this.topic._id + '.media.deleted', media);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Media ' + media.label + ' deleted');
      }.bind(this), function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    }
  }
});

/***/ }),

/***/ "2JC6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _vm._m(0)}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"empty-state"},[_c('h3',[_vm._v("Oops ! It looks like empty in here")]),_vm._v(" "),_c('i',{staticClass:"large material-icons"},[_vm._v("priority_high")]),_vm._v(" "),_c('p',[_vm._v("You can add something by clicking on the Add (+) button")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "2mhm":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_material_components_web__ = __webpack_require__("Qj28");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_object_assign__ = __webpack_require__("BEQ0");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_object_assign__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'TopicDialog',
  data: function data() {
    return {
      dialog: null,
      topic: {},
      medias: []
    };
  },
  mounted: function mounted() {
    this.dialog = new __WEBPACK_IMPORTED_MODULE_1_material_components_web__["f" /* dialog */].MDCDialog(this.$el);
    __WEBPACK_IMPORTED_MODULE_1_material_components_web__["c" /* textfield */].MDCTextfield.attachTo(this.$el.querySelector('.mdc-textfield'));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topicDialog.show', this.show);
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topicDialog.close', this.close);
  },

  methods: {
    show: function show(topic, medias) {
      this.topic = __WEBPACK_IMPORTED_MODULE_2_object_assign___default()({}, topic);
      this.medias = __WEBPACK_IMPORTED_MODULE_2_object_assign___default()([], medias);
      this.$el.querySelector('textarea').value = this.topic.description ? this.topic.description : '';
      this.dialog.show();
    },
    close: function close() {
      this.dialog.close();
    },
    confirm: function confirm() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.update', this.topic, this.medias);
    },
    deleteTopic: function deleteTopic() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.delete', this.topic);
      this.close();
    },
    fileChange: function fileChange(name, files) {
      if (files.length > 0) {
        var FR = new FileReader();
        FR.addEventListener('load', function (e) {
          this.medias.push({ uri: e.target.result, label: files[0].name, file: files[0] });
          console.log(this.medias);
        }.bind(this));
        FR.readAsDataURL(files[0]);
      }
    },
    deleteMedia: function deleteMedia(media) {
      var index = this.medias.indexOf(this.medias.find(function (dialogMedia) {
        return dialogMedia === media;
      }));
      if (index > -1) this.medias.splice(index, 1);
      // Event.$emit('topic.medias.delete', this.topic, media)
    }
  }
});

/***/ }),

/***/ "4EFq":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('Toolbar',{attrs:{"title":_vm.program.name}}),_vm._v(" "),_c('main',{staticClass:"mdc-toolbar-fixed-adjust",class:{ empty: _vm.episodes.length == 0 }},[_c('div',{staticClass:"program"},[_c('EpisodeDialog'),_vm._v(" "),(_vm.episodes && _vm.episodes.length > 0)?_c('div',{staticClass:"episodes"},_vm._l((_vm.episodes),function(episode){return _c('router-link',{key:episode._id,staticClass:"episode-card",attrs:{"to":{ name: 'Episode', params: { programId: _vm.program._id, episodeId: episode._id }}}},[_c('EpisodeCard',{attrs:{"episode":episode}})],1)})):_c('EmptyState'),_vm._v(" "),_c('button',{staticClass:"mdc-fab material-icons fab",attrs:{"aria-label":"add","data-mdc-auto-init":"MDCRipple"},on:{"click":_vm.addEpisode}},[_c('span',{staticClass:"mdc-fab__icon"},[_vm._v("\n          add\n        ")])])],1)])],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "4sha":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_material_components_web__ = __webpack_require__("Qj28");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_object_assign__ = __webpack_require__("BEQ0");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_object_assign__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'EpisodeDialog',
  data: function data() {
    return {
      dialog: null,
      episode: {}
    };
  },
  mounted: function mounted() {
    this.dialog = new __WEBPACK_IMPORTED_MODULE_1_material_components_web__["f" /* dialog */].MDCDialog(this.$el);
    __WEBPACK_IMPORTED_MODULE_1_material_components_web__["c" /* textfield */].MDCTextfield.attachTo(this.$el.querySelector('.mdc-textfield'));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('episodeDialog.show', this.show);
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('episodeDialog.close', this.close);
  },

  methods: {
    show: function show(episode) {
      if (this.episode._id !== episode._id) {
        this.episode = __WEBPACK_IMPORTED_MODULE_2_object_assign___default()({}, episode);
      }
      this.dialog.show();
    },
    close: function close() {
      this.dialog.close();
    },
    confirm: function confirm() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('episode.update', this.episode);
    },
    deleteEpisode: function deleteEpisode() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('episode.delete', this.episode);
      this.close();
    }
  }
});

/***/ }),

/***/ "4x6I":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Drawer__ = __webpack_require__("SczH");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_EventBus_js__ = __webpack_require__("c2lU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_material_components_web__ = __webpack_require__("Qj28");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




// toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'))
// tb.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust')

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'Toolbar',
  props: ['title'],
  components: { Drawer: __WEBPACK_IMPORTED_MODULE_0__Drawer__["a" /* default */] },
  mounted: function mounted() {
    __WEBPACK_IMPORTED_MODULE_1__utils_EventBus_js__["a" /* default */].$on('progressbar.toggle', this.toggleProgressBar);
    this.$el.querySelector('.menu').addEventListener('click', function () {
      __WEBPACK_IMPORTED_MODULE_1__utils_EventBus_js__["a" /* default */].$emit('drawer.toggle', true);
    });

    this.tb = __WEBPACK_IMPORTED_MODULE_2_material_components_web__["d" /* toolbar */].MDCToolbar.attachTo(this.$el);
    this.tb.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');
    // this.tb.listen('MDCToolbar:change', function (evt) {
    //   var flexibleExpansionRatio = evt.detail.flexibleExpansionRatio
    //   console.log(flexibleExpansionRatio.toFixed(2))
    // })
  },
  watch: {
    title: function title(newTitle) {
      document.title = newTitle + ' - GIRR';
    }
  },
  methods: {
    toggleProgressBar: function toggleProgressBar(bool) {
      if (bool) {
        this.$el.querySelector('.mdc-linear-progress').classList.add('mdc-linear-progress--indeterminate');
      } else {
        this.$el.querySelector('.mdc-linear-progress').classList.remove('mdc-linear-progress--indeterminate');
      }
    }
  }
});

/***/ }),

/***/ "52aM":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('aside',{staticClass:"mdc-dialog",attrs:{"id":"program-dialog","role":"alertdialog","aria-labelledby":"my-mdc-dialog-label","aria-describedby":"my-mdc-dialog-description"}},[_c('div',{staticClass:"mdc-dialog__surface"},[_c('header',{staticClass:"mdc-dialog__header"},[_c('h2',{staticClass:"mdc-dialog__header__title",attrs:{"id":"my-mdc-dialog-label"}},[_vm._v("\n        "+_vm._s(_vm.program.name)+"\n      ")])]),_vm._v(" "),_c('section',{staticClass:"mdc-dialog__body mdc-dialog__body--scrollable",attrs:{"id":"my-mdc-dialog-description"}},[_c('div',{staticClass:"mdc-textfield mdc-textfield--fullwidth mdc-textfield--with-trailing-icon",class:{ 'mdc-textfield--upgraded' : _vm.program.name }},[_c('i',{staticClass:"material-icons mdc-textfield__icon",attrs:{"tabindex":"0"}},[_vm._v("label")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model.lazy",value:(_vm.program.name),expression:"program.name",modifiers:{"lazy":true}}],staticClass:"mdc-textfield__input",attrs:{"type":"text","id":"name"},domProps:{"value":_vm.program.name,"value":(_vm.program.name)},on:{"change":function($event){_vm.program.name=$event.target.value}}}),_vm._v(" "),_c('label',{staticClass:"mdc-textfield__label",class:{ 'mdc-textfield__label--float-above' : _vm.program.name },attrs:{"for":"name"}},[_vm._v("Name")])]),_vm._v(" "),_c('div',{staticClass:"thumbnail",on:{"click":function($event){$event.currentTarget.querySelector('input').click()}}},[_c('i',{staticClass:"material-icons"},[_vm._v("edit")]),_vm._v(" "),_c('img',{attrs:{"src":_vm.program.thumbnail}}),_vm._v(" "),_c('input',{staticClass:"input-file",staticStyle:{"display":"none"},attrs:{"type":"file","name":"file","accept":"image/*"},on:{"change":function($event){_vm.fileChange($event.target.name, $event.target.files);}}})])]),_vm._v(" "),_c('footer',{staticClass:"mdc-dialog__footer"},[_c('div',{staticStyle:{"margin-right":"auto"}},[_c('button',{staticClass:"mdc-button mdc-dialog__footer__button delete",attrs:{"type":"button"},on:{"click":_vm.deleteProgram}},[_c('i',{staticClass:"material-icons mdc-button__icon"},[_vm._v("delete")]),_vm._v("\n          Delete\n        ")])]),_vm._v(" "),_c('button',{staticClass:"mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel",attrs:{"type":"button"}},[_vm._v("Cancel")]),_vm._v(" "),_c('button',{staticClass:"mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept",attrs:{"type":"button"},on:{"click":_vm.confirm}},[_vm._v("Update")])])]),_vm._v(" "),_c('div',{staticClass:"mdc-dialog__backdrop"})])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "5Uh1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_TopicCard_vue__ = __webpack_require__("20bV");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_35c71677_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_TopicCard_vue__ = __webpack_require__("ra8+");
function injectStyle (ssrContext) {
  __webpack_require__("LLjd")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-35c71677"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_TopicCard_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_35c71677_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_TopicCard_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "6nRR":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('Toolbar',{attrs:{"title":'Administration'}}),_vm._v(" "),_c('main',{staticClass:"mdc-toolbar-fixed-adjust"},[_c('div',{staticClass:"mdc-textfield mdc-textfield--fullwidth mdc-textfield--with-trailing-icon",class:{ 'mdc-textfield--upgraded' : _vm.xsplit.title }},[_c('i',{staticClass:"material-icons mdc-textfield__icon",attrs:{"tabindex":"0"}},[_vm._v("label")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model.lazy",value:(_vm.xsplit.title),expression:"xsplit.title",modifiers:{"lazy":true}}],staticClass:"mdc-textfield__input",attrs:{"type":"text","id":"title"},domProps:{"value":_vm.xsplit.title,"value":(_vm.xsplit.title)},on:{"input":function($event){_vm.updateXsplit({title: $event.target.value})},"change":function($event){_vm.xsplit.title=$event.target.value}}}),_vm._v(" "),_c('label',{staticClass:"mdc-textfield__label",class:{ 'mdc-textfield__label--float-above' : _vm.xsplit.title },attrs:{"for":"title"}},[_vm._v("Title")])]),_vm._v(" "),_c('div',{staticClass:"mdc-textfield mdc-textfield--fullwidth mdc-textfield--with-trailing-icon",class:{ 'mdc-textfield--upgraded' : _vm.xsplit.picture }},[_c('i',{staticClass:"material-icons mdc-textfield__icon",attrs:{"tabindex":"0"}},[_vm._v("photo")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model.lazy",value:(_vm.xsplit.picture),expression:"xsplit.picture",modifiers:{"lazy":true}}],staticClass:"mdc-textfield__input",attrs:{"type":"text","id":"picture"},domProps:{"value":_vm.xsplit.picture,"value":(_vm.xsplit.picture)},on:{"change":[function($event){_vm.xsplit.picture=$event.target.value},function($event){_vm.updateXsplit({picture: $event.target.value})}]}}),_vm._v(" "),_c('label',{staticClass:"mdc-textfield__label",class:{ 'mdc-textfield__label--float-above' : _vm.xsplit.picture },attrs:{"for":"picture"}},[_vm._v("Picture")])]),_vm._v(" "),_c('iframe',{attrs:{"src":_vm.xsplitPath}})])],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "90zI":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('aside',{staticClass:"mdc-dialog",attrs:{"id":"topic-dialog","role":"alertdialog","aria-labelledby":"my-mdc-dialog-label","aria-describedby":"my-mdc-dialog-description"}},[_c('div',{staticClass:"mdc-dialog__surface"},[_c('header',{staticClass:"mdc-dialog__header"},[_c('h2',{staticClass:"mdc-dialog__header__title",attrs:{"id":"my-mdc-dialog-label"}},[_vm._v("\n        "+_vm._s(_vm.topic.title)+"\n      ")])]),_vm._v(" "),_c('section',{staticClass:"mdc-dialog__body mdc-dialog__body--scrollable",attrs:{"id":"my-mdc-dialog-description"}},[_c('div',{staticClass:"mdc-textfield",class:{ 'mdc-textfield--upgraded' : _vm.topic.title }},[_c('input',{directives:[{name:"model",rawName:"v-model.lazy",value:(_vm.topic.title),expression:"topic.title",modifiers:{"lazy":true}}],staticClass:"mdc-textfield__input",attrs:{"type":"text","id":"title"},domProps:{"value":_vm.topic.title,"value":(_vm.topic.title)},on:{"change":function($event){_vm.topic.title=$event.target.value}}}),_vm._v(" "),_c('label',{staticClass:"mdc-textfield__label",class:{ 'mdc-textfield__label--float-above' : _vm.topic.title },attrs:{"for":"title"}},[_vm._v("Title")])]),_vm._v(" "),_c('div',{staticClass:"mdc-textfield mdc-textfield--fullwidth mdc-textfield--textarea"},[_c('textarea',{directives:[{name:"model",rawName:"v-model.lazy",value:(_vm.topic.description),expression:"topic.description",modifiers:{"lazy":true}}],staticClass:"mdc-textfield__input",attrs:{"id":"description","rows":"8","placeholder":"Description"},domProps:{"value":(_vm.topic.description)},on:{"change":function($event){_vm.topic.description=$event.target.value}}},[_vm._v(_vm._s(_vm.topic.description))])]),_vm._v(" "),_c('div',{staticClass:"mdc-grid-list"},[_c('ul',{staticClass:"mdc-grid-list__tiles"},_vm._l((_vm.medias),function(media){return _c('li',{staticClass:"mdc-grid-tile"},[_c('div',{staticClass:"mdc-grid-tile__primary"},[_c('img',{staticClass:"mdc-grid-tile__primary-content",attrs:{"src":media.uri}}),_vm._v(" "),_c('i',{staticClass:"material-icons",on:{"click":function($event){_vm.deleteMedia(media)}}},[_vm._v("cancel")])]),_vm._v(" "),_c('span',{staticClass:"mdc-grid-tile__secondary"},[_c('span',{staticClass:"mdc-grid-tile__title"},[_vm._v(_vm._s(media.label))])])])}))])]),_vm._v(" "),_c('footer',{staticClass:"mdc-dialog__footer"},[_c('div',{staticStyle:{"margin-right":"auto"}},[_c('button',{staticClass:"mdc-button mdc-dialog__footer__button delete",attrs:{"type":"button"},on:{"click":_vm.deleteTopic}},[_c('i',{staticClass:"material-icons mdc-button__icon"},[_vm._v("delete")]),_vm._v("\n          Delete\n        ")]),_vm._v(" "),_c('button',{staticClass:"mdc-button mdc-dialog__footer__button upload",attrs:{"type":"button"},on:{"click":function($event){$event.currentTarget.querySelector('input').click()}}},[_c('input',{staticClass:"input-file",staticStyle:{"display":"none"},attrs:{"type":"file","name":"file","accept":"image/*"},on:{"change":function($event){_vm.fileChange($event.target.name, $event.target.files);}}}),_vm._v(" "),_c('i',{staticClass:"material-icons mdc-button__icon"},[_vm._v("file_upload")]),_vm._v("\n          Upload\n        ")])]),_vm._v(" "),_c('button',{staticClass:"mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel",attrs:{"type":"button"}},[_vm._v("Cancel")]),_vm._v(" "),_c('button',{staticClass:"mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept",attrs:{"type":"button"},on:{"click":_vm.confirm}},[_vm._v("Update")])])]),_vm._v(" "),_c('div',{staticClass:"mdc-dialog__backdrop"})])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "AxwS":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('Toolbar',{attrs:{"title":_vm.programs.length + ' Programs'}}),_vm._v(" "),_c('main',{staticClass:"mdc-toolbar-fixed-adjust",class:{ empty: _vm.programs.length == 0 }},[(_vm.programs.length > 0)?_c('div',{staticClass:"programs"},[_c('ProgramDialog'),_vm._v(" "),_vm._l((_vm.programs),function(program){return _c('router-link',{key:program._id,staticClass:"program-card",attrs:{"to":{ name: 'Program', params: { programId: program._id }}}},[_c('ProgramCard',{attrs:{"program":program}})],1)})],2):_c('EmptyState'),_vm._v(" "),_c('button',{staticClass:"mdc-fab material-icons fab",attrs:{"aria-label":"add","data-mdc-auto-init":"MDCRipple"},on:{"click":_vm.addProgram}},[_c('span',{staticClass:"mdc-fab__icon"},[_vm._v("\n        add\n      ")])])],1)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "BguB":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "Br1U":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EpisodeCard__ = __webpack_require__("Byev");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__EpisodeDialog__ = __webpack_require__("Eym9");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Toolbar__ = __webpack_require__("djO7");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__EmptyState__ = __webpack_require__("YOpi");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




// import { menu } from 'material-components-web'



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'program',
  components: {
    EpisodeCard: __WEBPACK_IMPORTED_MODULE_1__EpisodeCard__["a" /* default */],
    EpisodeDialog: __WEBPACK_IMPORTED_MODULE_2__EpisodeDialog__["a" /* default */],
    Toolbar: __WEBPACK_IMPORTED_MODULE_3__Toolbar__["a" /* default */],
    EmptyState: __WEBPACK_IMPORTED_MODULE_4__EmptyState__["a" /* default */]
  },
  data: function data() {
    return {
      program: {},
      episodes: []
    };
  },
  created: function created() {
    this.fetchData();
    this.$options.sockets['episodes.add'] = function (episode) {
      if (episode.program === this.program._id) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('episode.added', episode);
      }
    }.bind(this);
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('episode.update', function (episode) {
      this.updateEpisode(episode);
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('episode.delete', function (episode) {
      this.deleteEpisode(episode);
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('episode.added', function (episode) {
      var index = this.episodes.indexOf(this.episodes.find(function (programEpisode) {
        return programEpisode._id === episode._id;
      }));
      if (index < 0) {
        this.episodes.unshift(episode);
      }
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('episode.updated', function (episode) {
      for (var i = 0; i < this.episodes.length; i++) {
        if (this.episodes[i]._id === episode._id) {
          this.episodes[i] = episode;
          this.$forceUpdate();
          break;
        }
      }
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('episode.deleted', function (episode) {
      var index = this.episodes.indexOf(this.episodes.find(function (programEpisode) {
        return programEpisode._id === episode._id;
      }));
      if (index > -1) {
        this.episodes.splice(index, 1);
      }
    }.bind(this));
  },

  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData: function fetchData() {
      this.program = {}; // reset the program
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/programs/' + this.$route.params.programId).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        this.program = response.body;
        this.$options.sockets['programs.' + this.program._id] = function (data) {
          this.program = data;
        }.bind(this);
        this.fetchEpisodes();
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('title.change', this.program.name);
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    fetchEpisodes: function fetchEpisodes() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        this.episodes = response.body;
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    addEpisode: function addEpisode() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.post('/api/programs/' + this.$route.params.programId + '/episodes/').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('episode.added', response.body);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Added a new episode');
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    updateEpisode: function updateEpisode(episode) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.put('/api/programs/' + this.$route.params.programId + '/episodes/' + episode._id, episode).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('episode.updated', response.body);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Episode ' + response.body.name + ' updated');
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    deleteEpisode: function deleteEpisode(episode) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.delete('/api/programs/' + this.$route.params.programId + '/episodes/' + episode._id).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('episode.deleted', episode);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Episode ' + episode.name + ' deleted');
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    }
  }
});

/***/ }),

/***/ "Byev":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_EpisodeCard_vue__ = __webpack_require__("jxgD");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5e46497a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_EpisodeCard_vue__ = __webpack_require__("PbM1");
function injectStyle (ssrContext) {
  __webpack_require__("r7mh")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-5e46497a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_EpisodeCard_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5e46497a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_EpisodeCard_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "CTM6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_TopicDialog_vue__ = __webpack_require__("2mhm");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b4047622_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_TopicDialog_vue__ = __webpack_require__("90zI");
function injectStyle (ssrContext) {
  __webpack_require__("ZJeV")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-b4047622"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_TopicDialog_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b4047622_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_TopicDialog_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "EL+O":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_material_components_web__ = __webpack_require__("Qj28");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_EventBus_js__ = __webpack_require__("c2lU");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  mounted: function mounted() {
    this.dw = new __WEBPACK_IMPORTED_MODULE_0_material_components_web__["e" /* drawer */].MDCTemporaryDrawer(this.$el);
    __WEBPACK_IMPORTED_MODULE_1__utils_EventBus_js__["a" /* default */].$on('drawer.toggle', this.toggleDrawer);
  },
  methods: {
    toggleDrawer: function toggleDrawer(bool) {
      this.dw.open = bool;

      // fix body.mdc-drawer-scroll-lock when changing routes
      if (!this.dw.open) {
        document.querySelector('body').classList.remove('mdc-drawer-scroll-lock');
      }
    }
  }
});

/***/ }),

/***/ "Eym9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_EpisodeDialog_vue__ = __webpack_require__("4sha");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5a94f28a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_EpisodeDialog_vue__ = __webpack_require__("gqBe");
function injectStyle (ssrContext) {
  __webpack_require__("qosH")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-5a94f28a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_EpisodeDialog_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5a94f28a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_EpisodeDialog_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "FvRa":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('Toolbar',{attrs:{"title":_vm.episode.name}}),_vm._v(" "),_c('main',{staticClass:"mdc-toolbar-fixed-adjust",class:{ empty: _vm.topics.length == 0 }},[_c('div',{staticClass:"episode"},[_c('TopicDialog'),_vm._v(" "),(_vm.topics.length > 0)?_c('draggable',{staticClass:"topics mdc-list mdc-list--avatar-list mdc-list--two-line",attrs:{"element":"ul","options":_vm.dragOptions},on:{"change":_vm.itemMoved},model:{value:(_vm.topics),callback:function ($$v) {_vm.topics=$$v},expression:"topics"}},[_c('transition-group',{attrs:{"name":"fade"}},_vm._l((_vm.topics),function(topic){return _c('TopicCard',{key:topic._id,attrs:{"topic":topic}})}))],1):_c('EmptyState'),_vm._v(" "),_c('button',{staticClass:"mdc-fab material-icons fab",attrs:{"aria-label":"add","data-mdc-auto-init":"MDCRipple"},on:{"click":_vm.addTopic}},[_c('span',{staticClass:"mdc-fab__icon"},[_vm._v("\n          add\n        ")])])],1)])],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "HIro":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "JFVs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('aside',{staticClass:"mdc-temporary-drawer mdc-typography"},[_c('nav',{staticClass:"mdc-temporary-drawer__drawer"},[_vm._m(0),_vm._v(" "),_c('nav',{staticClass:"mdc-temporary-drawer__content mdc-list",attrs:{"id":"icon-with-text-demo"}},[_c('router-link',{staticClass:"mdc-list-item",attrs:{"to":{ name: 'Programs' },"active-class":"mdc-temporary-drawer--selected","data-mdc-auto-init":"MDCRipple"},nativeOn:{"click":function($event){_vm.toggleDrawer(false)}}},[_c('i',{staticClass:"material-icons mdc-list-item__start-detail",attrs:{"aria-hidden":"true"}},[_vm._v("event")]),_vm._v("Programs\n        ")]),_vm._v(" "),_c('router-link',{staticClass:"mdc-list-item",attrs:{"to":{ name: 'Xsplit' },"active-class":"mdc-temporary-drawer--selected","data-mdc-auto-init":"MDCRipple"},nativeOn:{"click":function($event){_vm.toggleDrawer(false)}}},[_c('i',{staticClass:"material-icons mdc-list-item__start-detail",attrs:{"aria-hidden":"true"}},[_vm._v("tv")]),_vm._v("Xsplit\n        ")]),_vm._v(" "),_c('router-link',{staticClass:"mdc-list-item",attrs:{"to":{ name: 'Admin' },"active-class":"mdc-temporary-drawer--selected","data-mdc-auto-init":"MDCRipple"},nativeOn:{"click":function($event){_vm.toggleDrawer(false)}}},[_c('i',{staticClass:"material-icons mdc-list-item__start-detail",attrs:{"aria-hidden":"true"}},[_vm._v("build")]),_vm._v("Admin\n        ")]),_vm._v(" "),_vm._m(1)],1)])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('header',{staticClass:"mdc-temporary-drawer__header"},[_c('div',{staticClass:"mdc-temporary-drawer__header-content"},[_vm._v("\n              GeekInc Remote Regie\n          ")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('a',{staticClass:"mdc-list-item",attrs:{"href":"/api/","target":"_blank","data-mdc-auto-init":"MDCRipple"}},[_c('i',{staticClass:"material-icons mdc-list-item__start-detail",attrs:{"aria-hidden":"true"}},[_vm._v("code")]),_vm._v("API\n        ")])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "JO/H":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_material_components_web__ = __webpack_require__("Qj28");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['program'],
  created: function created() {
    this.$options.sockets['programs.' + this.program._id + '.delete'] = function (data) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('program.deleted', data);
    };
    this.$options.sockets['programs.' + this.program._id] = function (data) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('program.updated', data);
    };
  },
  mounted: function mounted() {
    this.menu = new __WEBPACK_IMPORTED_MODULE_1_material_components_web__["g" /* menu */].MDCSimpleMenu(this.$el.querySelector('.mdc-simple-menu'));
    // Add event listener to some button to toggle the menu on and off.
    this.$el.querySelector('.toggle-menu').addEventListener('click', function (event) {
      event.preventDefault();
      this.menu.open = !this.menu.open;
    }.bind(this));
  },

  methods: {
    editProgram: function editProgram(event) {
      event.preventDefault();
      event.stopPropagation();
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('programDialog.show', this.program);
    },
    deleteProgram: function deleteProgram(event) {
      event.preventDefault();
      event.stopPropagation();
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('program.delete', this.program);
    }
  }
});

/***/ }),

/***/ "KS52":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Toolbar__ = __webpack_require__("djO7");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_material_components_web__ = __webpack_require__("Qj28");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'admin',
  components: {
    Toolbar: __WEBPACK_IMPORTED_MODULE_1__Toolbar__["a" /* default */]
  },
  data: function data() {
    return {
      xsplit: {}
    };
  },

  computed: {
    xsplitPath: function xsplitPath() {
      return this.$router.resolve({ name: 'Xsplit' }).href;
    }
  },
  created: function created() {
    this.getXsplit();
    this.$options.sockets['xsplit'] = function (data) {
      this.xsplit = data;
    }.bind(this);
  },
  mounted: function mounted() {
    this.$el.querySelectorAll('.mdc-textfield').forEach(function (mdlTextfield) {
      __WEBPACK_IMPORTED_MODULE_2_material_components_web__["c" /* textfield */].MDCTextfield.attachTo(mdlTextfield);
    });
  },

  watch: {
    // call again the method if the route changes
    '$route': 'getXsplit'
  },
  methods: {
    getXsplit: function getXsplit() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/xsplit/').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        this.xsplit = response.body;
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    updateXsplit: function updateXsplit(data) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.put('/api/xsplit/', data).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        this.xsplit = response.body;
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    }
  }
});

/***/ }),

/***/ "LLjd":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "M93x":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__("xJD8");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59c95520_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__("/Bag");
function injectStyle (ssrContext) {
  __webpack_require__("Pxcp")
  __webpack_require__("HIro")
  __webpack_require__("r1VF")
  __webpack_require__("+ac5")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59c95520_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "MTJT":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "NHnr":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("7+uW");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App__ = __webpack_require__("M93x");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router__ = __webpack_require__("YaEn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_resource__ = __webpack_require__("ORbq");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_socket_io__ = __webpack_require__("hMcO");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_vue_socket_io__);
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.






__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_3_vue_resource__["a" /* default */]);
__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_4_vue_socket_io___default.a, 'http://localhost:8080');

__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].config.productionTip = false;

__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].filter('formatDate', function (value) {
  if (value) {
    var date = new Date(String(value));
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  }
});

// credit https://stackoverflow.com/a/847196
__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].filter('formatTime', function (millisecondsTimestamp) {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(millisecondsTimestamp);
  // Hours part from the timestamp
  // var hours = date.getUTCHours()
  // Minutes part from the timestamp
  var minutes = '0' + date.getUTCMinutes();
  // Seconds part from the timestamp
  var seconds = '0' + date.getUTCSeconds();

  // Will display time in 30:23 format
  return minutes.substr(-2) + ':' + seconds.substr(-2);
});

/* eslint-disable no-new */
new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
  el: '#app',
  router: __WEBPACK_IMPORTED_MODULE_2__router__["a" /* default */],
  template: '<App/>',
  components: { App: __WEBPACK_IMPORTED_MODULE_1__App__["a" /* default */] }
});

/***/ }),

/***/ "OWtZ":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Episode_vue__ = __webpack_require__("i4iJ");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f22c0cda_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Episode_vue__ = __webpack_require__("FvRa");
function injectStyle (ssrContext) {
  __webpack_require__("MTJT")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-f22c0cda"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Episode_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f22c0cda_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Episode_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "PbM1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"episode mdc-card mdc-card--theme-dark ",style:(_vm.episode.thumbnail ? 'background-image: url(\'' + _vm.episode.thumbnail + '\');' : null)},[_c('section',{staticClass:"mdc-card__primary mdc-menu-anchor"},[_c('h1',{staticClass:"mdc-card__title mdc-card__title--large"},[_vm._v(_vm._s(_vm.episode.name))]),_vm._v(" "),_c('h2',{staticClass:"mdc-card__subtitle"},[_vm._v("Episode #"+_vm._s(_vm.episode.number)+" - "+_vm._s(_vm._f("formatDate")(_vm.episode.created)))]),_vm._v(" "),_c('i',{staticClass:"mdc-icon-toggle material-icons toggle-menu",attrs:{"arial-label":"Menu"}},[_vm._v("more_vert")]),_vm._v(" "),_c('div',{staticClass:"mdc-simple-menu mdc-simple-menu--open-from-bottom-right",attrs:{"tabindex":"-1"}},[_c('ul',{staticClass:"mdc-simple-menu__items mdc-list",attrs:{"role":"menu","aria-hidden":"true"}},[_c('li',{staticClass:"mdc-list-item",attrs:{"role":"menuitem","tabindex":"0"},on:{"click":function($event){_vm.editEpisode($event)}}},[_vm._v("Edit")])])])])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "Pxcp":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "QE77":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('header',{staticClass:"mdc-toolbar mdc-toolbar--fixed mdc-toolbar--waterfall"},[_c('div',{staticClass:"mdc-toolbar__row"},[_c('section',{staticClass:"mdc-toolbar__section mdc-toolbar__section--align-start"},[_c('a',{staticClass:"material-icons mdc-toolbar__icon--menu mdc-ripple-surface menu",attrs:{"aria-label":"Menu","alt":"Menu","data-mdc-auto-init":"MDCRipple"}},[_vm._v("menu")]),_vm._v(" "),_c('span',{staticClass:"mdc-toolbar__title"},[_vm._v(_vm._s(_vm.title))])])]),_vm._v(" "),_vm._m(0),_vm._v(" "),_c('drawer')],1)}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"mdc-linear-progress",attrs:{"role":"progressbar"}},[_c('div',{staticClass:"mdc-linear-progress__buffering-dots"}),_vm._v(" "),_c('div',{staticClass:"mdc-linear-progress__buffer"}),_vm._v(" "),_c('div',{staticClass:"mdc-linear-progress__bar mdc-linear-progress__primary-bar"},[_c('span',{staticClass:"mdc-linear-progress__bar-inner"})]),_vm._v(" "),_c('div',{staticClass:"mdc-linear-progress__bar mdc-linear-progress__secondary-bar"},[_c('span',{staticClass:"mdc-linear-progress__bar-inner"})])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "Qbid":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "SAZF":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Snackbar_vue__ = __webpack_require__("m5iD");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b5ad3ac6_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Snackbar_vue__ = __webpack_require__("yKfA");
function injectStyle (ssrContext) {
  __webpack_require__("BguB")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-b5ad3ac6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Snackbar_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b5ad3ac6_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Snackbar_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "SczH":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Drawer_vue__ = __webpack_require__("EL+O");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_40e6fc89_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Drawer_vue__ = __webpack_require__("JFVs");
function injectStyle (ssrContext) {
  __webpack_require__("nHYk")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-40e6fc89"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Drawer_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_40e6fc89_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Drawer_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "TFhK":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('main',{staticClass:"xsplit",style:({ 'background-image': _vm.xsplit.picture ? 'url(' + __webpack_require__("p4tO") + ')' : null })},[_c('div',{staticClass:"title"},[_vm._v(_vm._s(_vm.xsplit.title))]),_vm._v(" "),_c('div',{staticClass:"content"},[_c('img',{class:{ loading: _vm.xsplit.picture },attrs:{"src":_vm.xsplit.picture},on:{"load":function($event){_vm.loaded($event)},"error":function($event){_vm.failed($event)}}})])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "VY5o":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Program_vue__ = __webpack_require__("Br1U");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0a61ed9c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Program_vue__ = __webpack_require__("4EFq");
function injectStyle (ssrContext) {
  __webpack_require__("Viyp")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0a61ed9c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Program_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0a61ed9c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Program_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "Viyp":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "VsIg":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'EmptyState'
});

/***/ }),

/***/ "WoG/":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "YOpi":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_EmptyState_vue__ = __webpack_require__("VsIg");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6321795c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_EmptyState_vue__ = __webpack_require__("2JC6");
function injectStyle (ssrContext) {
  __webpack_require__("yK37")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6321795c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_EmptyState_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6321795c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_EmptyState_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "YaEn":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("7+uW");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__("/ocq");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_Programs__ = __webpack_require__("thgl");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_Program__ = __webpack_require__("VY5o");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Episode__ = __webpack_require__("OWtZ");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_Xsplit__ = __webpack_require__("aOBf");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_Admin__ = __webpack_require__("qbhH");








__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]({
  routes: [{
    name: 'Root',
    path: '/',
    component: __WEBPACK_IMPORTED_MODULE_2__components_Programs__["a" /* default */]
  }, {
    name: 'Programs',
    path: '/programs',
    component: __WEBPACK_IMPORTED_MODULE_2__components_Programs__["a" /* default */]
  }, {
    name: 'Program',
    path: '/programs/:programId',
    component: __WEBPACK_IMPORTED_MODULE_3__components_Program__["a" /* default */]
  }, {
    name: 'Episode',
    path: '/programs/:programId/episodes/:episodeId',
    component: __WEBPACK_IMPORTED_MODULE_4__components_Episode__["a" /* default */]
  }, {
    name: 'Admin',
    path: '/admin',
    component: __WEBPACK_IMPORTED_MODULE_6__components_Admin__["a" /* default */]
  }, {
    name: 'Xsplit',
    path: '/xsplit',
    component: __WEBPACK_IMPORTED_MODULE_5__components_Xsplit__["a" /* default */]
  }]
}));

/***/ }),

/***/ "ZJeV":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "aOBf":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Xsplit_vue__ = __webpack_require__("zaKv");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7bb62e8c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Xsplit_vue__ = __webpack_require__("TFhK");
function injectStyle (ssrContext) {
  __webpack_require__("nnrY")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7bb62e8c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Xsplit_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7bb62e8c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Xsplit_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "c2lU":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("7+uW");


/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
    // data
    // methods
    // watch
}));

/***/ }),

/***/ "cpbg":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['media', 'topicId'],
  created: function created() {
    this.$options.sockets['medias.' + this.media._id + '.delete'] = function (data) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.' + this.topicId + '.media.deleted', data);
    };
    this.$options.sockets['medias.' + this.media._id] = function (data) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.' + this.topicId + '.media.updated', data);
    };
  },

  methods: {
    startMedia: function startMedia(media) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topicId + '/medias/' + media._id + '/start').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.' + this.topicId + '.media.updated', response.body);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Media ' + response.body.label + ' started');
      }.bind(this), function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    stopMedia: function stopMedia(media) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + this.topicId + '/medias/' + media._id + '/stop').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.' + this.topicId + '.media.updated', response.body);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Media ' + response.body.label + ' stopped');
      }.bind(this), function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    toggleMedia: function toggleMedia(media) {
      if (media.started && !media.ended) {
        this.stopMedia(media);
      } else {
        this.startMedia(media);
      }
    }
  }
});

/***/ }),

/***/ "djO7":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Toolbar_vue__ = __webpack_require__("4x6I");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3a610713_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Toolbar_vue__ = __webpack_require__("QE77");
function injectStyle (ssrContext) {
  __webpack_require__("tnTX")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3a610713"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Toolbar_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3a610713_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Toolbar_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "gqBe":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('aside',{staticClass:"mdc-dialog",attrs:{"id":"episode-dialog","role":"alertdialog","aria-labelledby":"my-mdc-dialog-label","aria-describedby":"my-mdc-dialog-description"}},[_c('div',{staticClass:"mdc-dialog__surface"},[_c('header',{staticClass:"mdc-dialog__header"},[_c('h2',{staticClass:"mdc-dialog__header__title",attrs:{"id":"my-mdc-dialog-label"}},[_vm._v("\n        "+_vm._s(_vm.episode.name)+"\n      ")])]),_vm._v(" "),_c('section',{staticClass:"mdc-dialog__body mdc-dialog__body--scrollable",attrs:{"id":"my-mdc-dialog-description"}},[_c('div',{staticClass:"mdc-textfield mdc-textfield--fullwidth mdc-textfield--with-trailing-icon",class:{ 'mdc-textfield--upgraded' : _vm.episode.name }},[_c('i',{staticClass:"material-icons mdc-textfield__icon",attrs:{"tabindex":"0"}},[_vm._v("label")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model.lazy",value:(_vm.episode.name),expression:"episode.name",modifiers:{"lazy":true}}],staticClass:"mdc-textfield__input",attrs:{"type":"text","id":"name"},domProps:{"value":_vm.episode.name,"value":(_vm.episode.name)},on:{"change":function($event){_vm.episode.name=$event.target.value}}}),_vm._v(" "),_c('label',{staticClass:"mdc-textfield__label",class:{ 'mdc-textfield__label--float-above' : _vm.episode.name },attrs:{"for":"name"}},[_vm._v("Name")])]),_vm._v(" "),_c('div',{staticClass:"mdc-textfield mdc-textfield--fullwidth mdc-textfield--with-trailing-icon",class:{ 'mdc-textfield--upgraded' : _vm.episode.number }},[_c('i',{staticClass:"material-icons mdc-textfield__icon",attrs:{"tabindex":"0"}},[_vm._v("format_list_numbered")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model.lazy",value:(_vm.episode.number),expression:"episode.number",modifiers:{"lazy":true}}],staticClass:"mdc-textfield__input",attrs:{"type":"text","id":"number","pattern":"[0-9]+"},domProps:{"value":_vm.episode.number,"value":(_vm.episode.number)},on:{"change":function($event){_vm.episode.number=$event.target.value}}}),_vm._v(" "),_c('label',{staticClass:"mdc-textfield__label",class:{ 'mdc-textfield__label--float-above' : _vm.episode.number },attrs:{"for":"number"}},[_vm._v("Number")])])]),_vm._v(" "),_c('footer',{staticClass:"mdc-dialog__footer"},[_c('div',{staticStyle:{"margin-right":"auto"}},[_c('button',{staticClass:"mdc-button mdc-dialog__footer__button delete",attrs:{"type":"button"},on:{"click":_vm.deleteEpisode}},[_c('i',{staticClass:"material-icons mdc-button__icon"},[_vm._v("delete")]),_vm._v("\n          Delete\n        ")])]),_vm._v(" "),_c('button',{staticClass:"mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel",attrs:{"type":"button"}},[_vm._v("Cancel")]),_vm._v(" "),_c('button',{staticClass:"mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept",attrs:{"type":"button"},on:{"click":_vm.confirm}},[_vm._v("Update")])])]),_vm._v(" "),_c('div',{staticClass:"mdc-dialog__backdrop"})])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "i4iJ":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuedraggable__ = __webpack_require__("DAYN");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuedraggable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vuedraggable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__TopicCard__ = __webpack_require__("5Uh1");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__TopicDialog__ = __webpack_require__("CTM6");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Toolbar__ = __webpack_require__("djO7");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__EmptyState__ = __webpack_require__("YOpi");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'episode',
  components: {
    draggable: __WEBPACK_IMPORTED_MODULE_1_vuedraggable___default.a,
    TopicCard: __WEBPACK_IMPORTED_MODULE_2__TopicCard__["a" /* default */],
    TopicDialog: __WEBPACK_IMPORTED_MODULE_3__TopicDialog__["a" /* default */],
    Toolbar: __WEBPACK_IMPORTED_MODULE_4__Toolbar__["a" /* default */],
    EmptyState: __WEBPACK_IMPORTED_MODULE_5__EmptyState__["a" /* default */]
  },
  computed: {
    dragOptions: function dragOptions() {
      return {
        animation: 0,
        handle: '.mdc-list-item__start-detail',
        delay: 0
      };
    }
  },
  data: function data() {
    return {
      episode: {},
      topics: []
    };
  },
  created: function created() {
    this.fetchData();
    this.$options.sockets['topics.add'] = function (topic) {
      if (topic.episode === this.episode._id) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.added', topic);
      }
    }.bind(this);
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.update', function (topic, medias) {
      this.updateTopic(topic);
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.delete', function (topic) {
      this.deleteTopic(topic);
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.start', function (topic) {
      this.startTopic(topic);
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.stop', function (topic) {
      this.stopTopic(topic);
      this.updateXsplit({ title: this.episode.name, picture: null });
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.added', function (topic) {
      var index = this.topics.indexOf(this.topics.find(function (episodeTopic) {
        return episodeTopic._id === topic._id;
      }));
      if (index < 0) {
        this.topics.push(topic);
      }
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.updated', function (topic) {
      for (var i = 0; i < this.topics.length; i++) {
        if (this.topics[i]._id === topic._id) {
          topic.expanded = this.topics[i].expanded; // to keep expanded topics, well... expanded
          this.topics[i] = topic;
          this.topics.sort(function (t1, t2) {
            return t1.position === t2.position ? 0 : t1.position < t2.position ? -1 : 1;
          });
          this.$forceUpdate();
          break;
        }
      }
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('topic.deleted', function (topic) {
      var index = this.topics.indexOf(this.topics.find(function (episodeTopic) {
        return episodeTopic._id === topic._id;
      }));
      if (index > -1) {
        this.topics.splice(index, 1);
      }
    }.bind(this));
  },

  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData: function fetchData() {
      this.episode = {}; // reset the episode
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        this.episode = response.body;
        this.$options.sockets['episodes.' + this.episode._id] = function (data) {
          this.episode = data;
        }.bind(this);
        this.fetchTopics();
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    fetchTopics: function fetchTopics() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        this.topics = response.body;
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    addTopic: function addTopic() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.post('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.added', response.body);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Added a new topic');
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    updateTopic: function updateTopic(topic) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.put('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + topic._id, topic).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.updated', response.body);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Topic ' + response.body.title + ' updated');
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    deleteTopic: function deleteTopic(topic) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.delete('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + topic._id).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.deleted', topic);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Topic ' + topic.title + ' deleted');
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    startTopic: function startTopic(topic) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + topic._id + '/start').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.updated', response.body);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Topic ' + response.body.title + ' started');
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    stopTopic: function stopTopic(topic) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + topic._id + '/stop').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('topic.updated', response.body);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Topic ' + response.body.title + ' stopped');
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    moveTopic: function moveTopic(topic, newPosition) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/programs/' + this.$route.params.programId + '/episodes/' + this.$route.params.episodeId + '/topics/' + topic._id + '/move', {
        params: {
          position: newPosition
        }
      }).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    updateXsplit: function updateXsplit(data) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.put('/api/xsplit/', data).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    itemMoved: function itemMoved(event) {
      if (event.moved.element) {
        this.moveTopic(event.moved.element, event.moved.newIndex);
      }
    }
  }
});

/***/ }),

/***/ "jxgD":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_material_components_web__ = __webpack_require__("Qj28");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['episode'],
  created: function created() {
    this.$options.sockets['episodes.' + this.episode._id + '.delete'] = function (data) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('episode.deleted', data);
    };
    this.$options.sockets['episodes.' + this.episode._id] = function (data) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('episode.updated', data);
    };
  },
  mounted: function mounted() {
    this.menu = new __WEBPACK_IMPORTED_MODULE_1_material_components_web__["g" /* menu */].MDCSimpleMenu(this.$el.querySelector('.mdc-simple-menu'));
    // Add event listener to some button to toggle the menu on and off.
    this.$el.querySelector('.toggle-menu').addEventListener('click', function (event) {
      event.preventDefault();
      this.menu.open = !this.menu.open;
    }.bind(this));
  },

  methods: {
    editEpisode: function editEpisode(event) {
      event.preventDefault();
      event.stopPropagation();
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('episodeDialog.show', this.episode);
    },
    deleteEpisode: function deleteEpisode(event) {
      event.preventDefault();
      event.stopPropagation();
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('episode.delete', this.episode);
    }
  }
});

/***/ }),

/***/ "kKyV":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "kXcY":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_material_components_web__ = __webpack_require__("Qj28");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_object_assign__ = __webpack_require__("BEQ0");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_object_assign__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'ProgramDialog',
  data: function data() {
    return {
      dialog: null,
      program: {}
    };
  },
  mounted: function mounted() {
    this.dialog = new __WEBPACK_IMPORTED_MODULE_1_material_components_web__["f" /* dialog */].MDCDialog(this.$el);
    __WEBPACK_IMPORTED_MODULE_1_material_components_web__["c" /* textfield */].MDCTextfield.attachTo(this.$el.querySelector('.mdc-textfield'));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('programDialog.show', this.show);
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('programDialog.close', this.close);
  },

  methods: {
    show: function show(program) {
      this.program = __WEBPACK_IMPORTED_MODULE_2_object_assign___default()({}, program);
      this.$el.querySelector('input[type=file]').value = null;
      this.dialog.show();
    },
    close: function close() {
      this.dialog.close();
    },
    confirm: function confirm() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('program.update', this.program, this.$el.querySelector('input[type=file]').files[0]);
    },
    fileChange: function fileChange(name, files) {
      if (files.length > 0) {
        var FR = new FileReader();
        FR.addEventListener('load', function (e) {
          this.$el.querySelector('img').src = e.target.result;
        }.bind(this));
        FR.readAsDataURL(files[0]);
      }
    },
    deleteProgram: function deleteProgram() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('program.delete', this.program);
      this.close();
    }
  }
});

/***/ }),

/***/ "kysZ":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{staticClass:"mdc-grid-tile",on:{"click":function($event){_vm.toggleMedia(_vm.media)}}},[_c('div',{staticClass:"mdc-grid-tile__primary"},[_c('img',{staticClass:"mdc-grid-tile__primary-content",attrs:{"src":_vm.media.uri}})]),_vm._v(" "),_c('span',{staticClass:"mdc-grid-tile__secondary"},[(_vm.media.started && !_vm.media.ended)?_c('i',{staticClass:"mdc-grid-tile__icon material-icons"},[_vm._v("check_circle")]):_vm._e(),_vm._v(" "),_c('span',{staticClass:"mdc-grid-tile__title"},[_vm._v(_vm._s(_vm.media.label))])])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "m5iD":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_material_components_web__ = __webpack_require__("Qj28");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_EventBus_js__ = __webpack_require__("c2lU");
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'Snackbar',
  mounted: function mounted() {
    this.sb = __WEBPACK_IMPORTED_MODULE_0_material_components_web__["b" /* snackbar */].MDCSnackbar.attachTo(this.$el);
    __WEBPACK_IMPORTED_MODULE_1__utils_EventBus_js__["a" /* default */].$on('snackbar.message', this.showMessage);
  },
  methods: {
    showMessage: function showMessage(message) {
      this.sb.show({
        message: message,
        timeout: 2000
      });
    }
  }
});

/***/ }),

/***/ "mt5u":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ProgramCard__ = __webpack_require__("s7Y1");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ProgramDialog__ = __webpack_require__("vbmG");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Toolbar__ = __webpack_require__("djO7");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__EmptyState__ = __webpack_require__("YOpi");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'programs',
  components: {
    ProgramCard: __WEBPACK_IMPORTED_MODULE_1__ProgramCard__["a" /* default */],
    ProgramDialog: __WEBPACK_IMPORTED_MODULE_2__ProgramDialog__["a" /* default */],
    Toolbar: __WEBPACK_IMPORTED_MODULE_3__Toolbar__["a" /* default */],
    EmptyState: __WEBPACK_IMPORTED_MODULE_4__EmptyState__["a" /* default */]
  },
  data: function data() {
    return {
      programs: []
    };
  },
  created: function created() {
    this.getPrograms();
    this.$options.sockets['programs.add'] = function (program) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('program.added', program);
    };
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('program.added', function (program) {
      var index = this.programs.indexOf(this.programs.find(function (listProgram) {
        return listProgram._id === program._id;
      }));
      if (index < 0) this.programs.push(program);
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('program.update', function (program, file) {
      this.updateProgram(program, file);
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('program.delete', function (program) {
      this.deleteProgram(program);
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('program.updated', function (program) {
      for (var i = 0; i < this.programs.length; i++) {
        if (this.programs[i]._id === program._id) {
          this.programs[i] = program;
          this.$forceUpdate();
          break;
        }
      }
    }.bind(this));
    __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$on('program.deleted', function (program) {
      var index = this.programs.indexOf(this.programs.find(function (listProgram) {
        return listProgram._id === program._id;
      }));
      if (index > -1) this.programs.splice(index, 1);
    }.bind(this));
  },

  watch: {
    // call again the method if the route changes
    '$route': 'getPrograms'
  },
  methods: {
    getPrograms: function getPrograms() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.get('/api/programs').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        this.programs = response.body;
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('title.change', this.programs.length + ' Programs');
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    addProgram: function addProgram() {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.post('/api/programs').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('program.added', response.body);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Added ' + response.body.name);
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    updateProgram: function updateProgram(program, file) {
      var data = program;
      if (typeof file !== 'undefined') {
        data = new FormData();
        data.append('thumbnail', file);
        for (var key in program) {
          if (!(program[key] instanceof Object)) {
            data.append(key, program[key]);
          }
        }
      }
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.put('/api/programs/' + program._id, data).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('program.updated', response.body);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Program ' + response.body.name + ' updated');
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    deleteProgram: function deleteProgram(program) {
      __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', true);
      this.$http.delete('/api/programs/' + program._id).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('program.deleted', program);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Program ' + program.name + ' deleted');
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('progressbar.toggle', false);
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    }
  }
});

/***/ }),

/***/ "nHYk":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "nnrY":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "p4tO":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/brick-wall.18cdaf4.jpg";

/***/ }),

/***/ "pXDO":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"program mdc-card mdc-card--theme-dark ",style:({ 'background-image': _vm.program.thumbnail ? 'url(' + _vm.program.thumbnail + ')' : null })},[_c('section',{staticClass:"mdc-card__primary mdc-menu-anchor"},[_c('h1',{staticClass:"mdc-card__title mdc-card__title--large"},[_vm._v(_vm._s(_vm.program.name))]),_vm._v(" "),_c('h2',{staticClass:"mdc-card__subtitle"},[_vm._v("Added "+_vm._s(_vm._f("formatDate")(_vm.program.created)))]),_vm._v(" "),_c('i',{staticClass:"mdc-icon-toggle material-icons toggle-menu",attrs:{"arial-label":"Menu"}},[_vm._v("more_vert")]),_vm._v(" "),_c('div',{staticClass:"mdc-simple-menu mdc-simple-menu--open-from-bottom-right",attrs:{"tabindex":"-1"}},[_c('ul',{staticClass:"mdc-simple-menu__items mdc-list",attrs:{"role":"menu","aria-hidden":"true"}},[_c('li',{staticClass:"mdc-list-item",attrs:{"role":"menuitem","tabindex":"0"},on:{"click":function($event){_vm.editProgram($event)}}},[_vm._v("Edit")])])])])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "pZxc":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "qbhH":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Admin_vue__ = __webpack_require__("KS52");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_762114e7_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Admin_vue__ = __webpack_require__("6nRR");
function injectStyle (ssrContext) {
  __webpack_require__("Qbid")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-762114e7"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Admin_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_762114e7_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Admin_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "qosH":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "r1VF":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "r7mh":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "ra8+":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"topic",class:{ expanded : _vm.topic.expanded, playing : _vm.topic.started !== null && _vm.topic.ended === null }},[_c('li',{staticClass:"mdc-list-divider",attrs:{"role":"separator"}}),_vm._v(" "),_c('li',{staticClass:"mdc-list-item",attrs:{"data-mdc-auto-init":"MDCRipple"},on:{"click":function($event){_vm.toggle(!_vm.topic.expanded)}}},[(_vm.medias.length > 0)?_c('img',{staticClass:"mdc-list-item__start-detail",attrs:{"src":_vm.medias[0].uri,"width":"56","height":"56","alt":"medias[0].label"}}):_c('span',{staticClass:"mdc-list-item__start-detail",attrs:{"role":"presentation"}},[_c('i',{staticClass:"material-icons",attrs:{"aria-hidden":"true"}},[_vm._v("comment")])]),_vm._v(" "),_c('span',{staticClass:"mdc-list-item__text"},[_vm._v("\n      "+_vm._s(_vm.topic.title)+"\n      "),_c('span',{staticClass:"mdc-list-item__text__secondary"},[_vm._v(_vm._s(_vm.topic.description))])]),_vm._v(" "),_c('span',{staticClass:"mdc-list-item__end-detail"},[(_vm.topic.expanded)?_c('i',{staticClass:"mdc-icon-toggle material-icons",attrs:{"arial-label":"Edit"},on:{"click":_vm.editTopic}},[_vm._v("edit")]):_vm._e(),_vm._v(" "),(_vm.topic.started)?_c('time',[_vm._v(_vm._s(_vm._f("formatTime")(_vm.timePlayed)))]):_vm._e(),_vm._v(" "),(_vm.topic.started !== null && _vm.topic.ended === null)?_c('i',{staticClass:"mdc-icon-toggle material-icons",attrs:{"arial-label":"Stop"},on:{"click":_vm.stop}},[_vm._v("stop")]):_c('i',{staticClass:"mdc-icon-toggle material-icons",attrs:{"arial-label":"Playing"},on:{"click":_vm.start}},[_vm._v("play_arrow")]),_vm._v(" "),_c('i',{staticClass:"material-icons chevron",attrs:{"arial-label":"Chevron"}},[_vm._v("keyboard_arrow_down")])])]),_vm._v(" "),_c('div',{staticClass:"content"},[_vm._v("\n    "+_vm._s(_vm.topic.description ? _vm.topic.description : 'Empty in here')+"\n    "),_c('div',{staticClass:"mdc-grid-list"},[_c('ul',{staticClass:"mdc-grid-list__tiles"},_vm._l((_vm.medias),function(media){return _c('MediaTile',{key:media._id,attrs:{"media":media,"topicId":_vm.topic._id}})}))])])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "rkkT":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "s7Y1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ProgramCard_vue__ = __webpack_require__("JO/H");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2fb9a2cc_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_ProgramCard_vue__ = __webpack_require__("pXDO");
function injectStyle (ssrContext) {
  __webpack_require__("rkkT")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2fb9a2cc"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ProgramCard_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2fb9a2cc_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_ProgramCard_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "thgl":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Programs_vue__ = __webpack_require__("mt5u");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_45876707_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Programs_vue__ = __webpack_require__("AxwS");
function injectStyle (ssrContext) {
  __webpack_require__("kKyV")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-45876707"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Programs_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_45876707_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_Programs_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "tnTX":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "vbmG":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ProgramDialog_vue__ = __webpack_require__("kXcY");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2502dff8_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_ProgramDialog_vue__ = __webpack_require__("52aM");
function injectStyle (ssrContext) {
  __webpack_require__("WoG/")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2502dff8"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ProgramDialog_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2502dff8_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_lib_selector_type_template_index_0_ProgramDialog_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "xJD8":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Snackbar__ = __webpack_require__("SAZF");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_material_components_web__ = __webpack_require__("Qj28");
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'app',
  components: { Snackbar: __WEBPACK_IMPORTED_MODULE_0__components_Snackbar__["a" /* default */] },
  data: function data() {
    return {
      title: 'GeekInc Remote Regie'
    };
  },

  mounted: function mounted() {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_material_components_web__["a" /* autoInit */])(); // autoInit MDC
  },
  sockets: {
    connect: function connect() {
      console.log('Websocket connection established');
    },
    disconnect: function disconnect() {
      console.warn('Disconnected from Websocket');
    }
  }
});

/***/ }),

/***/ "yK37":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "yKfA":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _vm._m(0)}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"mdc-snackbar mdc-snackbar--align-start"},[_c('div',{staticClass:"mdc-snackbar__text"}),_vm._v(" "),_c('div',{staticClass:"mdc-snackbar__action-wrapper"},[_c('button',{staticClass:"mdc-button mdc-snackbar__action-button",attrs:{"type":"button"}})])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "zaKv":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__ = __webpack_require__("c2lU");
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'xsplit',
  data: function data() {
    return {
      xsplit: {}
    };
  },
  created: function created() {
    this.fetchData();
    // malheureusement, je n'ai pas trouvé d'autre moyen pour observer un event contenant un '.' - @Matthieu Petit
    // si jamais on en a besoin, je laisse ça ici
    this.$options.sockets['xsplit'] = function (data) {
      this.xsplit = data;
    }.bind(this);
  },

  methods: {
    fetchData: function fetchData() {
      this.$http.get('/api/xsplit/').then(function (response) {
        this.xsplit = response.body;
      }, function (response) {
        console.error(response);
        __WEBPACK_IMPORTED_MODULE_0__utils_EventBus_js__["a" /* default */].$emit('snackbar.message', 'Error : ' + (response.statusText ? response.statusText : 'no connection'));
      });
    },
    loaded: function loaded(event) {
      event.target.classList.remove('loading');
      event.target.classList.remove('failed');
    },
    failed: function failed(event) {
      event.target.classList.remove('loading');
      event.target.classList.add('failed');
    }
  }
});

/***/ })

},["NHnr"]);
//# sourceMappingURL=app.4b9a63071ce250420c7d.js.map