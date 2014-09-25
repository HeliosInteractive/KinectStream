/**
 *
 * Configuration Setup
 */

// Configuration by NConf
var nconf = require('nconf');

// If Config file doesn't exists, create it and use the sample
var fs = require('fs.extra');
if(fs.existsSync('config.json')){

    // Load Config File
    nconf.file({ file: 'config.json' });
} else {

    // Load Example File
    nconf.file({ file: 'config-example.json' });

    // Create Local Config
    fs.copy("config-example.json", "config.json", function(err){
        if (err) {
            console.log('ERR! Could not create config.json file');
            throw err;
        } else {
            console.log(':: Created config.json file');
        }
    })
}
var config = nconf.get();

// Draw Banner
var colors = require('colors');
console.log("\n             ___  __  ___  __  ___  __   ___\n|__/ | |\\ | |__  /  `  |  /__`  |  |__) |__   /\\   |\\/|\n|  \\ | | \\| |___ \\__,  |  .__/  |  |  \\ |___ /~~\\  |  |\n".grey);

// Single Line Log Setup
var log = require('single-line-log').stdout;

// Socket Server setup
var websocket = require('ws');
var io = new websocket.Server({port: config.websocket.port});

io.broadcast = function (data) {
    var message = JSON.stringify(data);
    for (var i in this.clients) {
        this.clients[i].send(message);
    }
    if( config.websocket.debug ){
        log('::> Broadcasting ' + message + ' to ' + this.clients.length + ' websocket clients');
    }
};

// Express Server
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(__dirname + '/web'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/web/mobile.html');
});

var os = require("os");
server.listen(config.mobileInput.port, function () {
    require('dns').lookup(os.hostname(), function (err, add, fam) {
        var ipConnect = add + ':' + config.mobileInput.port;
        var localConnect = os.hostname() + ':' + config.mobileInput.port;
        console.log(":: Kinect Input Enabled".cyan);
    });
});

// Web Page Gyro to Socket
io.on('connection', function (socket) {

    console.log(':: Kinect Client Connected');

    socket.on('message', function (data) {

        var message = JSON.parse(data);

        if (message.type === 'face') {

            var data = message.data;
            io.broadcast(message);

        } else if(message.type === 'bodies'){

            var data = message.data;
            io.broadcast(message);
        //    log('::> Broadcasting ' + data.length + ' bodies');

        } else {

            console.log('Unknown message type', message);

        }
    });
    socket.on('close', function (data) {
        console.log(':: Kinect Client Disconnected');
    });
});