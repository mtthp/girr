const express = require('express');
const path = require('path');
const router = express.Router();
const News = require('../models/news');
const Incrust = require('../models/incrust');
const incrustRoute = require('./incrust');

router.get('/', (req, res, next) => {
    News.find({
        episode: req.episode._id
    }, null, { sort: { 'numero': 1 } }).lean().exec((err, news) => {
        news.forEach(n => {
            // Map the incrusts to build their URI while keeping their ID
            n.incrusts = n.incrusts.map(incrust => {
                return {
                    "path": path.join(req.originalUrl, n.numero.toString(), 'incrusts', incrust.toString()),
                    "id": incrust
                };
            });
        });

        if (err) return next(err);
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
        if (err) return next(err);
        res.setHeader('location', req.path);
        return res.sendStatus(201);
    });
});

router.use('/:news', (req, res, next) => {
    News.findOne({
        episode: req.episode._id,
        numero: req.params.news
    }, (err, n) => {
        if (err) return next(err);
        if (n === null)
            return res.sendStatus(404);
        req.news = n;
        next();
    });
})

router.get('/:news', (req, res) => {
    let n = req.news.toObject();
    n.incrusts = n.incrusts.map(incrust => path.join(req.originalUrl, 'incrusts', incrust.toString()));
    return res.send(n);
})

router.put('/:news', (req, res, next) => {
    // Map the incrusts back to an array of objectIds
    req.body.incrusts = req.body.incrusts.map(incrust => incrust.id);
    let news = req.body;
    delete news._id;
    News.findOneAndUpdate({
        _id: req.news._id
    }, news, { new: true }, (err, n) => {
        if (err) return next(err);
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
        if (err) return next(err);
        // il faut renuméroter les autres
        Incrust.remove({
            news: req.news._id
        }, err => {
            if (err) return next(err);
            News.find({
                episode: req.episode._id
            }, (err, news) => {
                if (err) return next(err);
                news.forEach((n, index) => {
                    n.numero = index + 1;
                    n.save(); //TODO attendre que tous les save soient OK
                });
                return res.sendStatus(204);
            });
        });
    });
});

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

router.use('/:news/incrusts', incrustRoute);

module.exports = router;