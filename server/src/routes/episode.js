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
 *       number:
 *         type: integer
 *         description: unique identifier in the Program
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
   * /programs/{programId}/episodes:
   *   get:
   *     tags:
   *       - Episodes
   *     description: Return all episodes from a program
   *     summary: Get all episodes
   *     produces: application/json
   *     parameters:
   *       - name: programId
   *         description: Program's id
   *         in: path
   *         required: true
   *         type: uuid
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
        .sort({ 'number': -1 })
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
   * /programs/{programId}/episodes:
   *   post:
   *     tags:
   *       - Episodes
   *     description: Create a new episode
   *     summary: Add a new one
   *     produces: application/json
   *     parameters:
   *       - name: programId
   *         description: Program's id
   *         in: path
   *         required: true
   *         type: uuid
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
    let episode = new Episode(Object.assign(req.body, {created: Date.now(), modified: Date.now()}))
    episode.program = req.program._id
    
    // provide a number if the user didn't specified one
    if (typeof episode.number === "undefined") {
        // Max episode number + 1 - inspired by https://stackoverflow.com/a/4020842
        var maxEpisodeNumber = req.program.episodes.length > 0 ? Math.max.apply(
            Math,
            req.program.episodes.map(function(e){
                return e.number;
            })
        ) : 0;
        episode.number = 1 + maxEpisodeNumber;
    }

    // provide a name if the user didn't specified one
    if (typeof episode.name === "undefined") {
        episode.name = "Episode #" + episode.number;
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
router.param('episodeId', function (req, res, next, value, name) {
  Episode
    .findOne({_id: value, program: req.program._id})
    .populate({ 
       path: 'topics',
       populate: {
         path: 'medias',
         model: 'Media'
       } 
    })
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

router.route('/:episodeId')
  /**
   * @swagger
   * /programs/{programId}/episodes/{episodeId}:
   *   get:
   *     tags:
   *       - Episodes
   *     description: Return a single episode
   *     summary: Get a episode
   *     produces: application/json
   *     parameters:
   *       - name: programId
   *         description: Program's id
   *         in: path
   *         required: true
   *         type: uuid
   *       - name: episodeId
   *         description: Episode's id
   *         in: path
   *         required: true
   *         type: uuid
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
   * /programs/{programId}/episodes/{episodeId}:
   *   put:
   *     tags:
   *       - Episodes
   *     description: Update a single episode
   *     summary: Edit a episode
   *     produces: application/json
   *     parameters:
   *       - name: programId
   *         description: Program's id
   *         in: path
   *         required: true
   *         type: uuid
   *       - name: episodeId
   *         description: Episode's id
   *         in: path
   *         required: true
   *         type: uuid
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
    req.episode = Object.assign(req.episode, req.body, {modified: Date.now()})
    req.episode
      .save()
      .then(function(episode) {
        logger.debug("Updated " + episode.toString())
        res.json(episode)
      })
      .catch(function(error) {
        next(error)
      })
  })
  /**
   * @swagger
   * /programs/{programId}/episodes/{episodeId}:
   *   delete:
   *     tags:
   *       - Episodes
   *     description: Delete a single episode
   *     summary: Remove a episode
   *     produces: application/json
   *     parameters:
   *       - name: programId
   *         description: Program's id
   *         in: path
   *         required: true
   *         type: uuid
   *       - name: episodeId
   *         description: Episode's id
   *         in: path
   *         required: true
   *         type: uuid
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  .delete(function (req, res, next) {
    req.episode
      .remove()
      .then(function(result) {
        if (result !== null) {
          logger.debug("Removed Episode " + req.params.episodeId)
          res.status(204).json(result.toString())
        } else {
          next({message:"Episode " + req.params.episodeId + " wasn't deleted", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })

/* legacy endpoint */
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
    }, { '_id': 0, 'number': 1, 'title': 1, 'notes': 1, 'medias': 1 }, { 'sort': { 'number': 1 } }).lean().exec((err, news) => {
        let nameCapitalFirst = req.program.name.charAt(0).toUpperCase() + req.program.name.slice(1);
        let episodeFull = {
            titre: `${nameCapitalFirst} ${req.episode.number}`,
            news: news
        };
        let baseUrl = req.originalUrl.replace('full', '');
        episodeFull.news.forEach(n => {
            n.incrusts = n.incrusts.map(incrust => path.join(baseUrl, 'news', n.number.toString(), 'incrusts', incrust.toString()));
        });
        res.send(episodeFull);
    });
});

router.use('/:episodeId/topics', require('./topic'));

module.exports = router;