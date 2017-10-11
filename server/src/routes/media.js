"use strict";
const express = require('express');
const router = express.Router();
const logger = require('../logger');
const Media = require('../models/media');
const Topic = require('../models/topic');
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

/**
 * @swagger
 * definitions:
 *   Media:
 *     properties:
 *       label:
 *         type: string
 *         description: Media's label
 *       uri:
 *         type: string
 *         description: Path to the media file
 *         required: true
 */

router.route('/')
  /**
   * @swagger
   * /programs/{programId}/episodes/{episodeId}/topics/{topicId}/medias:
   *   get:
   *     tags:
   *       - Media
   *     description: Return all medias from an topic
   *     summary: Get all medias
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
   *         description: An array of medias
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Media'
   */
  .get(function(req, res, next) {
    Media
        .find({ topic: req.topic._id })
        .sort({ 'position': 1 })
        .then(function(medias) {
            logger.debug("Found " + (medias.length ? medias.toString() : 0 + " medias"))
            res.json(medias)
        })
        .catch(function(error) {
            next(error)
        });
  })
  /**
   * @swagger
   * /programs/{programId}/episodes/{episodeId}/topics/{topicId}/medias:
   *   post:
   *     tags:
   *       - Media
   *     description: Create a new media
   *     summary: Add a media
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
   *       - name: media
   *         in: body
   *         description: Fields for the Media resource
   *         schema:
   *           type: array
   *           $ref: '#/definitions/Media'
   *       - name: file
   *         in: formData
   *         description: The actual media (picture, video, anything)
   *         type: file
   *     responses:
   *       200:
   *         description: Successfully created
   *         schema:
   *           $ref: '#/definitions/Media'
   */
  .post(upload.single('file'), function (req, res, next) {
    "use strict";
    let media = new Media(Object.assign(req.body, {created: Date.now(), modified: Date.now()}))
    media.topic = req.topic._id

    if (req.file) {
      logger.debug('Receive a file : ')
      logger.debug(req.file)
      // provide a label if the user didn't specified one
      if (typeof media.label === "undefined") { // something is wrong, the label cannot be sent in the request body
        media.label = req.file.originalname
      }
      media.path = req.file.path
      media.uri = '/' + media.path // should be calculate automatically from the path instead
      media.mimeType = req.file.mimetype
    // } else if (media.uri) { // otherwise, tries to download the file and place it under the data directory
    //   if (typeof media.label === "undefined") {
    //     media.label = "untitled"
    //   }
    } else {
      next({message:"No media file or URI was provided", status: 417})
    }

    media
      .save()
      .then(function(media) {
        logger.debug("Added a new Media " + media.toString())
        // add media to topic to retrieve them all by using 'populate'
        req.topic.medias.push(media)
        req.topic.save()

        res.json(media)
      })
      .catch(function(error) {
        next(error)
      })
  })

// Middleware : we check if the media exists in the specified topic before going further
router.param('mediaId', function (req, res, next, value, name) {
  Media
    .findOne({_id: value, topic: req.topic._id})
    .then(function(media) {
      if (media !== null) {
        logger.debug("Found " + media.toString())
        req.media = media
        next()
      } else {
        next({message:"Media " + value + " was not found", status: 404})
      }
    })
    .catch(function(error) {
      next(error)
    })
})

