
const express = require('express');
const router = express.Router();

const { Costumer } = require('../models/costumer.js');

// List of Genres 
router.get('/divly/costumers', async (req, res) => {

    const constumer = await Costumer.find()
    return res.status(200).send(constumer);
});

// get Single Genre

router.get('/divly/costumer/:id', async (req, res) => {

    const found = await Costumer.find({ _id: req.params.id }).sort();
    if (!found || found == '') return res.status(404).send("The costumer ID given was not found!!!");

    return res.status(200).send(found);
});

// publish a genre

router.post('/divly/new/costumer', async (req, res) => {

    const costumer = new Costumer();

    costumer.name = req.body.name;
    costumer.phone = req.body.phone;
    costumer.isGold = req.body.isGold;


    costumer.save()

    if (!costumer || costumer == '') return res.status(404).send({ ERROR: "COULD NOT SAVE COSTUMER..." });

    return res.status(200).send({
        message: "Costumer created successfully",
        new_movie: costumer
    });
});

// Get and Update

router.put('/divly/update/costumer/:id', (req, res) => {

    Costumer.findByIdAndUpdate(req.params.id, {

        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold

    }, { new: true }, (err, docs) => {
        if (err) return res.status(404).send("The costumer ID given was not found!!!");
        if (!docs || docs == '') res.status(500).send("Something went wrong...");

        res.status(200).send({
            message: "SUCCESS",
            updated: docs
        });
    });
});

// delete genre

router.delete('/divly/delete/costumer/:id', (req, res) => {

    Costumer.deleteOne({ _id: req.params.id }, (err, docs) => {
        if (err) return res.status(404).send("The costumer ID given was not found!!!");
        if (!docs || docs == '') res.status(404).send("Something went wrong...");

        return res.status(200).send({
            status: "SUCCESS",
            deleted: docs
        });
    });
});

module.exports = router;

