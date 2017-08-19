const express = require('express');
const path = require('path');
const router = express.Router();
const Episode = require('../models/episode')
const News = require('../models/news')
const news = require('./news')

router.get('/', (req, res) => {
    Episode.find({
        emission: req.emission._id
    }).populate({ path: 'emission', select: 'nom' }).sort({ 'numero': -1 }).exec((err, episodes) => {
        res.send(episodes);
    });
});

router.post('/:episode', (req, res, next) => {
    let episode = new Episode({
        numero: req.params.episode,
        nom: req.body.nom,
        emission: req.emission
    });
    episode.save(err => {
        if (err) return next(err);
        res.setHeader('location', req.path);
        return res.sendStatus(201);
    });
});

router.use('/:episode', (req, res, next) => {
    Episode.findOne({
        emission: req.emission._id,
        numero: req.params.episode
    }).populate({ path: 'emission', select: 'nom' }).exec((err, ep) => {
        if (err) return next(err);
        if (ep === null)
            return res.sendStatus(404);
        req.episode = ep;
        next();
    });
})

router.get('/:episode', (req, res) => {
    return res.send(req.episode);
})

router.put('/:episode', (req, res, next) => {
    Episode.findOneAndUpdate({
        _id: req.episode._id
    }, req.body, { new: true }, (err, ep) => {

        if (err) return next(err);
        if (ep === null) {
            return res.sendStatus(404);
        }
        return res.send(ep);
    });
});

router.delete('/:episode', (req, res, next) => {
    Episode.findOneAndRemove({
        _id: req.episode._id
    }, err => {
        if (err) return next(err);
        // TODO supprimer toutes les news et incrusts !
        return res.sendStatus(204);
    });
});

router.get('/:episode/full', (req, res) => {
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
router.use('/:episode/news', news);

module.exports = router;