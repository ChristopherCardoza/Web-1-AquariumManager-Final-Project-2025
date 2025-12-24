//  URL for the API server
const API_BASE_URL = "http://localhost:8080/api";

// To use mock data (its set to true to test without the server)
const USE_MOCK_DATA = true; // I'll Change to false when database is working

// Mock fish data (matches my database's structure)
const MOCK_FISH_DATA = [
  {
    FishID: 1,
    CommonName: "betta",
    ScientificName: "betta splendens",
    MinTankSizeGal: 5,
    FishSize: 3.0,
    Category: "Gourami",
    Temperament: "Variable",
    Compatibility: "depends on personality",
    Schooling: false,
    CareLevel: "Beginner",
    CareDescription:
      "Very hardy fish that has simple needs like a heater and hiding spaces to feel safe.",
    MinPH: 6.5,
    MaxPH: 7.5,
    MinGH: 50,
    MaxGH: 100,
    MinTemperature: 75,
    MaxTemperature: 82,
    DietDescription: "Carnivore pellets",
    FeedingFrequency: "Twice daily",
    FeedingVolume: "Moderate",
  },
  {
    FishID: 2,
    CommonName: "guppy",
    ScientificName: "poecilia reticulata",
    MinTankSizeGal: 10,
    FishSize: 2.5,
    Category: "Livebearer",
    Temperament: "Peaceful",
    Compatibility: "Community safe",
    Schooling: false,
    CareLevel: "Beginner",
    CareDescription:
      "Extremely hardy and easy to care for. Great for beginners. They breed easily.",
    MinPH: 6.8,
    MaxPH: 7.8,
    MinGH: 100,
    MaxGH: 200,
    MinTemperature: 72,
    MaxTemperature: 82,
    DietDescription: "Omnivore flakes",
    FeedingFrequency: "Once daily",
    FeedingVolume: "Small pinch",
  },
  {
    FishID: 3,
    CommonName: "neon tetra",
    ScientificName: "paracheirodon innesi",
    MinTankSizeGal: 10,
    FishSize: 1.5,
    Category: "Tetra",
    Temperament: "Peaceful",
    Compatibility: "Community safe",
    Schooling: true,
    CareLevel: "Beginner",
    CareDescription:
      "Peaceful schooling fish. Keep in groups of 6 or more. Sensitive to water quality.",
    MinPH: 6.0,
    MaxPH: 7.0,
    MinGH: 25,
    MaxGH: 150,
    MinTemperature: 70,
    MaxTemperature: 81,
    DietDescription: "Omnivore flakes",
    FeedingFrequency: "Once daily",
    FeedingVolume: "Small pinch",
  },
  {
    FishID: 4,
    CommonName: "molly",
    ScientificName: "poecilia sphenops",
    MinTankSizeGal: 20,
    FishSize: 3.5,
    Category: "Livebearer",
    Temperament: "Peaceful",
    Compatibility: "Community safe",
    Schooling: false,
    CareLevel: "Intermediate",
    CareDescription:
      "Active fish that prefer slightly brackish water. Need good filtration.",
    MinPH: 7.0,
    MaxPH: 8.5,
    MinGH: 150,
    MaxGH: 300,
    MinTemperature: 72,
    MaxTemperature: 82,
    DietDescription: "Omnivore flakes",
    FeedingFrequency: "Twice daily",
    FeedingVolume: "Moderate",
  },
  {
    FishID: 5,
    CommonName: "angelfish",
    ScientificName: "pterophyllum scalare",
    MinTankSizeGal: 30,
    FishSize: 6.0,
    Category: "Cichlid",
    Temperament: "Semi-Aggressive",
    Compatibility: "Caution",
    Schooling: false,
    CareLevel: "Intermediate",
    CareDescription:
      "Beautiful cichlid that needs vertical space. Can be territorial during breeding.",
    MinPH: 6.5,
    MaxPH: 7.5,
    MinGH: 50,
    MaxGH: 150,
    MinTemperature: 75,
    MaxTemperature: 82,
    DietDescription: "Carnivore pellets",
    FeedingFrequency: "Twice daily",
    FeedingVolume: "Moderate",
  },
  {
    FishID: 6,
    CommonName: "cardinal tetra",
    ScientificName: "paracheirodon axelrodi",
    MinTankSizeGal: 15,
    FishSize: 2.0,
    Category: "Tetra",
    Temperament: "Peaceful",
    Compatibility: "Community safe",
    Schooling: true,
    CareLevel: "Intermediate",
    CareDescription:
      "Similar to neon tetra but more colorful. Requires stable water conditions.",
    MinPH: 5.5,
    MaxPH: 7.0,
    MinGH: 2,
    MaxGH: 8,
    MinTemperature: 73,
    MaxTemperature: 81,
    DietDescription: "Omnivore flakes",
    FeedingFrequency: "Once daily",
    FeedingVolume: "Small pinch",
  },
  {
    FishID: 7,
    CommonName: "zebra danio",
    ScientificName: "danio rerio",
    MinTankSizeGal: 10,
    FishSize: 2.0,
    Category: "Danio",
    Temperament: "Peaceful",
    Compatibility: "Community safe",
    Schooling: true,
    CareLevel: "Beginner",
    CareDescription:
      "Very active and hardy. Great for beginners. Keep in groups.",
    MinPH: 6.0,
    MaxPH: 7.5,
    MinGH: 4,
    MaxGH: 10,
    MinTemperature: 64,
    MaxTemperature: 75,
    DietDescription: "Omnivore flakes",
    FeedingFrequency: "Once daily",
    FeedingVolume: "Small pinch",
  },
  {
    FishID: 8,
    CommonName: "corydoras catfish",
    ScientificName: "corydoras aeneus",
    MinTankSizeGal: 20,
    FishSize: 2.5,
    Category: "Catfish",
    Temperament: "Peaceful",
    Compatibility: "Community safe",
    Schooling: true,
    CareLevel: "Beginner",
    CareDescription: "Peaceful bottom dweller. Keep in groups of 3 or more.",
    MinPH: 6.0,
    MaxPH: 7.5,
    MinGH: 4,
    MaxGH: 10,
    MinTemperature: 72,
    MaxTemperature: 79,
    DietDescription: "Algae wafers",
    FeedingFrequency: "Once daily",
    FeedingVolume: "1 wafer",
  },
];

