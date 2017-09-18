"use strict";
const express = require('express');
const router = express.Router();
const logger = require('../logger');
const News = require('../models/news');
const Incrust = require('../models/incrust');

/**
 * @swagger
 * definitions:
 *   News:
 *     properties:
 *       numero:
 *         type: integer
 *         description: unique identifier
 *         required: true
 *       titre:
 *         type: string
 *         description: News title
 *       notes:
 *         type: string
 *         description: Some notes that should be useful
 */

router.route('/')
  /**
   * @swagger
   * /emissions/{emissionName}/episodes/{episodeNumber}/news:
   *   get:
   *     tags:
   *       - News
   *     description: Returns all news from an episode
   *     summary: Get all news
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
   *         description: An array of episodes
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Episode'
   */
  .get(function(req, res, next) {
    logger.debug(req.episode.toString())
    News
        .find({ episode: req.episode._id })
        .sort({ 'numero': 1 })
        .then(function(news) {
            logger.debug("Found " + (news.length ? news.toString() : 0 + " news"))
            res.json(news)
        })
        .catch(function(error) {
            next(error)
        });
  })
  /**
   * @swagger
   * /emissions/{emissionName}/episodes/{episodeNumber}/news:
   *   post:
   *     tags:
   *       - News
   *     description: Creates a new news
   *     summary: Add a news
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
   *       - name: news
   *         in: body
   *         description: Fields for the News resource
   *         schema:
   *           type: array
   *           $ref: '#/definitions/News'
   *     responses:
   *       200:
   *         description: Successfully created
   *         schema:
   *           $ref: '#/definitions/News'
   */
  .post(function (req, res, next) {
    "use strict";
    let news = new News(req.body)
    news.episode = req.episode._id
    
    // provide a number if the user didn't specified one
    if (typeof news.numero === "undefined") {
        // Max news number + 1 - inspired by https://stackoverflow.com/a/4020842
        var maxNewsNumber = req.episode.news.length > 0 ? Math.max.apply(
            Math,
            req.episode.news.map(function(episode_news){
                return episode_news.numero;
            })
        ) : 0;
        news.numero = 1 + maxNewsNumber;
    }

    news
        .save()
        .then(function(news) {
            logger.debug("Added a new Episode " + news.toString())
            // add news to episode to retrieve them all by using 'populate'
            req.episode.news.push(news)
            req.episode.save()

            res.json(news)
        })
        .catch(function(error) {
            next(error)
        })
  })

// Middleware : we check if the episode exists in the specified emission before going further
router.param('newsNumber', function (req, res, next, value, name) {
  News
    .findOne({numero: value, episode: req.episode._id})
    .then(function(news) {
      if (news !== null) {
        logger.debug("Found " + news.toString())
        req.news = news
        next()
      } else {
        next({message:"News " + value + " was not found", status: 404})
      }
    })
    .catch(function(error) {
      next(error)
    })
})

