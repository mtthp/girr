"use strict";
const express = require('express');
const router = express.Router();
const logger = require('../logger');
const Topic = require('../models/topic');
const Media = require('../models/media');
const Episode = require('../models/episode');

/**
 * @swagger
 * definitions:
 *   Topic:
 *     properties:
 *       title:
 *         type: string
 *         description: Topic's title
 *       description:
 *         type: string
 *         description: Some notes that should be useful
 *       position:
 *         type: integer
 *         description: current position, because it can moved
 *         required: true
 */

router.route('/')
  /**
   * @swagger
   * /programs/{programId}/episodes/{episodeId}/topics:
   *   get:
   *     tags:
   *       - Topic
   *     description: Return all topic from an episode
   *     summary: Get all topic
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
   *         description: An array of topics
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Topic'
   */
  .get(function(req, res, next) {
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
   * /programs/{programId}/episodes/{episodeId}/topics:
   *   post:
   *     tags:
   *       - Topic
   *     description: Create a new topic
   *     summary: Add a topic
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

    // provide a title if the user didn't specified one
    if (typeof topic.title === "undefined") {
        topic.title = "Untitled topic"
    }

    // provide a position if the user didn't specified one
    if (typeof topic.position === "undefined") {
        // Max topic position + 1 - inspired by https://stackoverflow.com/a/4020842
        var maxTopicNumber = req.episode.topics.length > 0 ? Math.max.apply(
            Math,
            req.episode.topics.map(function(t){
                return t.position;
            })
        ) : 0;
        topic.position = 1 + maxTopicNumber;
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

// Middleware : we check if the topic exists in the specified program before going further
router.param('topicId', function (req, res, next, value, name) {
  Topic
    .findOne({_id: value, episode: req.episode._id})
    .populate('medias')
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

router.route('/:topicId')
  /**
   * @swagger
   * /programs/{programId}/episodes/{episodeId}/topics/{topicId}:
   *   get:
   *     tags:
   *       - Topic
   *     description: Return a single topic
   *     summary: Get a topic
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
   *       - name: topicId
   *         description: Topic's id
   *         in: path
   *         required: true
   *         type: uuid
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
   * /programs/{programId}/episodes/{episodeId}/topics/{topicId}:
   *   put:
   *     tags:
   *       - Topic
   *     description: Update a single topic
   *     summary: Edit a topic
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
   *       - name: topicId
   *         description: Topic's id
   *         in: path
   *         required: true
   *         type: uuid
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
    req.topic = Object.assign(req.topic, req.body, {modified: Date.now()})
    req.topic
      .save()
      .then(function(topic) {
        logger.debug("Updated " + topic.toString())
        res.json(topic)
      })
      .catch(function(error) {
        next(error)
      })
  })
  /**
   * @swagger
   * /programs/{programId}/episodes/{episodeId}/topics/{topicId}:
   *   delete:
   *     tags:
   *       - Topic
   *     description: Delete a single topic
   *     summary: Remove a topic
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
   *       - name: topicId
   *         description: Topic's id
   *         in: path
   *         required: true
   *         type: uuid
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  .delete(function (req, res, next) {
    req.topic
      .remove()
      .then(function(result) {
        if (result !== null) {
          logger.debug("Removed Topic " + req.params.topicId)
          res.status(204).json(result.toString())
        } else {
          next({message:"Topic " + req.params.topicId + " wasn't deleted", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })

/**
 * @swagger
 * /programs/{programId}/episodes/{episodeId}/topics/{topicId}/move:
 *   get:
 *     tags:
 *       - Topic
 *     description: Move a topic to a new position and reindex the whole list
 *     summary: Move a topic
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
 *       - name: topicId
 *         description: Topic's id
 *         in: path
 *         required: true
 *         type: uuid
 *       - name: position
 *         description: New Topic's position
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Episode updated (Topics list changed if a Topic moves)
 *         schema:
 *           $ref: '#/definitions/Episode'
 */
router.get('/:topicId/move', function (req, res, next) {
  if (!req.query.position) {
    next({message:"A new position is needed to perform a move", status: 417, example: '/move?position=10'})
  }

  /*
   * DISCLAIMER : bon ok c'est pas vraiment ce qu'on veut,
   * mais je m'en sors pas vraiment à essayer d'update l'attribut position d'un Topic
   * est-ce la bonne solution ?
   * comment faire pour à la fois update l'array de Topic d'un Episode et chaque Topic's position ?
   * - @Matthieu Petit
   */
  var newPosition = parseInt(req.query.position)
  for (var i = 0; i < req.episode.topics.length; i++) {
    if (req.episode.topics[i]._id.equals(req.topic._id)) {
      var topicToMove = req.episode.topics[i]
      req.episode.topics.splice(i, 1)
      break
    }
  }

  if (topicToMove) {
    req.episode.topics.splice(newPosition, 0, topicToMove)
    // et on retourne un Episode parce que j'ai vraiment fait ce endpoint à l'arrache - @Matthieu Petit
    req.episode
      .save()
      .then(function(episode) {
        logger.debug("Updated " + episode.toString())
        res.json(episode)
      })
      .catch(function(error) {
        next(error)
      })
  } else {
    next({message:"Couldn't move the Topic at the new position " + newPosition, status: 500})
  }
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

router.use('/:topicId/medias', require('./media'));

module.exports = router;