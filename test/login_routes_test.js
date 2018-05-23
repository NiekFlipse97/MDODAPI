const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')

chai.should()
chai.use(chaiHttp)

describe('Client login', function(){
    this.timeout(10000)

    it('CLIENT: should return a token when providing valid information', (done) => {
        chai.request(index)
            .post('/api/login/client')
            .set('Content-Type', 'application/json')
            .send({
                "email": "sam@gmail.com",
                "password": "wachtwoord3"
            })
            .end((err, res) => {
                res.should.have.status(200);
                const response = res.body;
                response.should.have.property('token');
                res.body.should.be.a('object');
                done()
            })
    });

    it('PSYCHOLOGIST: should return a token when providing valid information', (done) => {
        chai.request(index)
            .post('/api/login/psychologist')
            .set('Content-Type', 'application/json')
            .send({
                "email": "stijnboz@live.nl",
                "password": "wachtwoord"
            })
            .end((err, res) => {
                res.should.have.status(200);
                const response = res.body;
                response.should.have.property('token');
                res.body.should.be.a('object');
                done()
            })
    });

    it('CLIENT: should throw an error when email does not exist', (done) => {
        chai.request(index)
            .post('/api/login/client')
            .set('Content-Type', 'application/json')
            .send({
                "email": "nietbestaanemail@email.nl",
                "password": "secret"
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done()
            })
    });

    it('PSYCHOLOGIST: should throw an error when email does not exist', (done) => {
        chai.request(index)
            .post('/api/login/psychologist')
            .set('Content-Type', 'application/json')
            .send({
                "email": "nietbestaanemail@email.nl",
                "password": "wachtwoord"
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done()
            })
    });

});