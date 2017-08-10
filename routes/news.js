const express = require('express');
const path = require('path');
const router = express.Router();
const News = require('../models/news');
const Incrust = require('../models/incrust');
const incrustRoute = require('./incrust');

router.get('/', (req, res, next) => {
    News.find({
        episode: req.episode._id
    }).lean().exec((err, news) => {

        news.forEach(n => {
            n.incrusts = n.incrusts.map(incrust => path.join(req.originalUrl, n.numero.toString(),'incrusts',  incrust.toString()));
        });
        if(err) return next(err);
        res.send(news);
    });
});

router.post('/:news', (req, res, next) => {
    let news = new News({
        numero: req.params.news,
        episode: req.episode._id,
        titre: ''
    });
    news.save(err => {
        if(err) return next(err);
        res.setHeader('location', req.path);
        return res.sendStatus(201);
    });
});

router.use('/:news', (req, res, next) => {
    News.findOne({
        episode: req.episode._id,
        numero: req.params.news
    }, (err, n) => {
        if(err) return next(err);
        if (n === null)
            return res.sendStatus(404);
        req.news = n;
        next();
    });
})

router.get('/:news', (req, res) => {
    let n = req.news.toObject();
    n.incrusts = n.incrusts.map(incrust => path.join(req.originalUrl, 'incrusts',  incrust.toString()));
    return res.send(n);
})

router.put('/:news', (req, res, next) => {
    News.findOneAndUpdate({
        _id: req.news._id
    }, req.body, { new: true }, (err, n) => {
        if(err) return next(err);
        if (n === null) {
            return res.sendStatus(404);
        }
        return res.send(n);
    });
});

router.delete('/:news', (req, res, next) => {
    News.findOneAndRemove({
        _id: req.news._id
    }, err => {
        if(err) return next(err);
        // il faut renuméroter les autres
        Incrust.remove({
            news: req.news._id
        }, err => {
            if(err) return next(err);
            News.find({
                episode: req.episode._id
            }, (err, news) => {
                if(err) return next(err);
                news.forEach((n, index) => {
                    n.numero = index + 1;
                    n.save(); //TODO attendre que tous les save soient OK
                });
                return res.sendStatus(204);
            });
        });
    });
});

router.use('/:news/incrusts', incrustRoute);

module.exports = router;