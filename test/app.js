var request = require('supertest')
var App = require('..')


describe('App', function () {
  var app

  beforeEach(function () {
    app = App()
  })

  it('Should dispatch routes to boxes', function (done) {
    app
      .get('/', 'hello')
      .def('hello', function (get) {
        get('response').send('hello')
      })
    request(app).get('/')
      .expect(200)
      .expect(/hello/, done)
  })

  it('Should respond with error on exception', function (done) {
    app
      .get('/error', 'error')
      .def('error', function () {
        throw new Error('my runtime error')
      })
    request(app).get('/error')
      .expect(500)
      .expect(/my runtime error/, done)
  })

  it('Should respond with 404 on undefined box', function (done) {
    app.get('/', 'undefined')
    request(app).get('/')
      .expect(404, done)
  })

  it('Should respond with 404 if there is no matched route', function (done) {
    request(app).get('/').expect(404, done)
  })

  describe('Request', function () {
    it('Should have .query default to {}', function (done) {
      app.get('/', 'root').def('root', function (get) {
        get('request').should.have.property('query').eql({})
        get('response').end()
      })
      request(app).get('/').expect(200, done)
    })

    it('Should contain the parsed query string', function (done) {
      app.get('/', 'root').def('root', function (get) {
        get('request').should.have.property('query').eql({
          id: '1234'
        })
        get('response').end()
      })
      request(app).get('/?id=1234').expect(200, done)
    })
  })

  describe('Response', function () {
    describe('.redirect()', function () {
      it('relative to url', function (done) {
        app
          .get('/blog', 'blog')
          .def('blog', function (get) {
            get('response').redirect('./posts')
          })
        request(app)
          .get('/blog')
          .set('Host', 'example.com')
          .end(function (err, res) {
            res.headers.should.have.property('location', '//example.com/blog/./posts')
            done()
          })
      })

      it('relative to root', function (done) {
        app
          .get('/blog', 'blog')
          .def('blog', function (get) {
            get('response').redirect('posts')
          })
        request(app)
          .get('/blog')
          .set('Host', 'example.com')
          .end(function (err, res) {
            res.headers.should.have.property('location', '//example.com/posts')
            done()
          })
      })
    })
  })
})