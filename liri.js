require("dotenv").config();
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);


console.log("test");