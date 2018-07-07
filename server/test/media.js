let server = require('../app')
let Program = require('../src/models/program')
let Episode = require('../src/models/episode')
let Topic = require('../src/models/topic')
let Media = require('../src/models/media')

// Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let expect = chai.expect
const path = require('path')

chai.use(chaiHttp)

// Our parent block
describe('Medias', () => {
  let program, episode, topic, media

  /*
   * Before tests we empty the database
   * and create a fresh Episode to test Topics
   */
  before((done) => {
    Program.remove({}, (err) => { 
      program = new Program({
        name: "A program to test episodes",
        created: Date.now(),
        modified: Date.now()
      })
      program.save((err, savedProgram) => {
        episode = new Episode({
          name: "An episode to test topics",
          program: savedProgram.id,
          number: 1,
          created: Date.now(),
          modified: Date.now()
        })
        episode.save((err, savedEpisode) => {
          topic = new Topic({
            name: "A topic to test medias",
            episode: savedEpisode.id,
            position: 1,
            created: Date.now(),
            modified: Date.now()
          })
          topic.save((err, savedTopic) => {
            done()
          })
        })
      })
    })
  })

  /*
   * Get all Topic's Medias
   */
  describe('GET /api/programs/:programId/episodes/:episodeId/topics/:topicId/medias', () => {
    it('it should GET all the Topic\'s Medias', (done) => {
      chai.request(server)
        .get(`/api/programs/${program._id}/episodes/${episode._id}/topics/${topic._id}/medias`)
        .end((err, res) => {
          expect(err).to.not.be.ok
          res.should.have.status(200)
          res.body.should.be.a('array').be.empty
          done()
        })
    })
  })

  /*
   * Add a new Media to a Topic
   * using file upload and an url
   */
  describe('POST /api/programs/:programId/episodes/:episodeId/topics/:topicId/medias', () => {
    it('it should POST a new Media using file upload', (done) => {
      chai.request(server)
        .post(`/api/programs/${program._id}/episodes/${episode._id}/topics/${topic._id}/medias`)
        .attach("file", path.resolve('./test/assets/test.png'), "test.png")
        .field('label', 'A random label')
        .end((err, res) => {
          expect(err).to.not.be.ok
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id').not.be.empty
          res.body.should.have.property('label')
          res.body.should.have.property('uri')
          res.body.should.have.property('mimeType')
          res.body.should.have.property('created')
          res.body.should.have.property('modified').eql(res.body.created)
          res.body.should.have.property('topic').eql(topic._id.toString())
          media = res.body
          done()
        })
    })

    // it('it should POST a new Media using an url', (done) => {
    //   chai.request(server)
    //     .post(`/api/programs/${program._id}/episodes/${episode._id}/topics/${topic._id}/medias`)
    //     .send({ url: '' })
    //     .end((err, res) => {
    //       expect(err).to.not.be.ok
    //       res.should.have.status(200)
    //       res.body.should.be.a('object')
    //       res.body.should.have.property('_id').not.be.empty
    //       res.body.should.have.property('title')
    //       res.body.should.have.property('created')
    //       res.body.should.have.property('modified').eql(res.body.created)
    //       res.body.should.have.property('medias').be.a('array').be.empty
    //       res.body.should.have.property('episode').eql(episode._id.toString())
    //       res.body.medias.length.should.be.eql(0)
    //       topic = res.body
    //       done()
    //     })
    // })
  })

  /*
   * Get a single Media
   */
  describe('GET /api/programs/:programId/episodes/:episodeId/topics/:topicId/medias/:id', () => {
    it('it should GET a Media by the given id', (done) => {
      chai.request(server)
        .get(`/api/programs/${program._id}/episodes/${episode._id}/topics/${topic._id}/medias/${media._id}`)
        .end((err, res) => {
          expect(err).to.not.be.ok
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id').eql(media._id.toString())
          res.body.should.have.property('label').eql(media.label)
          res.body.should.have.property('uri')
          res.body.should.have.property('mimeType')
          res.body.should.have.property('created')
          res.body.should.have.property('modified').eql(res.body.created)
          res.body.should.have.property('topic').eql(topic._id.toString())
          done()
        })
    })
  })

  /*
   * Update a single Media
   */
  describe('PUT /api/programs/:programId/episodes/:episodeId/topics/:topicId/medias/:id', () => {
    it('it should UPDATE a Media given the id', (done) => {
      data = {
        label: "A new label to test"
      }
      chai.request(server)
        .put(`/api/programs/${program._id}/episodes/${episode._id}/topics/${topic._id}/medias/${media._id}`)
        .send(data)
        .end((err, res) => {
          expect(err).to.not.be.ok
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('_id').eql(media._id.toString())
          res.body.should.have.property('label').eql(data.label)
          res.body.should.have.property('uri')
          res.body.should.have.property('mimeType')
          res.body.should.have.property('created')
          res.body.should.have.property('modified').not.eql(res.body.created)
          res.body.should.have.property('topic').eql(topic._id.toString())
          done()
        })
    })
  })
 
  /*
   * Delete a single Topic
   */
  describe('DELETE /api/programs/:programId/episodes/:episodeId/topics/:topicId/medias/:id', () => {
    it('it should DELETE a Media given the id', (done) => {
      chai.request(server)
        .delete(`/api/programs/${program._id}/episodes/${episode._id}/topics/${topic._id}/medias/${media._id}`)
        .end((err, res) => {
          expect(err).to.not.be.ok
          res.should.have.status(204)
          res.body.should.be.empty
          done()
        })
    })
  })
})