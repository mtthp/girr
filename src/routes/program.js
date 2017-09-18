"use strict";
const express = require('express');
const router = express.Router();
const Program = require('../models/program');
const logger = require('../logger');

/**
 * @swagger
 * definitions:
 *   Program:
 *     properties:
 *       name:
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
     * /programs:
     *   get:
     *     tags:
     *       - Programs
     *     description: Returns all programs
     *     summary: Get all programs
     *     produces: application/json
     *     responses:
     *       200:
     *         description: An array of programs
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/Program'
     */
    .get((req, res) => {
        Program.find((err, programs) => {
            res.send(programs);
        })
    })
    /**
     * @swagger
     * /programs:
     *   post:
     *     tags:
     *       - Programs
     *     description: Creates a new program
     *     summary: Add a new one
     *     produces: application/json
     *     parameters:
     *       - name: program
     *         in: body
     *         description: Fields for the Program resource
     *         schema:
     *           type: array
     *           $ref: '#/definitions/Program'
     *     responses:
     *       200:
     *         description: Successfully created
     *         schema:
     *           $ref: '#/definitions/Program'
     */
    .post(function(req, res, next) {
        let program = new Program(Object.assign({name: (new Date()).toString()}, req.body));
        program.save()
          .then(function(program) {
            logger.debug("Add a new Program " + program.toString())
            res.json(program)
          })
          .catch(function(error) {
            next(error)
          })
    });

// Middleware : we check if the program exists in the DB before going further
router.param('programName', function (req, res, next, value, name) {
  Program
    .findOne({name: value})
    .populate('episodes')
    .then(function(program) {
      if (program !== null) {
        logger.debug("Found " + program.toString())
        req.program = program
        next()
      } else {
        next({message:"Program " + value + " was not found", status: 404})
      }
    })
    .catch(function(error) {
      next(error)
    })
})

router.route('/:programName')
  /**
   * @swagger
   * /programs/{name}:
   *   get:
   *     tags:
   *       - Programs
   *     description: Returns a single program
   *     summary: Get a program
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: name
   *         description: Program's name
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A single Program
   *         schema:
   *           $ref: '#/definitions/Program'
   */
  .get(function (req, res, next) {
    res.send(req.program)
  })
  /**
   * @swagger
   * /programs/{name}:
   *   put:
   *     tags:
   *       - Programs
   *     description: Updates a single program
   *     summary: Edit a program
   *     produces: application/json
   *     parameters:
   *       - name: name
   *         description: Program's name
   *         in: path
   *         required: true
   *         type: string
   *       - name: program
   *         in: body
   *         description: Fields for the Program resource
   *         schema:
   *           type: array
   *           $ref: '#/definitions/Program'
   *     responses:
   *       200:
   *         description: Successfully updated
   *         schema:
   *           $ref: '#/definitions/Program'
   */
  .put(function (req, res, next) {
    Program
      // use findOneAndUpdate to get the new result (even if we already found the resource in the DB)
      .findByIdAndUpdate(req.program._id, Object.assign(req.body, {modified: Date.now()}), {new : true})
      .then(function(program) {
        if (program !== null) {
          logger.debug("Updated " + program.toString())
          res.json(program)
        } else {
          next({message:"Program " + req.program.name + " wasn't updated", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })
  /**
   * @swagger
   * /programs/{name}:
   *   delete:
   *     tags:
   *       - Programs
   *     description: Deletes a single program
   *     summary: Remove a program
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: name
   *         description: Program's name
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  .delete(function (req, res, next) {
    req.program
      .remove()
      .then(function(result) {
        if (result !== null) {
          logger.debug("Removed Program " + req.params.programName)
          res.status(204).json(result.toString())
        } else {
          next({message:"Program " + req.params.programName + " wasn't deleted", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })

router.use('/:programName/episodes', require('./episode'));

module.exports = router;