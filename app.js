var express 			= require('express'),
	mongoose			= require('mongoose'),
	path				= require('path'),
	fs					= require('fs'),
  mm          = require('musicmetadata');

mongoose.connect('mongodb://localhost/files');
mongoose.connection.on('open', function() {
	//console.log("connected to database");
})

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          var parser = mm(fs.createReadStream(file), {duration: true});
          parser.on('metadata', function(res){
            var duration = ((res.duration/60).toFixed(2));
            console.log(duration)
            var seconds = duration.toString().split(".");
            minutes = seconds[0];
            seconds = Math.ceil(((seconds[1]/100)*60))
            console.log(seconds);
            duration = Number(minutes + "." + seconds)
            console.log(duration)
            var song = {
              artist: res.artist,
              title: res.title,
              duration: res.duration/60,
              genre: res.genre
            }
            console.log(song);
            console.log(results)
          })
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('C:/Users/Public/Music/Sample Music', function(err, results) {
  if (err) throw err;
  console.log(results);
  mongoose.connection.close()
});

