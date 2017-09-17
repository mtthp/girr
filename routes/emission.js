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
        let emission = new Emission(req.body);
        emission.save()
          .then(function(emission) {
            logger.debug("Add a new Emission " + emission.toString())
            res.json(emission)
          })
          .catch(function(error) {
            next(error)
          })
    });

router.post('/:emission', (req, res, next) => {
    let emission = new Emission({ nom: req.params.emission });
    emission.save(err => {
        if(err) return next(err);
        res.setHeader('location', `api/emissions/${emission.nom}`);
        return res.sendStatus(201);
    });
});

router.use('/:emission', (req, res, next) => {
    Emission.findOne({
        nom: req.params.emission
    }, (err, emission) => {
        if(err) return next(err);
        if (emission === null) {
            return res.sendStatus(404);
        }
        req.emission = emission;
        next();
    });
});

router.get('/:emission', (req, res) => {
    return res.send(req.emission);
});

router.put('/:emission', (req, res, next) => {
    let emission = req.body;
    delete emission._id;
    Emission.findOneAndUpdate({
        nom: req.params.emission
    }, emission, { new: true }, (err, emission) => {

        if(err) return next(err);
        if (emission === null) {
            return res.sendStatus(404);
        }
        return res.send(emission);
    });
});

router.delete('/:emission', (req, res, next) => {
    Emission.findOneAndRemove({
        nom: req.params.emission
    }, err => {
        if(err) return next(err);
        return res.sendStatus(204);
    });
});

router.use('/:emission/episodes', episode);

module.exports = router;