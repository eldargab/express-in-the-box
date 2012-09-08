var App = require('express-in-the-box')
var app = App()

app.get('/', 'send-hello')

app.def('send-hello', function (get) {
  get('response').send('Hello world!')
})

app.listen(3000)
console.log('Hello world server listening...')