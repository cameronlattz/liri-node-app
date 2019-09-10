require("dotenv").config();
const keys = require("./keys.js");
const [,,command,...args] = process.argv;
const value = args.join(" ");

const liri = (function(command, value) {
    const _output = function(message) {
        console.log(message);
    }
    
    const _concert = function(value) {
        _output("concert " + value);
    }
    
    const _spotify = function(value) {
        _output("spotify " + value);
        const Spotify = require("node-spotify-api");
        var spotify = new Spotify(keys.spotify);
    }
    
    const _movie = function(value) {
        _output("movie " + value);
    }
    
    const _random = function() {
        _output("random");
        _commandSwitch("concert-this", "I Want it That Way");
    }
    
    
    const _commandSwitch = function(command, value) {
        switch (command) {
            case "concert-this":
                _concert(value);
                break;
            case "spotify-this-song":
                _spotify(value);
                break;
            case "movie-this":
                _movie(value);
                break;
            case "do-what-it-says":
                _random();
                break;
            default:
                _output("Please input a valid command.");
                break;
        }
    }
    _commandSwitch(command, value);
})(command, value);