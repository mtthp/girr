<template>
  <main>

  </main>
</template>

<script>
var xjs = require('xjs-framework/dist/xjs') // be aware of https://github.com/xjsframework/xjs/issues/171

export default {
  name: 'xsplit',
  data () {
    return {
      xsplit: {}
    }
  },
  created () {
    console.log(xjs)
    xjs.ready().then(function () {
      return xjs.Scene.getSceneCount()
    }).then(function (count) {
      for (let i = 1; i < count + 1; i++) {
        xjs.Scene.getById(i).then(function (scene) {
          console.log(scene)
        })
      }
    })
    this.$options.sockets['xsplit'] = (data) => {
      this.xsplit = data
    }
  }
}
</script>

<style scoped>

</style>
