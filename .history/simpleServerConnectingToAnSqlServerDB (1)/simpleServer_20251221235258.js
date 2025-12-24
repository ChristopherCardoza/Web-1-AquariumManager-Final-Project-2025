

var dboperations = require('./dboperations')
var express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');

// creates the Express server.
var expressWebServer = express();
let router = express.Router();

expressWebServer.use(bodyParser.urlencoded({extended:true}))


expressWebServer.use(bodyParser.json());
expressWebServer.use(cors());
expressWebServer.use('/', router);
router.use( (request, response,next) => {
  console.log('middleware');
  next();
});


// sends a silly test html page on a request to the root
router.route('/').get((request, response) =>{
 
    response.send("<html><h1>aaa</h1></html>");
 
})

//sends back an file
router.route('/success-endpoint').get((request, response) =>{
 
  response.sendFile("pathToMyFile");

})

// on an HTTP request to the stations endpoint, send back the json response
// from the getStations db operation
router.route('/stations').get((request, response) =>{
  dboperations.getStations().then(result=>
    response.json(result[0])
  )
})


// HTTPRequest to an endpoint with parameters. The parameters are then 
// used in the db operation by passing them to the getPath method
router.route('/path/:start/:end').get((request, response) =>{
  dboperations.getPath(request.params.start, request.params.end).then(result=>{
    console.log(result)
    response.json(result[0])})
 } )


 router.route('/distance/:start/:end').get((request, response) =>{
  // you can cosnole.log things for debugging purposes
  // console.log(request.params.end);
   dboperations.getDistance(request.params.start, request.params.end).then(result=>
   //  console.log(result)
     response.json(result))
  } )



router.route('/stations/:id').get((request, response) =>{
  dboperations.getStation(request.params.id).then(result=>
    response.json(result[0])
  )
})

//end point with an input parameter. FOr a server running 
// on the loda machine accessing http://localhost:8080/schedule/McGill
// will hit this endpoint handler and attempt to run the dboperations
// getSchedule funstion with McGill.
router.route('/schedule/:stationName').get((request, response) =>{
  console.log('running the getSchedule dboperation')
  dboperations.getSchedule(request.params.stationName).then(result=>
    response.json(result[0])
  )
})


router.route('/averageTrainSpeed').get((request, response) =>{
  dboperations.getTrainSpeed().then(result=>
    response.json(result[0])
  )
})


// starts up the server at port 8080
var server = expressWebServer.listen(8080, function () {
    console.log('Server is running..');
});

