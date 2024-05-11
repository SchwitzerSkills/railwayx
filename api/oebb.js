const oebbClass = require("./oebb-oop.js");
const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/getTrainWays', (req, res) => {
  
    const fromLocation = req.query.fromLocation;
    const toLocation = req.query.toLocation;
    let date = req.query.date;
    let time = req.query.time;

    if(date == null){
        date = new Date().toLocaleDateString();
    }
    if(time == null){
        time = new Date(new Date().setHours(new Date().getHours() + 2)).toLocaleTimeString();
    }

    const oebb = new oebbClass(fromLocation, toLocation);

    if(fromLocation && toLocation){
        oebb.getTrainWay(date, time).then(results => {
            res.json(results[0]);
        })
    }
});


const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/oebb.phillips-network.work/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/oebb.phillips-network.work/fullchain.pem')
};

console.log("Private Key:", httpsOptions.key);
console.log("Certificate:", httpsOptions.cert);

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});