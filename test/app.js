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
        .on('hello', function (get) {
            get('response').send('hello')
        })
        request(app).get('/')
            .expect(200)
            .expect(/hello/, done)
    })

    it('Should respond with error on exception', function (done) {
        app
        .get('/error', 'error')
        .on('error', function () {
            throw new Error('runtime error')
        })
        request(app).get('/error')
            .expect(500)
            .expect(/runtime error/, done)
    })

    it('Should respond with error on undefined box', function (done) {
        app.get('/', 'undefined')
        request(app).get('/')
            .expect(500)
            .expect(/box/, done)
    })

    it('Should respond with 404 if there is no matched route', function (done) {
        request(app).get('/').expect(404, done)
    })

    describe('Request', function () {
        it('Should have .query default to {}', function (done) {
            app.get('/', 'root').on('root', function (get) {
                get('request').should.have.property('query').eql({})
                get('response').end()
            })
            request(app).get('/').expect(200, done)
        })

        it('Should contain the parsed query string', function (done) {
            app.get('/', 'root').on('root', function (get) {
                get('request').should.have.property('query').eql({
                    id: '1234'
                })
                get('response').end()
            })
            request(app).get('/?id=1234').expect(200, done)
        })
    })
})