// Cache object to store fetched fish data
const fishCache = {
  allFish: null, // Cache for all fish
  fishById: {}, // Cache for individual fish by ID
  searchResults: {}, // Cache for search results (keyed by search query)
};

/**
 * Get mock fish data (for testing)
 * @returns {Array} Array of mock fish
 */
function getMockFish() {
  return MOCK_FISH_DATA.map((fish) => ({ ...fish })); // Return copy to avoid mutation
}

/**
 * Search mock fish by query
 * @param {string} query - Search query
 * @returns {Array} Filtered fish array
 */
function searchMockFish(query) {
  const lowerQuery = query.toLowerCase();
  return MOCK_FISH_DATA.filter((fish) => {
    const commonName = (fish.CommonName || "").toLowerCase();
    const scientificName = (fish.ScientificName || "").toLowerCase();
    return (
      commonName.includes(lowerQuery) || scientificName.includes(lowerQuery)
    );
  });
}

/**
 * Get mock fish by ID
 * @param {number} id - Fish ID
 * @returns {Object|null} Fish object or null
 */
function getMockFishById(id) {
  const fish = MOCK_FISH_DATA.find((f) => f.FishID === parseInt(id));
  return fish ? { ...fish } : null; // Return copy
}

/**
 * Fetch all fish from the server
 * Uses cache to avoid repeated API calls
 * Falls back to mock data if USE_MOCK_DATA is true or API fails
 * @returns {Promise<Array>} Promise that resolves to array of fish objects
 */
function getAllFish() {
  return new Promise(function (resolve, reject) {
    // Use mock data if flag is set
    if (USE_MOCK_DATA) {
      console.log("Using mock fish data");
      const mockData = getMockFish();
      fishCache.allFish = mockData;
      resolve(mockData);
      return;
    }

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
        console.error("Error fetching all fish, using mock data:", error);
        // Fallback to mock data
        const mockData = getMockFish();
        fishCache.allFish = mockData;
        resolve(mockData);
      });
  });
}

/**
 * Get a specific fish by ID
 * Uses cache to avoid repeated API calls
 * Falls back to mock data if USE_MOCK_DATA is true or API fails
 * @param {number|string} id - The FishID
 * @returns {Promise<Object>} Promise that resolves to fish object
 */
function getFishById(id) {
  return new Promise(function (resolve, reject) {
    // Convert to number for consistency
    const fishId = parseInt(id);

    // Use mock data if flag is set
    if (USE_MOCK_DATA) {
      console.log("Using mock fish data for ID:", fishId);
      const mockFish = getMockFishById(fishId);
      if (mockFish) {
        fishCache.fishById[fishId] = mockFish;
        resolve(mockFish);
      } else {
        reject(new Error("Fish not found"));
      }
      return;
    }

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
        console.error("Error fetching fish by ID, using mock data:", error);
        // Fallback to mock data
        const mockFish = getMockFishById(fishId);
        if (mockFish) {
          fishCache.fishById[fishId] = mockFish;
          resolve(mockFish);
        } else {
          reject(new Error("Fish not found"));
        }
      });
  });
}

/**
 * Search fish by name (common name or scientific name)
 * Uses cache to avoid repeated API calls for the same query
 * Falls back to mock data if USE_MOCK_DATA is true or API fails
 * @param {string} query - The search term
 * @returns {Promise<Array>} Promise that resolves to array of matching fish
 */
function searchFish(query) {
  return new Promise(function (resolve, reject) {
    // Normalize query (trim and lowercase for cache key)
    const normalizedQuery = query.trim().toLowerCase();

    // Use mock data if flag is set
    if (USE_MOCK_DATA) {
      console.log("Using mock fish data for search:", query);
      const mockResults = searchMockFish(query);
      fishCache.searchResults[normalizedQuery] = mockResults;
      resolve(mockResults);
      return;
    }

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
        console.error("Error searching fish, using mock data:", error);
        // Fallback to mock data
        const mockResults = searchMockFish(query);
        fishCache.searchResults[normalizedQuery] = mockResults;
        resolve(mockResults);
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
