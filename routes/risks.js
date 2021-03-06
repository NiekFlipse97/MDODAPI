const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Risk = require('../models/Risk');
const global = require('../globalFunctions');

router.route('/:riskId?')
    .get((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));
        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            const email = payload.sub;
            db.query("SELECT riskId, description FROM mdod.Risk WHERE email = ?", [email], (error, rows, fields) => {
                if (error) {
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }
                res.status(200).json(rows);
            });
        });
    })
    .post((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));
        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
            }
            const email = payload.sub;
            const description = req.body.description || '';

            const risk = new Risk(description);

            if (risk._description) {
                db.query("INSERT INTO mdod.Risk(email, description) VALUES(?, ?)", [email, risk._description], (error, result) => {
                    if (error) {
                        console.log(error);
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }

                    res.status(201).json({
                        riskId: result.insertId,
                        message: "Risk aangemaakt"
                    })
                })
            } else {
                if (!risk._description) {
                    res.status(400).json({
                        message: "Emoji not allowed"
                    });
                } else {
                    res.status(risk.code).json(goal);
                }
            }
        });
    })
    .delete((req, res) => {
        // Get the token from the request
        const token = global.stripBearerToken(req.header('Authorization'));

        // Decode the token.
        auth.decodeToken(token, (error, payload) => {
            // If token is not valid. Return noValidToken error to the user
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            // Get the riskId from the request. The risk with this id wil be deleted
            const riskId = req.params.riskId;

            // Get the email of the person who would like to delete the risk.
            const email = payload.sub;
            db.query("DELETE FROM mdod.Risk WHERE riskId = ? AND email = ?", [riskId, email], (error, result) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }

                if (result.affectedRows < 1) {
                    console.log("0 rows affected");
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                }

                res.status(200).json({
                    message: "Risk verwijderd."
                })
            })
        })
    })
    .put((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            // Get the email of the user that would like to update the risk.
            const email = payload.sub;

            // Get the id of the risk that needs to be updated.
            const riskId = req.params.riskId || '';

            // Get the new description.
            const description = req.body.description || '';

            // The new risk.
            const risk = new Risk(description);

            db.query("UPDATE mdod.Risk SET description = ? WHERE riskId = ? AND email = ?", [risk._description, riskId, email], (error, result) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }

                if (result.affectedRows < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                }

                res.status(202).json({
                    message: "Risk geüpdated."
                })
            })
        });
    });
module.exports = router;