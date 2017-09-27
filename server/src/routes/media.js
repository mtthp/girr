"use strict";
const express = require('express');
const path = require('path');
const router = express.Router();
const Incrust = require('../models/media');
const Topic = require('../models/topic');
const fileUpload = require('express-fileupload');
const request = require('request');

/**
 * @swagger
 * definitions:
 *   Incrust:
 *     properties:
 *       data:
 *         type: string
 *         description: data value
 *         format: byte
 *         required: true
 *       contentType:
 *         type: string
 *         description: Type of the content ? idk
 */

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

router.use(fileUpload());

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

        Topic.findOne({ _id: incrust.news }, (err, news) => {
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