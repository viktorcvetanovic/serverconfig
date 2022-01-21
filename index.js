const {exec} = require('child_process');
var fs = require('fs');
const http = require('http');


const hostname = '0.0.0.0';

const port = 3333;


const server = http.createServer(function (req, res) {

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.setHeader("access-control-allow-origin", "*");
    console.log(req.url)
    if (req.url === "/music") {
        fs.readFile("index.html", function (error, file) {
            res.write(file, "binary");
            res.end();
        });
    } else if (req.url === "/playMusic") {
        var jsonString = '';
        req.on('data', function (data) {
            jsonString += data;
        });
        req.on('end', function () {
            var data = JSON.parse(jsonString);
            startMusic(data.url);
        });
        res.end();
    } else if (req.url === "/stopMusic") {
        console.log("eee")
        stopMusic();
        res.end();
    } else if (req.url === "/volume") {
        var jsonString = '';

        req.on('data', function (data) {
            jsonString += data;
        });

        req.on('end', function () {
            var data = JSON.parse(jsonString);
            console.log(data);
            volumeUp(data.volume);
        });
        res.end();
    } else {
        res.end();
    }


});

server.listen(port, hostname, function () {
    console.log('Server running at http://' + hostname + ':' + port + '/');

});


function startMusic(str) {
    const command = "export DISPLAY=:0 && firefox " + str;
    exec(command, (err, stdout, stderr) => {
        console.log(command);
        if (err) {
            return;
        }
    });
}

function stopMusic() {
    const command = "pkill -f firefox";
    exec(command, (err, stdout, stderr) => {
        console.log(command);
        if (err) {
            return;
        }
    });
}

function volumeUp(volume) {
    const command = "amixer set Master " + volume + "%";
    exec(command, (err, stdout, stderr) => {
        console.log(command);
        if (err) {
            return;
        }
    });
}

