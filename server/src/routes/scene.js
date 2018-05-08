"use strict";
const express = require('express')
const router = express.Router()
const Scene = require('../models/scene')

router.route('/')
  /**
   * @swagger
   * /scene:
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
    var scene = new Scene()
    res.json(scene)
  })
  /**
   * @swagger
   * /scene:
   *   put:
   *     tags:
   *       - Xsplit
   *     description: Update the Xsplit state and data
   *     summary: Edit Xsplit data
   *     produces: application/json
   *     parameters:
   *       - name: scene
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
    let scene = new Scene()
    scene = Object.assign(scene, req.body, { modified: Date.now() })
    scene.save()
    res.json(scene)
  });

module.exports = router;