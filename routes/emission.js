const express = require('express');
const router = express.Router();
const Emission = require('../models/emission')
const episode = require('./episode')

router.get('/', (req, res) => {
    Emission.find((err, emissions) => {
        res.send(emissions);
    })
});

router.post('/:emission', (req, res) => {
    let emission = new Emission({ nom: req.params.emission });
    emission.save(err => {
        if (err) {
            return res.status(500).send(err);
        }
        res.setHeader('location', `api/emissions/${emission.nom}`);
        return res.sendStatus(201);
    });
});

router.use('/:emission', (req, res, next) => {
    Emission.findOne({
        nom: req.params.emission
    }, (err, emission) => {
        if (err) {
            return res.status(500).send(err);
        }
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

router.put('/:emission', (req, res) => {
    Emission.findOneAndUpdate({
        nom: req.params.emission
    }, req.body, { new: true }, (err, emission) => {

        if (err) {
            return res.status(500).send(err);
        }
        if (emission === null) {
            return res.sendStatus(404);
        }
        return res.send(emission);
    });
});

router.delete('/:emission', (req, res) => {
    Emission.findOneAndRemove({
        nom: req.params.emission
    }, err => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.sendStatus(204);
    });
});

router.use('/:emission/episodes', episode);

module.exports = router;