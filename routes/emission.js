const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const fileUpload = require('express-fileupload');

router.use('/:emission/:episode', (req, res, next) => {
    req.publicPathToIncrusts = `assets/${req.params.emission}/${req.params.episode}`;
    req.localPathToIncrusts = path.join('public', req.publicPathToIncrusts);
    next();
});

router.get('/:emission/:episode/incrusts', (req, res) => {
    let incrusts = [];

    fs.readdir(req.localPathToIncrusts, (err, files) => {
        if(err) {
            return res.status(404).send(err);
        }
        if(files) {
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