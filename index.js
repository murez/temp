var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var danmucolors = [{'color':'red','name':'红','default':true},{'color':'orange','name':'橙'},{'color':'blue','name':'蓝'},{'color':'grey','name':'灰'},{'color':'white','name':'白'},{'color':'black','name':'黑'},{'color':'yellow','name':'黄'}]
var danmusizes = [{'num':0,'name':'小字'},{'num':1,'name':'大字','default':true}]
var danmuposition = [{'num':0,'name':'飞行','default':true},{'num':1,'name':'顶部'},{'num':2,'name':'底部'}]
app.locals.title = 'Danmu Slide Show';
app.locals.email = 'Ott0';
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.get('/', function(req, res){
  res.render('slidelist',{slides:[{'tplfile':'2015-07-16-example','date':'2015-07-16','slidename':'示例'}]});
});
app.get('/danmu/:id', function (req, res, next) {
  console.log('Request page [danmu] :', req.params.id);
  res.render('layouts/danmu', { slidefilename: req.params.id});
});
app.get('/slide/:id', function (req, res, next) {
  console.log('Request page [slide] :', req.params.id);
  res.render('pages/'+req.params.id);
});
app.get('/danmuup',function (req, res, next) {
	console.log('A Updanmu client page requested.');
	res.render('layouts/danmuup',{ colors :danmucolors, sizes :danmusizes, positions :danmuposition})
})
var status = {'onlinenum':0,'danmunum':0}

io.on('connection', function(socket){
  console.log('A user connected: usernum('+(++status['onlinenum'])+') ');
  socket.on('disconnect', function(){
    console.log('A user disconnected: usernum('+(--status['onlinenum'])+') ');
  });
  socket.on('updanmu',function(msg) {
  	console.log('A danmu received('+(++status['danmunum'])+'):'+msg);
  	io.sockets.emit('broadcastdanmu',msg);

  })
});

var server = http.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})