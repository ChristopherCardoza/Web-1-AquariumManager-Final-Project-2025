//  URL for the API server
const API_BASE_URL = "http://localhost:8080/api";

// Cache object to store fetched fish data
const fishCache = {
  allFish: null, // Cache for all fish
  fishById: {}, // Cache for individual fish by ID
  searchResults: {}, // Cache for search results (keyed by search query)
};

/**
 * Fetch all fish from the server
 * Uses cache to avoid repeated API calls
 * @returns {Promise<Array>} Promise that resolves to array of fish objects
 */
function getAllFish() {
  return new Promise(function (resolve, reject) {
    // Check cache first
    if (fishCache.allFish !== null) {
      console.log("Returning cached all fish data");
      resolve(fishCache.allFish);
      return;
    }

    // Fetch from API
    fetch(`${API_BASE_URL}/fish`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Store in cache
        fishCache.allFish = data;
        console.log("Fetched and cached all fish data:", data.length, "fish");
        resolve(data);
      })
      .catch((error) => {
        console.error("Error fetching all fish:", error);
        reject(error);
      });
  });
}

/**
 * Get a specific fish by ID
 * Uses cache to avoid repeated API calls
 * @param {number|string} id - The FishID
 * @returns {Promise<Object>} Promise that resolves to fish object
 */
function getFishById(id) {
  return new Promise(function (resolve, reject) {
    // Convert to number for consistency
    const fishId = parseInt(id);

    // Check cache first
    if (fishCache.fishById[fishId]) {
      console.log("Returning cached fish data for ID:", fishId);
      resolve(fishCache.fishById[fishId]);
      return;
    }

    // Fetch from API
    fetch(`${API_BASE_URL}/fish/${fishId}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Fish not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Store in cache
        fishCache.fishById[fishId] = data;
        console.log("Fetched and cached fish data for ID:", fishId);
        resolve(data);
      })
      .catch((error) => {
        console.error("Error fetching fish by ID:", error);
        reject(error);
      });
  });
}

/**
 * Search fish by name (common name or scientific name)
 * Uses cache to avoid repeated API calls for the same query
 * @param {string} query - The search term
 * @returns {Promise<Array>} Promise that resolves to array of matching fish
 */
function searchFish(query) {
  return new Promise(function (resolve, reject) {
    // Normalize query (trim and lowercase for cache key)
    const normalizedQuery = query.trim().toLowerCase();

    // Check cache first
    if (fishCache.searchResults[normalizedQuery]) {
      console.log("Returning cached search results for query:", query);
      resolve(fishCache.searchResults[normalizedQuery]);
      return;
    }

    // Encode query for URL
    const encodedQuery = encodeURIComponent(query);

    // Fetch from API
    fetch(`${API_BASE_URL}/fish/search/${encodedQuery}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Store in cache
        fishCache.searchResults[normalizedQuery] = data;
        console.log(
          "Fetched and cached search results for query:",
          query,
          "- Found",
          data.length,
          "fish"
        );
        resolve(data);
      })
      .catch((error) => {
        console.error("Error searching fish:", error);
        reject(error);
      });
  });
}

/**
 * Clear the fish cache
 * Useful for a fresh fetch
 */
function clearCache() {
  fishCache.allFish = null;
  fishCache.fishById = {};
  fishCache.searchResults = {};
  console.log("Fish cache cleared");
}

// Export functions
export { getAllFish, getFishById, searchFish, clearCache };
