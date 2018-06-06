require('./api/data/dbconnection.js').open();
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express();


const routes = require('./api/routes')

app.set('port', 3000)

app.use(function (req, res, next) {
  console.log(req.method, req.url, req.protocol);
  next()
})


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}))

// Routes 
app.use('/api', routes);
app.get('/', (req, res) => {
  res.render('index.html')
})
app.get('/file', (req, res) => {
  res.sendFile(path.join(__dirname, 'app.js'))
})

const server = app.listen(app.get('port'), function () {
  const port = server.address().port;
  console.log('Magic happens on port ' + port)
});