const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const fileUpload = require('express-fileupload');

router.use('/:emission/:episode', (req, res, next) => {
    req.publicPathToIncrusts = `assets/emissions/${req.params.emission}/${req.params.episode}`;
    req.localPathToIncrusts = path.join('public', req.publicPathToIncrusts);
    next();
});

router.get('/:emission/:episode', (req, res) => {
    let episode = {
        title: 'Bits 59',
        news: [
            {
                title: 'Hyperloop One le test fonctionnel',
                incrusts: [
                    '/assets/emissions/bits/59/0.jpg',
                    '/assets/emissions/bits/59/1.jpg'
                ]
            },
            {
                title: 'DeepMind sait marcher',
                incrusts: [
                    '/assets/emissions/bits/59/2.png',
                    '/assets/emissions/bits/59/3.gif'
                ]
            },
            {
                title: 'Hyperloop One le test fonctionnel',
                incrusts: [
                    '/assets/emissions/bits/59/0.jpg',
                    '/assets/emissions/bits/59/1.jpg'
                ]
            },
            {
                title: 'DeepMind sait marcher',
                incrusts: [
                    '/assets/emissions/bits/59/2.png',
                    '/assets/emissions/bits/59/3.gif'
                ]
            },
            {
                title: 'Hyperloop One le test fonctionnel',
                incrusts: [
                    '/assets/emissions/bits/59/0.jpg',
                    '/assets/emissions/bits/59/1.jpg'
                ]
            },
            {
                title: 'DeepMind sait marcher',
                incrusts: [
                    '/assets/emissions/bits/59/2.png',
                    '/assets/emissions/bits/59/3.gif'
                ]
            }
        ]
    };
    console.log(`returning episode`);
    return res.send(episode);
    // fs.readdir(req.localPathToIncrusts, (err, files) => {
    //     if(err) {
    //         return res.status(404).send(err);
    //     }
    //     if(files) {
    //         incrusts = files.map(f => path.join(req.publicPathToIncrusts, f));
    //     }
    //     return res.send(incrusts);
    // });
});

router.get('/:emission/:episode/incrusts', (req, res) => {
    let incrusts = [];

    fs.readdir(req.localPathToIncrusts, (err, files) => {
        if (err) {
            return res.status(404).send(err);
        }
        if (files) {
            incrusts = files.map(f => path.join(req.publicPathToIncrusts, f));
        }
        return res.send(incrusts);
    });
});

router.use(fileUpload());

router.post('/:emission/:episode/incrusts', (req, res) => {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let incrustFile = req.files.incrust;

    incrustFile.mv(path.join(req.localPathToIncrusts, req.files.incrust.name), err => {
        if (err)
            return res.status(500).send(err);
        res.send('File uploaded!');
    });
});

module.exports = router;