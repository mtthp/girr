const express = require('express');
const router = express.Router();
const logger = require('../logger');
const Episode = require('../models/episode')
const News = require('../models/news')
const news = require('./news')

/**
 * @swagger
 * definitions:
 *   Episode:
 *     properties:
 *       numero:
 *         type: integer
 *         description: unique identifier
 *         required: true
 *       nom:
 *         type: string
 *         description: name
 *       date:
 *         type: date
 *         description: when an episode air
 */

router.route('/')
  /**
   * @swagger
   * /emissions/{emissionName}/episodes:
   *   get:
   *     tags:
   *       - Episodes
   *     description: Returns all episodes from a emission
   *     summary: Get all episodes
   *     produces: application/json
   *     parameters:
   *       - name: emissionName
   *         description: Emission's name
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
        .find({ emission: req.emission._id })
        .populate({ path: 'emission', select: 'nom' })
        .sort({ 'numero': -1 })
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
   * /emissions/{emissionName}/episodes:
   *   post:
   *     tags:
   *       - Episodes
   *     description: Creates a new episode
   *     summary: Add a new one
   *     produces: application/json
   *     parameters:
   *       - name: emissionName
   *         description: Emission's name
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
    episode.emission = req.emission._id
    
    // provide a number if the user didn't specified one
    if (typeof episode.numero === "undefined") {
        // Max episode number + 1 - inspired by https://stackoverflow.com/a/4020842
        var maxEpisodeNumber = req.emission.episodes.length > 0 ? Math.max.apply(
            Math,
            req.emission.episodes.map(function(episode){
                return episode.numero;
            })
        ) : 0;
        episode.numero = 1 + maxEpisodeNumber;
    }

    episode
        .save()
        .then(function(episode) {
            logger.debug("Added a new Episode " + episode.toString())
            // add episode to emission to retrieve them all by using 'populate'
            req.emission.episodes.push(episode)
            req.emission.save()

            res.json(episode)
        })
        .catch(function(error) {
            next(error)
        })
  })

// Middleware : we check if the episode exists in the specified emission before going further
router.param('episodeNumber', function (req, res, next, value, name) {
  Episode
    .findOne({numero: value, emission: req.emission._id})
    .populate('news')
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

router.route('/:episodeNumber')
  /**
   * @swagger
   * /emissions/{emissionName}/episodes/{number}:
   *   get:
   *     tags:
   *       - Episodes
   *     description: Returns a single episode
   *     summary: Get a episode
   *     produces: application/json
   *     parameters:
   *       - name: emissionName
   *         description: Emission's name
   *         in: path
   *         required: true
   *         type: string
   *       - name: episodeNumber
   *         description: Episode's number
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
   * /emissions/{emissionName}/episodes/{number}:
   *   put:
   *     tags:
   *       - Episodes
   *     description: Updates a single episode
   *     summary: Edit a episode
   *     produces: application/json
   *     parameters:
   *       - name: emissionName
   *         description: Emission's name
   *         in: path
   *         required: true
   *         type: string
   *       - name: episodeNumber
   *         description: Episode's number
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
      .findOneAndUpdate({numero: req.episode.numero, emission: req.emission._id}, Object.assign(req.body, {modified: Date.now()}), {new : true})
      .then(function(episode) {
        if (episode !== null) {
          logger.debug("Updated " + episode.toString())
          res.json(episode)
        } else {
          next({message:"Episode " + req.episode.numero + " wasn't updated", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })
  /**
   * @swagger
   * /emissions/{emissionName}/episodes/{number}:
   *   delete:
   *     tags:
   *       - Episodes
   *     description: Deletes a single episode
   *     summary: Remove a episode
   *     produces: application/json
   *     parameters:
   *       - name: emissionName
   *         description: Emission's name
   *         in: path
   *         required: true
   *         type: string
   *       - name: episodeNumber
   *         description: Episode's number
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
          logger.debug("Removed Episode " + req.params.episodeNumber)
          res.status(204).json(result.toString())
        } else {
          next({message:"Episode " + req.params.episodeNumber + " wasn't deleted", status: 417})
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
    //                 '/assets/emissions/bits/59/0.jpg',
    //                 '/assets/emissions/bits/59/1.jpg'
    //             ]
    //         },

    News.find({
        episode: req.episode._id
    }, { '_id': 0, 'numero': 1, 'titre': 1, 'notes': 1,'incrusts': 1 }, { 'sort': { 'numero': 1 } }).lean().exec((err, news) => {
        let nomCapitalFirst = req.emission.nom.charAt(0).toUpperCase() + req.emission.nom.slice(1);
        let episodeFull = {
            titre: `${nomCapitalFirst} ${req.episode.numero}`,
            news: news
        };
        let baseUrl = req.originalUrl.replace('full', '');
        episodeFull.news.forEach(n => {
            n.incrusts = n.incrusts.map(incrust => path.join(baseUrl, 'news', n.numero.toString(), 'incrusts', incrust.toString()));
        });
        res.send(episodeFull);
    });
});

router.use('/:episodeNumber/news', news);

module.exports = router;