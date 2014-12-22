var Schema = require('mongoose').Schema;

exports.MusicFiles = new Schema ({
	name: String,
	artist: String,
	album: String,
	path: String
});