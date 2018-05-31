const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Goal = require('../models/Goal');
const Risk = require('../models/Risk');

router.route('/goal/:goalId?')
    .get((req, res) => {
        const token = req.header('X-Access-Token');
        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            const email = payload.sub;
            db.query("SELECT goalId, description FROM mdod.Goal WHERE email = ?", [email], (error, rows, fields) => {
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
        const token = req.header('X-Access-Token') || '';
        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
            }
            const email = payload.sub;
            const description = req.body.description || '';

            const goal = new Goal(description);

            if (goal._description) {
                db.query("INSERT INTO mdod.Goal(email, description) VALUES(?, ?)", [email, goal._description], (error, result) => {
                    if (error) {
                        console.log(error);
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }

                    res.status(201).json({
                        message: "Goal aangemaakt"
                    })
                })
            } else {
                res.status(goal.code).json(goal);
            }
        });
    })
    .delete((req, res) => {
        // Get the token from the request
        const token = req.header('X-Access-Token') || '';

        // Decode the token.
        auth.decodeToken(token, (error, payload) => {
            // If token is not valid. Return noValidToken error to the user
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            // Get the goalId from the request. The goal with this id wil be deleted
            const goalId = req.params.goalId;

            // Get the email of the person who would like to delete the goal.
            const email = payload.sub;
            db.query("DELETE FROM mdod.Goal WHERE goalId = ? AND email = ?", [goalId, email], (error, result) => {
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
                    message: "Goal verwijderd."
                })
            })
        })
    })
    .put((req, res) => {
        const token = req.header('X-Access-Token') || '';

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            // Get the email of the user that would like to update the goal.
            const email = payload.sub;

            // Get the id of the goal that needs to be updated.
            const goalId = req.params.goalId || '';

            // Get the new description.
            const description = req.body.description || '';

            // The new goal.
            const goal = new Goal(description);

            db.query("UPDATE mdod.Goal SET description = ? WHERE goalId = ? AND email = ?", [goal._description, goalId, email], (error, result) => {
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
                    message: "Goal geüpdated."
                })
            })
        })
    });

//Risk routes
router.route('/risk/:riskId?')
    .get((req, res) => {
        const token = req.header('X-Access-Token');
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
        const token = req.header('X-Access-Token') || '';
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
                        message: "Risk aangemaakt"
                    })
                })
            } else {
                res.status(risk.code).json(goal);
            }
        });
    })
    .delete((req, res) => {
        // Get the token from the request
        const token = req.header('X-Access-Token') || '';

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
        const token = req.header('X-Access-Token') || '';

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            console.log(req);

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
        })
    });

router.get('/all/:role', (req, res) => {
    const token = (req.header('X-Access-Token')) || '';
    const role = req.params.role;
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            if (role === 'client') {
                const email = payload.sub;
                db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows) => {
                    if (error) {
                        const err = Errors.unknownError();
                        res.status(err.code).json(err);
                        return;
                    }
                    if (rows.length < 1) {
                        let error = Errors.notFound();
                        res.status(error.code).json(error);
                        return;
                    }
                    if (rows.length > 0) {
                        db.query("SELECT email, firstname, infix, lastname FROM mdod.Client", [email], (error, rows) => {
                            if (error) {
                                const err = Errors.unknownError();
                                res.status(err.code).json(err);
                                return;
                            }
                            if (rows.length < 1) {
                                let error = Errors.notFound();
                                res.status(error.code).json(error);
                                return;
                            }
                            if (rows.length > 0) {
                                res.status(200).json(rows);
                            }
                        });
                    }
                });
            } else {
                const err = Errors.badRequest();
                res.status(err.code).json(err);
            }
        }
    });
});

router.post('/specific/:role', (req, res) => {
    const token = (req.header('X-Access-Token')) || '';
    const role = req.params.role;
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            if (role === 'client') {
                const email = payload.sub;
                const client_email = req.body.email || "";
                db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows) => {
                    if (error) {
                        const err = Errors.unknownError();
                        res.status(err.code).json(err);
                        return;
                    }
                    if (rows.length < 1) {
                        let error = Errors.notFound();
                        res.status(error.code).json(error);
                        return;
                    }
                    if (rows.length > 0) {
                        db.query("SELECT email, contact, phonenumber, birthday, city, adress, zipcode, firstname, infix, lastname FROM mdod.Client WHERE email = ?;", [client_email], (error, rows) => {
                            if (error) {
                                const err = Errors.unknownError();
                                res.status(err.code).json(err);
                                return;
                            }
                            if (rows.length < 1) {
                                let error = Errors.notFound();
                                res.status(error.code).json(error);
                                return;
                            }
                            if (rows.length > 0) {
                                res.status(200).json(rows);
                            }
                        });
                    }
                });
            } else {
                const err = Errors.badRequest();
                res.status(err.code).json(err);
            }
        }
    });
});

router.put('/pickclient', (req, res) => {
    const token = (req.header('X-Access-Token')) || '';
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            const client_email = req.body.email || "";
            db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows) => {
                if (error) {
                    console.log(error);
                    const err = Errors.unknownError();
                    res.status(err.code).json(err);
                    return;
                }
                if (rows.length < 1) {
                    let error = Errors.notFound();
                    res.status(error.code).json(error);
                }
                else if (rows.length > 0) {
                    db.query("UPDATE mdod.Client SET contact = ? WHERE email = ?", [email, client_email], (error, result) => {
                        if (error) {
                            console.log(error);
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                        }
                        res.status(202).json({message: "Client Aangepast"});
                    });
                }
            });
        }
    });
});

router.get('/clients-by-psychologist', (req, res) => {
    const token = (req.header('X-Access-Token')) || '';
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            db.query("SELECT email, firstname, infix, lastname FROM mdod.Client WHERE contact = ?", [email], (error, rows) => {
                if (error) {
                    console.log(error);
                    const err = Errors.unknownError();
                    res.status(err.code).json(err);
                }
                res.status(200).json(rows)
            });
        }
    });
});

module.exports = router;