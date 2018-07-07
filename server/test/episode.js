let server = require('../app')
let Program = require('../src/models/program')
let Episode = require('../src/models/episode')

// Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let expect = chai.expect

chai.use(chaiHttp)

// Our parent block
describe('Episodes', () => {
  let program, episode

  /*
   * Before tests we empty the database
   * and create a fresh Program to test Episodes
   */
  before((done) => {
    Program.remove({}, (err) => { 
      program = new Program({
        name: "A program to test episodes",
        created: Date.now(),
        modified: Date.now()
      })
      program.save((err, savedProgram) => {
        done()
      })
    })
  })

  /*
   * Get all Program's Episodes
   */
  describe('GET /api/programs/:programId/episodes', () => {
    it('it should GET all the Program\'s Episodes', (done) => {
      chai.request(server)
        .get(`/api/programs/${program._id}/episodes`)
        .end((err, res) => {
          expect(err).to.not.be.ok
          res.should.have.status(200)
          res.body.should.be.a('array').be.empty
          done()
        })
    })
  })

  /*
   * Add a new Episode to a Program
   */
  describe('POST /api/programs/:programId/episodes', () => {
    it('it should POST a new Episode', (done) => {
      chai.request(server)
        .post(`/api/programs/${program._id}/episodes`)
        .send({ name: 'A random name' })
        .end((err, res) => {
          expect(err).to.not.be.ok
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id').not.be.empty
          res.body.should.have.property('created')
          res.body.should.have.property('modified').eql(res.body.created)
          res.body.should.have.property('topics').be.a('array').be.empty
          res.body.should.have.property('program').eql(program._id.toString())
          episode = res.body
          done()
        })
    })
  })

  /*
   * Get a single Episode
   */
  describe('GET /api/programs/:programId/episodes/:id', () => {
    it('it should GET a Episode by the given id', (done) => {
      chai.request(server)
        .get(`/api/programs/${program._id}/episodes/${episode._id}`)
        .end((err, res) => {
          expect(err).to.not.be.ok
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id').eql(episode._id.toString())
          res.body.should.have.property('name').eql(episode.name)
          res.body.should.have.property('created')
          res.body.should.have.property('modified').eql(res.body.created)
          res.body.should.have.property('topics').be.a('array').be.empty
          res.body.should.have.property('program').eql(program._id.toString())
          done()
        })
    })
  })

  /*
   * Update a single Episode
   */
  describe('PUT /api/programs/:programId/episodes/:id', () => {
    it('it should UPDATE an Episode given the id', (done) => {
      data = {
        name: "A new name to test"
      }
      chai.request(server)
        .put(`/api/programs/${program._id}/episodes/${episode._id}`)
        .send(data)
        .end((err, res) => {
          expect(err).to.not.be.ok
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id').eql(episode._id.toString())
          res.body.should.have.property('name').eql(data.name)
          res.body.should.have.property('created')
          res.body.should.have.property('modified').not.eql(res.body.created)
          res.body.should.have.property('topics').be.a('array')
          res.body.should.have.property('program').eql(program._id.toString())
          done()
        })
    })
  })
 
  /*
   * Delete a single Episode
   */
  describe('DELETE /api/programs/:programId/episodes/:id', () => {
    it('it should DELETE an Episode given the id', (done) => {
      chai.request(server)
        .delete(`/api/programs/${program._id}/episodes/${episode._id}`)
        .end((err, res) => {
          expect(err).to.not.be.ok
          res.should.have.status(204)
          res.body.should.be.empty
          done()
        })
    })
  })
})