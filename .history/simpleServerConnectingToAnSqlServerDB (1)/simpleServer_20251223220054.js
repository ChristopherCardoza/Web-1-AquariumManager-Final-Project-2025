var dboperations = require("./dboperations");
var express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");

// creates the Express server.
var expressWebServer = express();
let router = express.Router();

expressWebServer.use(bodyParser.urlencoded({ extended: true }));
expressWebServer.use(bodyParser.json());
expressWebServer.use(cors());
expressWebServer.use("/", router);

router.use((request, response, next) => {
  console.log("middleware");
  next();
});

// Root endpoint - test page
router.route("/").get((request, response) => {
  response.send(
    "<html><h1>Aquarium Manager API</h1><p>Server is running!</p></html>"
  );
});

// Get all fish - returns JSON array of all fish with complete details
router.route("/api/fish").get((request, response) => {
  dboperations
    .getAllFish()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      console.error("Error in /api/fish:", error);
      response.status(500).json({ error: "Failed to retrieve fish data" });
    });
});

// Get a specific fish by ID
// Example: http://localhost:8080/api/fish/1
router.route("/api/fish/:id").get((request, response) => {
  const fishId = parseInt(request.params.id);
  dboperations
    .getFishById(fishId)
    .then((result) => {
      if (result && result.length > 0) {
        response.json(result[0]); // Return first result (should be only one)
      } else {
        response.status(404).json({ error: "Fish not found" });
      }
    })
    .catch((error) => {
      console.error("Error in /api/fish/:id:", error);
      response.status(500).json({ error: "Failed to retrieve fish data" });
    });
});

// Search fish by name (common name or scientific name)
// Example: http://localhost:8080/api/fish/search/betta
router.route("/api/fish/search/:query").get((request, response) => {
  const searchQuery = request.params.query;
  dboperations
    .searchFish(searchQuery)
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      console.error("Error in /api/fish/search/:query:", error);
      response.status(500).json({ error: "Failed to search fish" });
    });
});

// starts up the server at port 8080
var server = expressWebServer.listen(8080, function () {
  console.log("Server is running on port 8080..");
  console.log("API endpoints available:");
  console.log("  GET /api/fish - Get all fish");
  console.log("  GET /api/fish/:id - Get fish by ID");
  console.log("  GET /api/fish/search/:query - Search fish by name");
});
