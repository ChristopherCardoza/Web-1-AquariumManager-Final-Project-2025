let config = require('./dbconfig');
var sql = require("mssql");

async function getStations(){
    try{
        let pool = await sql.connect(config);
        let products= await pool.request().query("SELECT * FROM Station")
        return products.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

//does a query
async function getTrainSpeed(){
    try{
        let pool = await sql.connect(config);
        let products= await pool.request()
             .query("SELECT AverageSpeed FROM SystemProperties")
        return products.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

//does a query
async function getStation(id){
    try{
        let pool = await sql.connect(config);
        let products= await pool.request()
             .input( 'input_parameter', sql.Int, id)
             .query("SELECT * FROM Station WHERE StationId = @input_parameter");
             await getTimePromise(10);
        return products.recordsets;
    }
    catch(error){
        console.log(error);
    }
}
 

// example of executing a stored procedure with inputs and
// an output
async function getDistance(startStationName, endStationName){
    //EXEC GetDistance @startStation,@stationName , @dist=@totalDistance OUTPUT; --@stationName;
    try{
 
        let pool = await sql.connect(config);
        let products= await pool.request()
        .input( 'station1name', sql.VarChar(200), startStationName)
        .input( 'station2name', sql.VarChar(200), endStationName)
        .output( 'dist', sql.Int )
        .execute('GetDistance')
        //returns the output
        return products.output.dist;
    }
    catch(error){
        console.log(error);
    }       
}

// example of executing a stored procedure with an input
async function getSchedule(stationName){
    try{
        let pool = await sql.connect(config);
        let products= await pool.request()
        .input( 'stationName', sql.VarChar(200), stationName)
        .execute('GetSchedule')
        return products.recordsets;
    }
    catch(error){
        console.log(error);
    }       
}

module.exports = {
    getStations : getStations,
    getStation : getStation,
    getSchedule: getSchedule,
    getTrainSpeed: getTrainSpeed,
    getDistance : getDistance
}


