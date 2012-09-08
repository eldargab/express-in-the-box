var express = require('express')
var methods = require('methods')
var qs = require('qs')
var parse = require('url').parse
var App = require('the-box')
var handleError = express.errorHandler()
var Request = express.request
var Response = express.response

var proto = new App

methods.forEach(function (meth) {
  proto[meth] = function (path, handler) {
    if (meth == 'get' && arguments.length == 1) {
      return App.prototype.get.call(this, path)
    }
    this.router.route(meth, path, function onroute (req, res) {
      try {
        req.app.eval(handler)
      } catch (e) {
        req.app.raise(handler, new Error('Not found'))
      }
    })
    return this
  }
})

proto.all = function () {
  var args = arguments
  methods.forEach(function (meth) {
    this[meth].apply(this, args)
  }, this)
  return this
}

proto.enable = function (setting) {
  return this.set(setting, true)
}

proto.disable = function (setting) {
  return this.set(setting, false)
}

proto.enabled = function (setting) {
  return !!this.get(setting)
}

proto.disabled = function (setting) {
  return !this.enabled(setting)
}

proto.listen = function () {
  var server = require('http').createServer(this)
  return server.listen.apply(server, arguments)
}

proto
  .set('env', process.env.NODE_ENV || 'development')
  .disable('trust proxy')
  .enable('jsonp callback')
  .set('jsonp callback name', 'callback')
  .set('json replacer', null)
  .set('json spaces', 2)

proto.onerror(function (err) {
  if (this.isReady('response')) {
    ~err.message.toLowerCase().indexOf('not found') // actually not a bad idea
      ? this.get('response').send(404)
      : handleError(err, this.get('request'), this.get('response'))
  } else {
    throw err
  }
})

proto.def('init', function(){})


module.exports = function Server () {
  function server (req, res) {
    req.__proto__ = Request
    res.__proto__ = Response
    res.req = req
    req.res = res

    req.query = ~req.url.indexOf('?')
      ? qs.parse(parse(req.url).query)
      : {}

    server.eval('init', function () {
      server.run()
        .use(function () {
          req.app = this
        })
        .set('request', req)
        .set('response', res)
        .router.middleware(req, res, function () {
          req.app.raise(new Error('Not found'))
        })
    })
  }

  mix(server, proto)

  server.router = new express.Router

  return server
}

function mix (target, src) {
  for (var key in src) {
    target[key] = src[key]
  }
  return target
}