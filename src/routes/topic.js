"use strict";
const express = require('express');
const router = express.Router();
const logger = require('../logger');
const Topic = require('../models/topic');
const Media = require('../models/media');

/**
 * @swagger
 * definitions:
 *   Topic:
 *     properties:
 *       position:
 *         type: integer
 *         description: unique identifier
 *         required: true
 *       title:
 *         type: string
 *         description: Topic's title
 *       notes:
 *         type: string
 *         description: Some notes that should be useful
 */

router.route('/')
  /**
   * @swagger
   * /programs/{programName}/episodes/{episodePosition}/topics:
   *   get:
   *     tags:
   *       - Topic
   *     description: Returns all topic from an episode
   *     summary: Get all topic
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
   *         description: An array of topics
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Topic'
   */
  .get(function(req, res, next) {
    logger.debug(req.episode.toString())
    Topic
        .find({ episode: req.episode._id })
        .sort({ 'position': 1 })
        .then(function(topics) {
            logger.debug("Found " + (topics.length ? topics.toString() : 0 + " topics"))
            res.json(topics)
        })
        .catch(function(error) {
            next(error)
        });
  })
  /**
   * @swagger
   * /programs/{programName}/episodes/{episodePosition}/topics:
   *   post:
   *     tags:
   *       - Topic
   *     description: Creates a new topic
   *     summary: Add a topic
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
   *       - name: topic
   *         in: body
   *         description: Fields for the Topic resource
   *         schema:
   *           type: array
   *           $ref: '#/definitions/Topic'
   *     responses:
   *       200:
   *         description: Successfully created
   *         schema:
   *           $ref: '#/definitions/Topic'
   */
  .post(function (req, res, next) {
    "use strict";
    let topic = new Topic(Object.assign(req.body, {created: Date.now(), modified: Date.now()}))
    topic.episode = req.episode._id

    // provide a position if the user didn't specified one
    if (typeof topic.position === "undefined") {
        // Max topic position + 1 - inspired by https://stackoverflow.com/a/4020842
        var maxTopicPosition = req.episode.topics.length > 0 ? Math.max.apply(
            Math,
            req.episode.topics.map(function(t){
                return t.position;
            })
        ) : 0;
        topic.position = 1 + maxTopicPosition;
    }

    topic
        .save()
        .then(function(topic) {
            logger.debug("Added a new Episode " + topic.toString())
            // add topic to episode to retrieve them all by using 'populate'
            req.episode.topics.push(topic)
            req.episode.save()

            res.json(topic)
        })
        .catch(function(error) {
            next(error)
        })
  })

// Middleware : we check if the episode exists in the specified program before going further
router.param('topicPosition', function (req, res, next, value, name) {
  Topic
    .findOne({position: value, episode: req.episode._id})
    .then(function(topic) {
      if (topic !== null) {
        logger.debug("Found " + topic.toString())
        req.topic = topic
        next()
      } else {
        next({message:"Topic " + value + " was not found", status: 404})
      }
    })
    .catch(function(error) {
      next(error)
    })
})

