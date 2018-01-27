"use strict";
const express = require('express')
const router = express.Router()
const XSplit = require('../models/xsplit')

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
    var xsplit = new XSplit()
    res.json(xsplit)
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
    let xsplit = new XSplit()
    xsplit = Object.assign(xsplit, req.body, { modified: Date.now() })
    xsplit.save()
    res.json(xsplit)
  });

module.exports = router;