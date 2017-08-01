const express = require('express');
const router = express.Router();
const News = require('../models/news');

router.get('/', (req, res) => {
    News.find({
        episode: req.episode._id
    }, (err, news) => {
        res.send(news);
    });
});

router.post('/:news', (req, res) => {
    let news = new News({
        numero: req.params.news,
        episode: req.episode._id,
        titre: ''
    });
    news.save(err => {
        if (err) {
            return res.status(500).send(err);
        }
        res.setHeader('location', req.path);
        return res.sendStatus(201);
    });
});

router.use('/:news', (req, res, next) => {
    News.findOne({
        episode: req.episode._id,
        numero: req.params.news
    }, (err, n) => {
        if (err)
            return res.status(500).send(err);
        if (n === null)
            return res.sendStatus(404);
        req.news = n;
        next();
    });
})

router.get('/:news', (req, res) => {
    return res.send(req.news);
})

router.put('/:news', (req, res) => {
    News.findOneAndUpdate({
        _id: req.news._id
    }, req.body, { new: true }, (err, n) => {

        if (err) {
            return res.status(500).send(err);
        }
        if (n === null) {
            return res.sendStatus(404);
        }
        return res.send(n);
    });
});

router.delete('/:news', (req, res) => {
    News.findOneAndRemove({
        _id: req.news._id
    }, err => {
        if (err) {
            return res.status(500).send(err);
        }
        // il faut renuméroter les autres
        News.find({
            episode: req.episode._id
        }, (err, news) => {
            news.forEach((n, index) => {
                n.numero = index + 1;
                n.save(); //TODO attendre que tous les save soient OK
            })
            return res.sendStatus(204);
        });

    });
});


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