router.route('/:newsNumber')
  /**
   * @swagger
   * /emissions/{emissionName}/episodes/{episodeNumber}/news/{newsNumber}:
   *   get:
   *     tags:
   *       - News
   *     description: Returns a single news
   *     summary: Get a news
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
   *       - name: newsNumber
   *         description: News number
   *         in: path
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: A single News
   *         schema:
   *           $ref: '#/definitions/News'
   */
  .get(function (req, res, next) {
    res.send(req.news)
  })
  /**
   * @swagger
   * /emissions/{emissionName}/episodes/{episodeNumber}/news/{newsNumber}:
   *   put:
   *     tags:
   *       - News
   *     description: Updates a single news
   *     summary: Edit a news
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
   *       - name: newsNumber
   *         description: News number
   *         in: path
   *         required: true
   *         type: integer
   *       - name: news
   *         in: body
   *         description: Fields for the News resource
   *         schema:
   *           type: array
   *           $ref: '#/definitions/News'
   *     responses:
   *       200:
   *         description: Successfully updated
   *         schema:
   *           $ref: '#/definitions/News'
   */
  .put(function (req, res, next) {
    News
      // use findOneAndUpdate to get the new result (even if we already found the resource in the DB)
      .findOneAndUpdate({numero: req.news.numero, episode: req.episode._id}, Object.assign(req.body, {modified: Date.now()}), {new : true})
      .then(function(news) {
        if (news !== null) {
          logger.debug("Updated " + news.toString())
          res.json(news)
        } else {
          next({message:"News " + req.news.numero + " wasn't updated", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })
  /**
   * @swagger
   * /emissions/{emissionName}/episodes/{episodeNumber}/news/{newsNumber}:
   *   delete:
   *     tags:
   *       - News
   *     description: Deletes a single news
   *     summary: Remove a news
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
   *       - name: newsNumber
   *         description: News number
   *         in: path
   *         required: true
   *         type: integer
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  .delete(function (req, res, next) {
    req.news
      .remove()
      .then(function(result) {
        if (result !== null) {
          logger.debug("Removed News " + req.params.newsNumber)
          res.status(204).json(result.toString())
        } else {
          next({message:"News " + req.params.newsNumber + " wasn't deleted", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })

// legacy code, est-il encore nécessaire ? - @Matthieu Petit
router.get('/:news/checkintegrity', (req, res, next) => {
    let recovery = [];
    let modified = false;
    Incrust.find({
        news: req.news._id
    }, (err, incrusts) => {
        if (err) return next(err);
        recovery = req.news.incrusts.slice(0); // on copie les incrusts déjà présentes dans la news
        incrusts.forEach(incrust => {
            if (!req.news.incrusts.find(v => {
                return v.toString() === incrust._id.toString();
            })) {
                modified = true;
                recovery.push(incrust._id); // une incrust perdue, on la rajoute
            }
        });
        let incruststoRemove = [];
        req.news.incrusts.forEach(r => {
            if (!incrusts.find(v => {
                return r.toString() === v._id.toString();
            })) {
                incruststoRemove.push(r);
            }
        });
        incruststoRemove.forEach(elToRemove => {
            let index = recovery.findIndex(v => v.toString() === elToRemove.toString());
            if (index >= 0) {
                modified = true;
                recovery.splice(index, 1);
            }
        })
        // if(modified) {
        //     req.news.incrusts = recovery;
        //     req.news.save(err => {
        //         if (err) return next(err);
        //         return res.sendStatus(200);
        //     });
        // } else {
        //     return res.sendStatus(204);
        // }
        res.send({
            modified: modified,
            before: req.news.incrusts,
            after: recovery
        });
    });
});

// legacy code, est-il encore nécessaire ? - @Matthieu Petit
router.get('/:news/recover', (req, res, next) => {
    let recovery = [];
    let modified = false;
    Incrust.find({
        news: req.news._id
    }, (err, incrusts) => {
        if (err) return next(err);
        recovery = req.news.incrusts.slice(0); // on copie les incrusts déjà présentes dans la news
        incrusts.forEach(incrust => {
            if (!req.news.incrusts.find(v => {
                return v.toString() === incrust._id.toString();
            })) {
                modified = true;
                recovery.push(incrust._id); // une incrust perdue, on la rajoute
            }

        });
        // 59b86d69016d791afbf1ff73
        let incruststoRemove = [];
        req.news.incrusts.forEach(r => {
            if (!incrusts.find(v => {
                return r.toString() === v._id.toString();
            })) {
                incruststoRemove.push(r);
            }
        });
        incruststoRemove.forEach(elToRemove => {
            let index = recovery.findIndex(v => v.toString() === elToRemove.toString());
            if (index >= 0) {
                modified = true;
                recovery.splice(index, 1);
            }
        })
        if(modified) {
            req.news.incrusts = recovery;
            req.news.save(err => {
                if (err) return next(err);
                return res.sendStatus(200);
            });
        } else {
            return res.sendStatus(204);
        }
        // res.send({
        //     modified: modified,
        //     before: req.news.incrusts,
        //     after: recovery
        // });
    });
});

router.use('/:news/incrusts', require('./incrust'));

module.exports = router;