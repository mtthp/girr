const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/:emission/:episode/incrusts', (req, res) => {
    let incrusts = [];
    let publicPathToIncrusts = `assets/${req.params.emission}/${req.params.episode}`;
    let localPathToIncrusts = path.join('public', publicPathToIncrusts);
    fs.readdir(localPathToIncrusts, (err, files) => {
        if(err) {
            return res.status(404).send(err);
        }
        if(files) {
            incrusts = files.map(f => path.join(publicPathToIncrusts, f));
        }
        return res.send(incrusts);
    });
});

module.exports = router;