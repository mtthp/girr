//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let server = require('../app')
let mongoose = require('mongoose')
let Program = require('../src/models/program')

// Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let expect = chai.expect

chai.use(chaiHttp)

// remove console logs from the server
const winston = require('winston')
let logger = require('../src/logger')
logger.remove(winston.transports.Console)

// Our parent block
describe('Programs', () => {
  before((done) => { // Before each test we empty the database
    Program.remove({}, (err) => { 
      done()
    })
  })

  /*
   * Get all Programs
   */
  describe('GET /api/programs', () => {
    it('it should GET all the programs', (done) => {
      chai.request(server)
        .get('/api/programs')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(0)
          done()
        })
    })
  })

  let program = {
    name: "A cool program that talks about anything and everything"
  }

  /*
   * Add a new Program
   */
  describe('POST /api/programs', () => {
    it('it should POST a new program', (done) => {
      chai.request(server)
        .post('/api/programs')
        .send(program)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('name')
          res.body.should.have.property('created')
          res.body.should.have.property('modified')
          res.body.should.have.property('episodes')
          res.body.episodes.should.be.a('array')
          program = res.body
          done()
        })
    })
  })

  /*
   * Get a single Program
   */
  describe('GET /api/programs/:id', () => {
    it('it should GET a program by the given id', (done) => {
      let program = new Program({
        name: "A cool program that talks about anything and everything",
        created: Date.now(),
        modified: Date.now()
      })
      program.save((err, savedProgram) => {
        expect(err).to.not.be.ok
        chai.request(server)
          .get('/api/programs/' + savedProgram.id)
          .send(savedProgram)
          .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('name')
              res.body.should.have.property('created')
              res.body.should.have.property('modified')
              res.body.should.have.property('episodes')
              res.body.should.have.property('_id').eql(savedProgram.id)
            done()
          })
      })
    })
  })

  /*
   * Update a single Program
   */
  describe('PUT /api/programs/:id', () => {
    it('it should UPDATE a program given the id', (done) => {
      let program = new Program({
        name: "A cool program that talks about anything and everything",
        created: Date.now(),
        modified: Date.now()
      })
      program.save((err, savedProgram) => {
        expect(err).to.not.be.ok
        data = {
          name: "A super cool program"
        }
        chai.request(server)
          .put('/api/programs/' + savedProgram.id)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('name').eql(data.name)
            res.body.should.have.property('created')
            res.body.should.have.property('modified').not.eql(res.body.should.have.property('created'))
            res.body.should.have.property('episodes')
            res.body.should.have.property('_id').eql(savedProgram.id)
            done()
          })
      })
    })
  })
 
  /*
   * Delete a single Program
   */
  describe('DELETE /api/programs/:id', () => {
    it('it should DELETE a progam given the id', (done) => {
      let program = new Program({
        name: "A cool program that talks about anything and everything",
        created: Date.now(),
        modified: Date.now()
      })
      program.save((err, savedProgram) => {
        expect(err).to.not.be.ok
        chai.request(server)
          .delete('/api/programs/' + savedProgram.id)
          .end((err, res) => {
            res.should.have.status(204)
            res.body.should.be.empty
            done()
          })
      })
    })
  })
})