const NodeCache = require('node-cache');
const postgres = require("./postgres.js");
const cache = new NodeCache();
const moment = require("moment");

const get = async () => {

	var lastFetchedData = {};

	// Do something
	var keys = [
	    "mood",
	    "sleepDurationWithings",
	    "emailsInbox",
	    "weight",
	    "gym",
	    "macrosCarbs",
	    "macrosProtein",
	    "macrosFat",
	    "weeklyComputerTime",
	    "meditated"
	];

	
	for (const key of keys) {
		
		lastFetchedData[key] = await getDataForKey(key) 
		
	}

	return lastFetchedData

};

const getDataForKey = async (key) => {

	console.log("Refreshing latest " + key + " entry...");

    return await getData(key);
    
}

const getDataFromDb = async (key) => {
	
	// Query the database using the connection pool
	var dbQuery = 'SELECT * FROM raw_data WHERE key = $1 ORDER BY timestamp DESC LIMIT 1';
	
	console.log("Running query: " + dbQuery);
	  
    const result = await postgres.client.query(dbQuery, [key]);
    const data = result.rows[0];
    
    if (data != null) {
        return {
            time: moment(Number(data.timestamp)).format(),
            value: Number(data.value)
        };
    } else {
        return {
			time: null,
			value: null
        }
    }
    
};

// Define a function that retrieves data from the cache or the database
const getData = async (key, cacheTime = 600) => {
	
  // Check if the data is in the cache
  var data = cache.get(key);
  
  // console.log("Getting data from cache: "+key);
  
  if (data) {
    // Return the data from the cache
    return data;
  }

  // Data is not in the cache, retrieve it from the database
  data = await getDataFromDb(key);
  
  console.log("Got new data: ")
  console.log (data);

  // Store the data in the cache with an expiration of 10 minutes
  cache.set(key, data, cacheTime);

  // Return the data
  return data;
};


module.exports = {
  get,
};