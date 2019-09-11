const [,,command,...args] = process.argv;
const value = args.length > 0 ? args.join(" ") : void 0;

(function(command, value) {
    require("dotenv").config();
    const keys = require("./keys.js");
    const _fs = require("fs");
    const _axios = require("axios");
    const Spotify = require("node-spotify-api");
    const _spotify = new Spotify(keys.spotify);
    const log = [];

    const _commandSwitch = function(command, value) {
        switch (command) {
            case "concert-this":
                if (value != void 0) {
                    _concert_this(value);
                } else {
                    _error("Please enter an artist name.");
                    _outputEnd();
                }
                break;
            case "do-what-it-says":
                _do_what_it_says();
                break;
            case "movie-this":
                _movie_this(value);
                break;
            case "spotify-this-song":
                _spotify_this_song(value);
                break;
            default:
                _error("Please input a valid command.");
                _outputEnd();
                break;
        }
    }
    
    const _concert_this = function(value) {
        const queryUrl = "https://rest.bandsintown.com/artists/" + encodeURIComponent(value.trim()) 
            + "/events?app_id=codingbootcamp";
        _axios.get(queryUrl)
        .then(function(response) {
            if (Array.isArray(response.data)) {
                response.data.forEach((concert) => {
                    _output("", "===========================================================");
                    _output("Venue name:", concert.venue.name);
                    _output("Location:", concert.venue.city + ", " + concert.venue.country);
                    const moment = require("moment");
                    _output("Date:", moment(concert.datetime).format("MMMM Do YYYY, h:mm:ssa"));
                    _output("", "");
                });
            } else {
                _output("", "Artist not found.");
            }
            _outputEnd();
        });
    }
    
    const _do_what_it_says = function() {
        _fs.readFile("random.txt", "utf8", function(error, input) {
            if (error) return console.log(error);
            const [command, value] = input.split(",");
            _commandSwitch(command, value);
        });
    }

    const _error = function(message) {
        console.log("\x1b[31m", "ERROR: " + message, "\x1b[0m");
        log.push("ERROR: " + message);
    }

    const _init = function(command, value) {
        _output("", "***********************************************************", false);
        _output("", (command != void 0 ? command : "No command specified.") + " " + (value != void 0 ? value : ""), false);
        _commandSwitch(command, value);
    }
    
    const _movie_this = function(value="Mr. Nobody") {
        const queryUrl = "http://www.omdbapi.com/?t=" + encodeURIComponent(value.trim()) + "&apikey=trilogy";
        _axios.get(queryUrl)
            .then(function(response) {
                const movie = response.data;
                if (movie.Title !== void 0) {
                    _output("Title:", movie.Title);
                    _output("Year:", movie.Year);
                    _output("IMDB rating:", movie.imdbRating);
                    const rottenTomatoes = movie.Ratings.find((rating) => {
                        if (rating.Source === "Rotten Tomatoes") return rating;
                    });
                    _output("RottenTomatoes rating:", rottenTomatoes.Value);
                    _output("Country:", movie.Country);
                    _output("Language:", movie.Language);
                    _output("Plot:", movie.Plot);
                    _output("Actors:", movie.Actors);
                } else {
                    _error("Movie not found.");
                }
                _outputEnd();
            });
    }

    const _output = function(title, message, showInTerminal=true) {
        if (showInTerminal) {
            if (title.length > 0) {
                console.log("\x1b[32m", title, "\x1b[36m", " " + message, "\x1b[0m");
            } else {
                console.log(message);
            }
        }
        log.push(message);
    }

    const _outputEnd = function() {
        _output("", "***********************************************************", false);
        _output("", "", false);
        _output("", "", false);
        const logString = log.join("\n");
        _fs.appendFile("log.txt", logString, function(error) {
            if (error) return console.log(error);
        });
    }
    
    const _spotify_this_song = function(value="Ace of Base - The Sign") {
        _spotify.search({ type: "track", query: value}, function(error, data) {
            if (error) return _output("Error occurred: " + error);
            const item = data.tracks.items[0];
            if (item !== void 0) {
                const artists = item.artists.map((artist) => artist.name).join(", ");
                _output("Name:", item.name);
                _output("Artists:", artists);
                _output("Album:", item.album.name);
                _output("Spotify link:", item.external_urls.spotify);
            } else {
                _error("Song not found.");
            }
            _outputEnd();
        });
    }

    _init(command, value);
})(command, value);