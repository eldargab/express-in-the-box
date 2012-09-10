# express-in-the-box

This project integrates [express](http://expressjs.com/) [Request](http://expres
sjs.com/api.html#req.params)-[Response](http://expressjs.com/api.html#res.status
) prototypes and [Router](http://expressjs.com/api.html#app.VERB) with [the-
box](https://github.com/eldargab/the-box) container.

## Usage

``` javascript
// Example: Hello world
var App = require('express-in-the-box')
var app = App()

app.get('/', 'send-hello')

app.def('send-hello', function (get) {
  get('response').send('Hello world!')
})

app.listen(3000)
console.log('Hello world server listening...')
```

As you can see it has express look and feel except that you should pass box
names as route handlers instead of functions. The app instance is `the-box`
container extended with express specific methods and settings like `.enable()`,
`.disable()`, etc. There is no concept of middleware. You can use hooks instead.

``` javascript
// Example: automatically parse request body
var bodyParser = express.bodyParser()

app.after('request', function (get, req, done) {
  bodyParser(req, req.res, done)
})
```

For further details see [the-box documentation](https://github.com/eldargab/the-
box#readme).

## Installation

Via npm

```
npm install express-in-the-box
```

## License

(The MIT License)

Copyright (c) 2012 Eldar Gabdullin eldargab@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
