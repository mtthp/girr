"use strict";
const express = require('express')
const router = express.Router()
const logger = require('../logger')
const cache = require('memory-cache')
const websockets = require('../websockets')()

/**
 * @swagger
 * definitions:
 *   Xsplit:
 *     properties:
 *       title:
 *         type: string
 *         description: displayed title on the xsplit scene
 *       picture:
 *         type: string
 *         description: picture uri
 */

router.route('/')
  /**
   * @swagger
   * /xsplit:
   *   get:
   *     tags:
   *       - Xsplit
   *     description: Return current Xsplit state
   *     summary: Get Xsplit data
   *     produces: application/json
   *     responses:
   *       200:
   *         description: Xsplit data
   *         schema:
   *           $ref: '#/definitions/Xsplit'
   */
  .get(function (req, res, next) {
    if (cache.get('xsplit') !== null) {
      res.json(cache.get('xsplit'))
    } else {
      var xsplit = cache.get('xsplit') !== null ? cache.get('xsplit') : { title: null, picture: null, created: Date.now(), modified: Date.now() }
      cache.put('xsplit', xsplit)
      websockets.sockets.emit('xsplit', xsplit) // on avertit quand même le reste du monde
      res.json(xsplit)
    }
  })
  /**
   * @swagger
   * /xsplit:
   *   put:
   *     tags:
   *       - Xsplit
   *     description: Update the Xsplit state and data
   *     summary: Edit Xsplit data
   *     produces: application/json
   *     parameters:
   *       - name: xsplit
   *         in: body
   *         description: Fields for the Xsplit resource
   *         schema:
   *           type: array
   *           $ref: '#/definitions/Xsplit'
   *     responses:
   *       200:
   *         description: Successfully updated
   *         schema:
   *           $ref: '#/definitions/Xsplit'
   */
  .put(function (req, res, next) {
    var xsplit = cache.get('xsplit') !== null ? cache.get('xsplit') : { title: null, picture: null, created: Date.now() }
    var data = {}
    if (typeof req.body.title !== "undefined") data.title = req.body.title
    if (typeof req.body.picture !== "undefined") data.picture = req.body.picture
    cache.put('xsplit', Object.assign(xsplit, data, {modified: Date.now()}))
    websockets.sockets.emit('xsplit', cache.get('xsplit'))
    res.json(cache.get('xsplit'))
  });


module.exports = router;