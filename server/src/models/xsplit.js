const cache = require('memory-cache')
const websockets = require('../websockets')()

/**
 * Class representing a WebSockets Server
 */
class XSplit {
  constructor () {
    var data = cache.get('xsplit')
    if (data !== null) {
      // actually, we should store the episode, topic and media currently playing : that way, the client knows what to display (Media > Topic > Episode)
      // and the server doesn't need to tell the client what title or picture
      this.title = data.title
      this.picture = data.picture
      this.background = data.background
      // this.episode = data.episode
      // this.topic = data.topic
      // this.media = data.media
      this.created = data.created
      this.modified = data.modified
    } else { // default values
      this.title = null
      this.picture = null
      this.background = null
      // this.episode = null // or {}
      // this.topic = null // or {}
      // this.media = null // or {}
      this.created = Date.now()
      this.modified = Date.now()
    }
  }

  save() {
    cache.put('xsplit', this)
    websockets.sockets.emit('xsplit', this)
  }
}

module.exports = XSplit;
