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
  console.log("Request received:", request.method, request.url);
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
  console.log("Getting all fish...");
  dboperations
    .getAllFish()
    .then((result) => {
      console.log("Success! Found", result.length, "fish");
      response.json(result);
    })
    .catch((error) => {
      console.error("ERROR in /api/fish:");
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Full error:", error);
      response.status(500).json({
        error: "Failed to retrieve fish data",
        details: error.message,
        code: error.code,
      });
    });
});

// Get a specific fish by ID
// Example: http://localhost:8080/api/fish/1
router.route("/api/fish/:id").get((request, response) => {
  const fishId = parseInt(request.params.id);
  console.log("Getting fish with ID:", fishId);
  dboperations
    .getFishById(fishId)
    .then((result) => {
      if (result && result.length > 0) {
        console.log("Success! Found fish:", result[0].CommonName);
        response.json(result[0]);
      } else {
        console.log("Fish not found with ID:", fishId);
        response.status(404).json({ error: "Fish not found" });
      }
    })
    .catch((error) => {
      console.error("ERROR in /api/fish/:id:");
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Full error:", error);
      response.status(500).json({
        error: "Failed to retrieve fish data",
        details: error.message,
        code: error.code,
      });
    });
});

// Search fish by name (common name or scientific name)
// Example: http://localhost:8080/api/fish/search/betta
router.route("/api/fish/search/:query").get((request, response) => {
  const searchQuery = decodeURIComponent(request.params.query);
  console.log("Searching for fish with query:", searchQuery);

  dboperations
    .searchFish(searchQuery)
    .then((result) => {
      console.log("Success! Found", result.length, "matching fish");
      response.json(result);
    })
    .catch((error) => {
      console.error("ERROR in /api/fish/search/:query:");
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Error number:", error.number);
      console.error("Full error:", error);
      response.status(500).json({
        error: "Failed to search fish",
        details: error.message,
        code: error.code,
        number: error.number,
      });
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
