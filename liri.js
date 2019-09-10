require("dotenv").config();
const keys = require("./keys.js");
const [,,command,...args] = process.argv;
const value = args.length > 0 ? args.join(" ") : void 0;

const liri = (function(command, value) {
    const _fs = require("fs");
    const Spotify = require("node-spotify-api");
    var _spotify = new Spotify(keys.spotify);
    const _axios = require("axios");

    const _output = function(message, showInTerminal=true) {
        if (showInTerminal) {
            console.log(message);
        }
        _fs.appendFile("log.txt", message + "\n", function(error) {
            if (error) return console.log(error);
        });
    }
    
    const _concert = function(value) {
        const queryUrl = "https://rest.bandsintown.com/artists/" + encodeURIComponent(value.trim()) 
            + "/events?app_id=codingbootcamp";
        _axios.get(queryUrl)
        .then(function(response) {
            response.data.forEach((concert) => {
                _output("===========================================================");
                _output("Venue name: " + concert.venue.name);
                _output("Location: " + concert.venue.city + ", " + concert.venue.country);
                const moment = require("moment");
                _output("Date: " + moment(concert.datetime).format("MMMM Do YYYY, h:mm:ssa"));
                _output("");
            });
        });
    }
    
    const _spotify_this = function(value="Ace of Base - The Sign") {
        _spotify.search({ type: "track", query: encodeURIComponent(value.trim())}, function(error, data) {
            if (error) {
                return _output("Error occurred: " + error);
            }
            const item = data.tracks.items[0];
            const artists = item.artists.map((artist) => artist.name).join(", ");
            _output("Name: " + item.name);
            _output("Artists: " + artists);
            _output("Album: " + item.album.name);
            _output("Spotify link: " + item.external_urls.spotify);
        });
    }
    
    const _movie = function(value="Mr. Nobody") {
        const queryUrl = "http://www.omdbapi.com/?t=" + encodeURIComponent(value.trim()) + "&apikey=trilogy";
        _axios.get(queryUrl)
            .then(function(response) {
                const movie = response.data;
                _output("Title: " + movie.Title);
                _output("Year: " + movie.Year);
                _output("IMDB rating: "+ movie.imdbRating);
                const rottenTomatoes = movie.Ratings.find((rating) => {
                    if (rating.Source === "Rotten Tomatoes") return rating;
                });
                _output("RottenTomatoes rating: " + rottenTomatoes.Value);
                _output("Country: " + movie.Country);
                _output("Language: " + movie.Language);
                _output("Plot: " + movie.Plot);
                _output("Actors: " + movie.Actors);
            });
    }
    
    const _random = function() {
        _output("random");
        _commandSwitch("concert-this", "I Want it That Way");
    }
    
    
    const _commandSwitch = function(command, value) {
        _output("***********************************************************");
        _output(command + " " + (value != void 0 ? value : ""));
        switch (command) {
            case "concert-this":
                _concert(value);
                break;
            case "spotify-this-song":
                _spotify_this(value);
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
        _output("***********************************************************");
        _output("");
    }
    _commandSwitch(command, value);
})(command, value);