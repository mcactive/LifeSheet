"use strict";

exports.__esModule = true;

const moment = require("moment");
const postgres = require("./classes/postgres.js");
const apidata = require("./classes/apiData.js");
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});


app.get('/api', async (req, res) => {
	
	try {
		
		var data = await apidata.get();
	
		res.writeHead(200, {
		    "Content-Type": "application/json",
		    "Access-Control-Allow-Origin": "*",
		    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
		});
		
		res.write(JSON.stringify(data));
		res.end();
	} catch (error) {
	    res.status(500);
	    res.send('500: Internal server error');
	}

});

app.use(function(req, res, next) {
    res.status(404);
    res.send('404: File Not Found');
});

app.listen(process.env.PORT);

//# sourceMappingURL=web.js.map