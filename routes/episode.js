const express = require('express');
const router = express.Router();
const Episode = require('../models/episode')
const News = require('../models/news')
const news = require('./news')

router.get('/', (req, res) => {
    Episode.find({
        emission: req.emission._id
    }).populate({ path: 'emission', select: 'nom' }).exec((err, episodes) => {
        res.send(episodes);
    });
});

router.post('/:episode', (req, res) => {
    let episode = new Episode({
        numero: req.params.episode,
        nom: req.body.nom,
        emission: req.emission
    });
    episode.save(err => {
        if (err) {
            return res.status(500).send(err);
        }
        res.setHeader('location', req.path);
        return res.sendStatus(201);
    });
});

router.use('/:episode', (req, res, next) => {
    Episode.findOne({
        emission: req.emission._id,
        numero: req.params.episode
    }).populate({ path: 'emission', select: 'nom' }).exec((err, ep) => {
        if (err)
            return res.status(500).send(err);
        if (ep === null)
            return res.sendStatus(404);
        req.episode = ep;
        next();
    });
})

router.get('/:episode', (req, res) => {
    return res.send(req.episode);
})

router.put('/:episode', (req, res) => {
    Episode.findOneAndUpdate({
        _id: req.episode._id
    }, req.body, { new: true }, (err, ep) => {

        if (err) {
            return res.status(500).send(err);
        }
        if (ep === null) {
            return res.sendStatus(404);
        }
        return res.send(ep);
    });
});

router.delete('/:episode', (req, res) => {
    Episode.findOneAndRemove({
        _id: req.episode._id
    }, err => {
        if (err) {
            return res.status(500).send(err);
        }
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
    }, {'_id': 0, 'numero': 1, 'titre': 1, 'incrusts': 1}, (err, news) => {
        let nomCapitalFirst = req.emission.nom.charAt(0).toUpperCase() + req.emission.nom.slice(1);
        let episodeFull = {
            titre: `${nomCapitalFirst} ${req.episode.numero}`,
            news: news
        };
        res.send(episodeFull);
    });

});
router.use('/:episode/news', news);

// router.use('/:emission/:episode', (req, res, next) => {
//     req.publicPathToIncrusts = `assets/emissions/${req.params.emission}/${req.params.episode}`;
//     req.localPathToIncrusts = path.join('public', req.publicPathToIncrusts);
//     next();
// });

// router.get('/:emission/:episode', (req, res) => {
//     let episode = {
//         title: 'Bits 59',
//         news: [
//             {
//                 title: 'Hyperloop One le test fonctionnel',
//                 incrusts: [
//                     '/assets/emissions/bits/59/0.jpg',
//                     '/assets/emissions/bits/59/1.jpg'
//                 ]
//             },
//             {
//                 title: 'DeepMind sait marcher',
//                 incrusts: [
//                     '/assets/emissions/bits/59/2.png',
//                     '/assets/emissions/bits/59/3.gif'
//                 ]
//             },
//             {
//                 title: 'Hyperloop One le test fonctionnel',
//                 incrusts: [
//                     '/assets/emissions/bits/59/0.jpg',
//                     '/assets/emissions/bits/59/1.jpg'
//                 ]
//             },
//             {
//                 title: 'DeepMind sait marcher',
//                 incrusts: [
//                     '/assets/emissions/bits/59/2.png',
//                     '/assets/emissions/bits/59/3.gif'
//                 ]
//             },
//             {
//                 title: 'Hyperloop One le test fonctionnel',
//                 incrusts: [
//                     '/assets/emissions/bits/59/0.jpg',
//                     '/assets/emissions/bits/59/1.jpg'
//                 ]
//             },
//             {
//                 title: 'DeepMind sait marcher',
//                 incrusts: [
//                     '/assets/emissions/bits/59/2.png',
//                     '/assets/emissions/bits/59/3.gif'
//                 ]
//             }
//         ]
//     };
//     console.log(`returning episode`);
//     return res.send(episode);
//     // fs.readdir(req.localPathToIncrusts, (err, files) => {
//     //     if(err) {
//     //         return res.status(404).send(err);
//     //     }
//     //     if(files) {
//     //         incrusts = files.map(f => path.join(req.publicPathToIncrusts, f));
//     //     }
//     //     return res.send(incrusts);
//     // });
// });

// router.get('/:emission/:episode/incrusts', (req, res) => {
//     let incrusts = [];

//     fs.readdir(req.localPathToIncrusts, (err, files) => {
//         if (err) {
//             return res.status(404).send(err);
//         }
//         if (files) {
//             incrusts = files.map(f => path.join(req.publicPathToIncrusts, f));
//         }
//         return res.send(incrusts);
//     });
// });

// router.use(fileUpload());

// router.post('/:emission/:episode/incrusts', (req, res) => {
//     if (!req.files)
//         return res.status(400).send('No files were uploaded.');

//     let incrustFile = req.files.incrust;

//     incrustFile.mv(path.join(req.localPathToIncrusts, req.files.incrust.name), err => {
//         if (err)
//             return res.status(500).send(err);
//         res.send('File uploaded!');
//     });
// });


module.exports = router;