router.route('/:topicPosition')
  /**
   * @swagger
   * /programs/{programName}/episodes/{episodePosition}/topics/{topicPosition}:
   *   get:
   *     tags:
   *       - Topic
   *     description: Returns a single topic
   *     summary: Get a topic
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
   *       - name: topicPosition
   *         description: Topic's position
   *         in: path
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: A single Topic
   *         schema:
   *           $ref: '#/definitions/Topic'
   */
  .get(function (req, res, next) {
    res.send(req.topic)
  })
  /**
   * @swagger
   * /programs/{programName}/episodes/{episodePosition}/topics/{topicPosition}:
   *   put:
   *     tags:
   *       - Topic
   *     description: Updates a single topic
   *     summary: Edit a topic
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
   *       - name: topicPosition
   *         description: Topic's position
   *         in: path
   *         required: true
   *         type: integer
   *       - name: topic
   *         in: body
   *         description: Fields for the Topic resource
   *         schema:
   *           type: array
   *           $ref: '#/definitions/Topic'
   *     responses:
   *       200:
   *         description: Successfully updated
   *         schema:
   *           $ref: '#/definitions/Topic'
   */
  .put(function (req, res, next) {
    Topic
      // use findOneAndUpdate to get the new result (even if we already found the resource in the DB)
      .findOneAndUpdate({position: req.topic.position, episode: req.episode._id}, Object.assign(req.body, {modified: Date.now()}), {new : true})
      .then(function(topic) {
        if (topic !== null) {
          logger.debug("Updated " + topic.toString())
          res.json(topic)
        } else {
          next({message:"Topic " + req.topic.position + " wasn't updated", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })
  /**
   * @swagger
   * /programs/{programName}/episodes/{episodePosition}/topics/{topicPosition}:
   *   delete:
   *     tags:
   *       - Topic
   *     description: Deletes a single topic
   *     summary: Remove a topic
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
   *       - name: topicPosition
   *         description: Topic's position
   *         in: path
   *         required: true
   *         type: integer
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  .delete(function (req, res, next) {
    req.topic
      .remove()
      .then(function(result) {
        if (result !== null) {
          logger.debug("Removed Topic " + req.params.topicPosition)
          res.status(204).json(result.toString())
        } else {
          next({message:"Topic " + req.params.topicPosition + " wasn't deleted", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })

// legacy code, est-il encore nécessaire ? - @Matthieu Petit
router.get('/:topic/checkintegrity', (req, res, next) => {
    let recovery = [];
    let modified = false;
    Media.find({
        topic: req.topic._id
    }, (err, medias) => {
        if (err) return next(err);
        recovery = req.topic.medias.slice(0); // on copie les medias déjà présentes dans la topic
        medias.forEach(media => {
            if (!req.topic.medias.find(v => {
                return v.toString() === media._id.toString();
            })) {
                modified = true;
                recovery.push(media._id); // une media perdue, on la rajoute
            }
        });
        let mediasToRemove = [];
        req.topic.medias.forEach(r => {
            if (!medias.find(v => {
                return r.toString() === v._id.toString();
            })) {
                mediasToRemove.push(r);
            }
        });
        mediasToRemove.forEach(elToRemove => {
            let index = recovery.findIndex(v => v.toString() === elToRemove.toString());
            if (index >= 0) {
                modified = true;
                recovery.splice(index, 1);
            }
        })
        // if(modified) {
        //     req.topic.medias = recovery;
        //     req.topic.save(err => {
        //         if (err) return next(err);
        //         return res.sendStatus(200);
        //     });
        // } else {
        //     return res.sendStatus(204);
        // }
        res.send({
            modified: modified,
            before: req.topic.medias,
            after: recovery
        });
    });
});

// legacy code, est-il encore nécessaire ? - @Matthieu Petit
router.get('/:topic/recover', (req, res, next) => {
    let recovery = [];
    let modified = false;
    Media.find({
        topic: req.topic._id
    }, (err, medias) => {
        if (err) return next(err);
        recovery = req.topic.medias.slice(0); // on copie les medias déjà présentes dans la topic
        medias.forEach(media => {
            if (!req.topic.medias.find(v => {
                return v.toString() === media._id.toString();
            })) {
                modified = true;
                recovery.push(media._id); // une media perdue, on la rajoute
            }

        });
        // 59b86d69016d791afbf1ff73
        let mediastoRemove = [];
        req.topic.medias.forEach(r => {
            if (!medias.find(v => {
                return r.toString() === v._id.toString();
            })) {
                mediastoRemove.push(r);
            }
        });
        mediastoRemove.forEach(elToRemove => {
            let index = recovery.findIndex(v => v.toString() === elToRemove.toString());
            if (index >= 0) {
                modified = true;
                recovery.splice(index, 1);
            }
        })
        if(modified) {
            req.topic.medias = recovery;
            req.topic.save(err => {
                if (err) return next(err);
                return res.sendStatus(200);
            });
        } else {
            return res.sendStatus(204);
        }
        // res.send({
        //     modified: modified,
        //     before: req.topic.medias,
        //     after: recovery
        // });
    });
});

router.use('/:topic/medias', require('./media'));

module.exports = router;