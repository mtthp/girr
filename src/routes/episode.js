const express = require('express');
const router = express.Router();
const logger = require('../logger');
const Episode = require('../models/episode')
const Topics = require('../models/topic')

/**
 * @swagger
 * definitions:
 *   Episode:
 *     properties:
 *       position:
 *         type: integer
 *         description: unique identifier
 *         required: true
 *       name:
 *         type: string
 *         description: name
 *       date:
 *         type: date
 *         description: when an episode air
 */

router.route('/')
  /**
   * @swagger
   * /programs/{programName}/episodes:
   *   get:
   *     tags:
   *       - Episodes
   *     description: Returns all episodes from a program
   *     summary: Get all episodes
   *     produces: application/json
   *     parameters:
   *       - name: programName
   *         description: programName's name
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: An array of episodes
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Episode'
   */
  .get(function(req, res, next) {
    Episode
        .find({ program: req.program._id })
        .populate({ path: 'program', select: 'name' })
        .sort({ 'position': -1 })
        .then(function(episodes) {
            logger.debug("Found " + (episodes.length ? episodes.toString() : 0 + " episodes"))
            res.json(episodes)
        })
        .catch(function(error) {
            next(error)
        });
  })
  /**
   * @swagger
   * /programs/{programName}/episodes:
   *   post:
   *     tags:
   *       - Episodes
   *     description: Creates a new episode
   *     summary: Add a new one
   *     produces: application/json
   *     parameters:
   *       - name: programName
   *         description: Program's name
   *         in: path
   *         required: true
   *         type: string
   *       - name: episode
   *         in: body
   *         description: Fields for the Episode resource
   *         schema:
   *           type: array
   *           $ref: '#/definitions/Episode'
   *     responses:
   *       200:
   *         description: Successfully created
   *         schema:
   *           $ref: '#/definitions/Episode'
   */
  .post(function (req, res, next) {
    "use strict";
    let episode = new Episode(req.body)
    episode.program = req.program._id
    
    // provide a position if the user didn't specified one
    if (typeof episode.position === "undefined") {
        // Max episode position + 1 - inspired by https://stackoverflow.com/a/4020842
        var maxEpisodePosition = req.program.episodes.length > 0 ? Math.max.apply(
            Math,
            req.program.episodes.map(function(e){
                return e.position;
            })
        ) : 0;
        episode.position = 1 + maxEpisodePosition;
    }

    episode
        .save()
        .then(function(episode) {
            logger.debug("Added a new Episode " + episode.toString())
            // add episode to program to retrieve them all by using 'populate'
            req.program.episodes.push(episode)
            req.program.save()

            res.json(episode)
        })
        .catch(function(error) {
            next(error)
        })
  })

// Middleware : we check if the episode exists in the specified program before going further
router.param('episodePosition', function (req, res, next, value, name) {
  Episode
    .findOne({position: value, program: req.program._id})
    .populate('topics')
    .then(function(episode) {
      if (episode !== null) {
        logger.debug("Found " + episode.toString())
        req.episode = episode
        next()
      } else {
        next({message:"Episode " + value + " was not found", status: 404})
      }
    })
    .catch(function(error) {
      next(error)
    })
})

router.route('/:episodePosition')
  /**
   * @swagger
   * /programs/{programName}/episodes/{episodePosition}:
   *   get:
   *     tags:
   *       - Episodes
   *     description: Returns a single episode
   *     summary: Get a episode
   *     produces: application/json
   *     parameters:
   *       - name: programName
   *         description: Program's name
   *         in: path
   *         required: true
   *         type: string
   *       - name: episodePosition
   *         description: Episode's position
   *         in: path
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: A single Episode
   *         schema:
   *           $ref: '#/definitions/Episode'
   */
  .get(function (req, res, next) {
    res.send(req.episode)
  })
  /**
   * @swagger
   * /programs/{programName}/episodes/{episodePosition}:
   *   put:
   *     tags:
   *       - Episodes
   *     description: Updates a single episode
   *     summary: Edit a episode
   *     produces: application/json
   *     parameters:
   *       - name: programName
   *         description: Program's name
   *         in: path
   *         required: true
   *         type: string
   *       - name: episodePosition
   *         description: Episode's position
   *         in: path
   *         required: true
   *         type: integer
   *       - name: episode
   *         in: body
   *         description: Fields for the Episode resource
   *         schema:
   *           type: array
   *           $ref: '#/definitions/Episode'
   *     responses:
   *       200:
   *         description: Successfully updated
   *         schema:
   *           $ref: '#/definitions/Episode'
   */
  .put(function (req, res, next) {
    Episode
      // use findOneAndUpdate to get the new result (even if we already found the resource in the DB)
      .findOneAndUpdate({position: req.episode.position, program: req.program._id}, Object.assign(req.body, {modified: Date.now()}), {new : true})
      .then(function(episode) {
        if (episode !== null) {
          logger.debug("Updated " + episode.toString())
          res.json(episode)
        } else {
          next({message:"Episode " + req.episode.position + " wasn't updated", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })
  /**
   * @swagger
   * /programs/{programName}/episodes/{episodePosition}:
   *   delete:
   *     tags:
   *       - Episodes
   *     description: Deletes a single episode
   *     summary: Remove a episode
   *     produces: application/json
   *     parameters:
   *       - name: programName
   *         description: Program's name
   *         in: path
   *         required: true
   *         type: string
   *       - name: episodePosition
   *         description: Episode's position
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  .delete(function (req, res, next) {
    req.episode
      .remove()
      .then(function(result) {
        if (result !== null) {
          logger.debug("Removed Episode " + req.params.episodePosition)
          res.status(204).json(result.toString())
        } else {
          next({message:"Episode " + req.params.episodePosition + " wasn't deleted", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })

router.get('/:episode/full', (req, res) => {
    "use strict";
    // this.episode = {
    //     title: 'Bits 59',
    //     displayed: null,
    //     news: [
    //         {
    //             title: 'Hyperloop One le test fonctionnel',
    //             incrusts: [
    //                 '/assets/programs/bits/59/0.jpg',
    //                 '/assets/programs/bits/59/1.jpg'
    //             ]
    //         },

    Topics.find({
        episode: req.episode._id
    }, { '_id': 0, 'position': 1, 'title': 1, 'notes': 1, 'medias': 1 }, { 'sort': { 'position': 1 } }).lean().exec((err, news) => {
        let nameCapitalFirst = req.program.name.charAt(0).toUpperCase() + req.program.name.slice(1);
        let episodeFull = {
            titre: `${nameCapitalFirst} ${req.episode.position}`,
            news: news
        };
        let baseUrl = req.originalUrl.replace('full', '');
        episodeFull.news.forEach(n => {
            n.incrusts = n.incrusts.map(incrust => path.join(baseUrl, 'news', n.position.toString(), 'incrusts', incrust.toString()));
        });
        res.send(episodeFull);
    });
});

router.use('/:episodePosition/topics', require('./topic'));

module.exports = router;