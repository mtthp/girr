"use strict";
const express = require('express');
const router = express.Router();
const Emission = require('../models/emission');
const episode = require('./episode');
const logger = require('../logger');

/**
 * @swagger
 * definitions:
 *   Emission:
 *     properties:
 *       nom:
 *         type: string
 *         description: unique identifier
 *         required: true
 *       logo:
 *         type: string
 *         description: buffer data
 */

router.route('/')
    /**
     * @swagger
     * /emissions:
     *   get:
     *     tags:
     *       - Emissions
     *     description: Returns all emissions
     *     summary: Get all emissions
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: An array of emissions
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/Emission'
     */
    .get((req, res) => {
        Emission.find((err, emissions) => {
            res.send(emissions);
        })
    })
    /**
     * @swagger
     * /emissions:
     *   post:
     *     tags:
     *       - Emissions
     *     description: Creates a new emission
     *     summary: Add a new one
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: emission
     *         in: body
     *         description: Fields for the Emission resource
     *         schema:
     *           type: array
     *           $ref: '#/definitions/Emission'
     *     responses:
     *       200:
     *         description: Successfully created
     *         schema:
     *           $ref: '#/definitions/Emission'
     */
    .post((req, res, next) => {
        let emission = new Emission(Object.assign({nom: (new Date()).toString()}, req.body));
        emission.save()
          .then(function(emission) {
            logger.debug("Add a new Emission " + emission.toString())
            res.json(emission)
          })
          .catch(function(error) {
            next(error)
          })
    });

// Middleware : we check if the emission exists in the DB before going further
router.param('name', function (req, res, next, value, name) {
  Emission
    .findOne({nom: value})
    .then(function(emission) {
      if (emission !== null) {
        logger.debug("Found " + emission.toString())
        req.emission = emission
        next()
      } else {
        next({message:"Emission " + value + " was not found", status: 404})
      }
    })
    .catch(function(error) {
      next(error)
    })
})

router.route('/:name')
  /**
   * @swagger
   * /emissions/{nom}:
   *   get:
   *     tags:
   *       - Emissions
   *     description: Returns a single emission
   *     summary: Get a emission
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: nom
   *         description: Emission's name
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A single Emission
   *         schema:
   *           $ref: '#/definitions/Emission'
   */
  .get(function (req, res, next) {
    res.send(req.emission)
  })
  /**
   * @swagger
   * /emissions/{nom}:
   *   put:
   *     tags:
   *       - Emissions
   *     description: Updates a single emission
   *     summary: Edit a emission
   *     produces: application/json
   *     parameters:
   *       - name: nom
   *         description: Emission's name
   *         in: path
   *         required: true
   *         type: string
   *       - name: emission
   *         in: body
   *         description: Fields for the Emission resource
   *         schema:
   *           type: array
   *           $ref: '#/definitions/Emission'
   *     responses:
   *       200:
   *         description: Successfully updated
   *         schema:
   *           $ref: '#/definitions/Emission'
   */
  .put(function (req, res, next) {
    Emission
      // use findOneAndUpdate to get the new result (even if we already found the resource in the DB)
      .findOneAndUpdate({nom: req.emission.nom}, Object.assign(req.body, {modified: Date.now()}), {new : true})
      .then(function(emission) {
        if (emission !== null) {
          logger.debug("Updated " + emission.toString())
          res.json(emission)
        } else {
          next({message:"Emission " + req.emission.nom + " wasn't updated", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })
  /**
   * @swagger
   * /emissions/{nom}:
   *   delete:
   *     tags:
   *       - Emissions
   *     description: Deletes a single emission
   *     summary: Remove a emission
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: nom
   *         description: Emission's name
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  .delete(function (req, res, next) {
    req.emission
      .remove()
      .then(function(result) {
        if (result !== null) {
          logger.debug("Removed Emission " + req.params.name)
          res.status(204).json(result.toString())
        } else {
          next({message:"Emission " + req.params.name + " wasn't deleted", status: 417})
        }
      })
      .catch(function(error) {
        next({message:error.toString()})
      })
  })

router.use('/:name/episodes', episode);

module.exports = router;