router.route('/:mediaId')
  /**
   * @swagger
   * /programs/{programId}/episodes/{episodeId}/topics/{topicId}/medias/{mediaId}:
   *   get:
   *     tags:
   *       - Media
   *     description: Return a single media
   *     summary: Get a media
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
   *       - name: mediaId
   *         description: Media's id
   *         in: path
   *         required: true
   *         type: uuid
   *     responses:
   *       200:
   *         description: A single Media
   *         schema:
   *           $ref: '#/definitions/Media'
   */
  .get(function (req, res, next) {
    res.send(req.media)
  })
  /**
   * @swagger
   * /programs/{programId}/episodes/{episodeId}/topics/{topicId}/medias/{mediaId}:
   *   put:
   *     tags:
   *       - Media
   *     description: Update a single media
   *     summary: Edit a media
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
   *       - name: mediaId
   *         description: Media's id
   *         in: path
   *         required: true
   *         type: uuid
   *       - name: media
   *         in: body
   *         description: Fields for the Media resource
   *         schema:
   *           type: array
   *           $ref: '#/definitions/Media'
   *     responses:
   *       200:
   *         description: Successfully updated
   *         schema:
   *           $ref: '#/definitions/Media'
   */
  .put(function (req, res, next) {
    Media
      // use findOneAndUpdate to get the new result (even if we already found the resource in the DB)
      .findOneAndUpdate({_id: req.media._id, topic: req.topic._id}, Object.assign(req.body, {modified: Date.now()}), {new : true})
      .then(function(media) {
        if (media !== null) {
          logger.debug("Updated " + media.toString())
          res.json(media)
        } else {
          next({message:"Media " + req.media._id + " wasn't updated", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })
  /**
   * @swagger
   * /programs/{programId}/episodes/{episodeId}/topics/{topicId}/medias/{mediaId}:
   *   delete:
   *     tags:
   *       - Media
   *     description: Delete a single media
   *     summary: Remove a media
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
   *       - name: mediaId
   *         description: Media's id
   *         in: path
   *         required: true
   *         type: uuid
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  .delete(function (req, res, next) {
    req.media
      .remove()
      .then(function(result) {
        if (result !== null) {
          logger.debug("Removed Media " + req.params.mediaId)
          res.status(204).json(result.toString())
        } else {
          next({message:"Media " + req.params.mediaId + " wasn't deleted", status: 417})
        }
      })
      .catch(function(error) {
        next(error)
      })
  })









/* legacy code below this line */



const path = require('path');
const request = require('request');

router.get('/', (req, res) => {
    return res.send(req.topic.medias);
});

router.get('/:incrust', (req, res, next) => {
    Incrust.findOne({ _id: req.params.incrust }, (err, incrust) => {
        if (err) return next(err);
        if (incrust) {
            res.contentType = incrust.contentType;
            res.setHeader('content-type', incrust.contentType);
            return res.send(incrust.data);
        }
        return res.sendStatus(404);
    });

    // Incrust.find({ news: req.news._id }, (err, incrusts) => {
    //     if(err) return next(err);

    //     if (req.params.incrust < incrusts.length) {
    //         let incrust = incrusts[req.params.incrust];
    //         res.contentType = incrust.contentType;
    //         res.setHeader('content-type', incrust.contentType);
    //         return res.send(incrust.data);
    //     }
    //     return res.sendStatus(404);
    // });
});

// router.use(fileUpload());

router.post('/', (req, res, next) => {
    // soit on envoie des fichiers directements, soit des urls en texte
    if (!req.files) {
        // on recoit directement des url
        let uri = req.body.uri;
        console.log(uri);


        request({ url: uri, encoding: null }, (error, response, body) => {
            let incrust = new Incrust({
                news: req.news._id,
                data: body,
                contentType: response.headers['content-type']
            });
            incrust.save(err => {
                if (err) return next(err);
                req.news.incrusts.push(incrust);
                req.news.save(err => {
                    if (err) return next(err);
                    res.setHeader('location', path.join(req.originalUrl, incrust._id.toString()));
                    return res.sendStatus(201);
                });
            });
        });
    } else {
        // .incrust est le nom du form
        // let incrustFile = req.files.incrust;
        // incrustFile.mv(path.join(req.localPathToIncrusts, req.files.incrust.name), err => {
        //     if (err)
        //         return res.status(500).send(err);
        //     res.send('File uploaded!');
        // });
        return res.send(req.news.incrusts);
    }
});

router.delete('/:incrust', (req, res, next) => {
    Incrust.findOneAndRemove({
        _id: req.params.incrust
    }, (err, incrust) => {
        if (err) return next(err);

        Media.findOne({ _id: incrust.news }, (err, news) => {
            if (err) return next(err);
            if (news) {
                let indexIncrustToRemove = news.incrusts.indexOf(incrust._id);
                if (indexIncrustToRemove !== -1) {
                    news.incrusts.splice(indexIncrustToRemove, 1);
                    news.save(err => {
                        if (err) return next(err);
                        return res.sendStatus(204);
                    });
                } else {
                    return res.sendStatus(204);
                }
            } else {
                return res.sendStatus(204);
            }
        });
    });
});

module.exports = router;