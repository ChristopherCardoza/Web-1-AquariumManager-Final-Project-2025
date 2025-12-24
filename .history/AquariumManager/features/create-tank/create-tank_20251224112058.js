import { searchFish, getAllFish } from "../../services/fish-api.js";

$(document).ready(function () {
  initializePage();
  setupEventHandlers();
  window.searchDebounceTimer = null;
});

function initializePage() {
  const profile = getSelectedProfile();
  if (!profile) {
    // if there was no profile somehow
    window.location.href = "../profile-selection/profile-selection.html";
    return;
  }
  // Initializing the selected fish array
  if (!window.selectedFish) {
    window.selectedFish = [];
  }

  // Preloads the fish so its faster
  preloadAllFish();
}

function getSelectedProfile() {
  try {
    const profileJson = localStorage.getItem("selectedProfile");
    return profileJson ? JSON.parse(profileJson) : null;
  } catch (error) {
    console.error("Error loading profile:", error);
    return null;
  }
}

function preloadAllFish() {
  getAllFish()
    .then((fish) => {
      window.allFishCache = fish;
      console.log("Preloaded", fish.length, "fish for fast search");
    })
    .catch((error) => {
      console.error("Error preloading fish:", error);
      // Continues without cache meaning it will use API search
    });
}

function setupEventHandlers() {
  // Tank image upload
  $("#tank-image-upload").on("change", function (e) {
    handleTankImageUpload(e.target.files[0]);
  });

  // fish search with debounce timer to limit the input event
  $("#fish-search").on("input", function () {
    const query = $(this).val().trim();

    // Clear previous timer
    if (window.searchDebounceTimer) {
      clearTimeout(window.searchDebounceTimer);
    }

    // Hide suggestions if query is empty
    if (query.length === 0) {
      hideSuggestions();
      return;
    }

    // Debounce search - wait 300ms after user stops typing
    window.searchDebounceTimer = setTimeout(function () {
      performFishSearch(query);
    }, 300);
  });

  // Hide suggestions when clicking outside
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".search-container").length) {
      hideSuggestions();
    }
  });

  $(document).on("click", ".suggestion-item", function () {
    const fishData = $(this).data("fish-data");
    addFishToTank(fishData);
    $("#fish-search").val("");
    hideSuggestions();
  });

  $(document).on("click", ".remove-fish-btn", function () {
    const fishId = $(this).closest(".selected-fish-item").data("fish-id");
    removeFish(fishId);
  });

  
}

function handleTankImageUpload(file) {
  if (!file) {
    return;
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("Image size must be less than 5MB.");
    return;
  }

  // Create preview using FileReader
  const reader = new FileReader();

  reader.onload = function (e) {
    const imageUrl = e.target.result;
    $("#tank-image-preview").attr("src", imageUrl).show();
    $(".tank-image-placeholder").hide();
  };

  reader.onerror = function () {
    alert("Error reading image file.");
  };

  reader.readAsDataURL(file);
}

function hideSuggestions() {
  $("#fish-search-suggestions").hide();
}

function showSuggestionsLoading() {
  const $suggestionsList = $("#suggestions-list");
  $suggestionsList.html(
    '<div class="suggestion-item loading">Searching...</div>'
  );
  $("#fish-search-suggestions").show();
}

function performFishSearch(query) {
  if (query.length < 1) {
    hideSuggestions();
    return;
  }

  // Show loading state
  showSuggestionsLoading();

  if (window.allFishCache && window.allFishCache.length > 0) {
    const results = filterFishClientSide(query, window.allFishCache);
    displaySuggestions(results);
    return;
  }

  // if no cache it will use API search
  searchFish(query)
    .then((results) => {
      displaySuggestions(results);
    })
    .catch((error) => {
      console.error("Error searching fish:", error);
      showSuggestionsError();
    });
}

function filterFishClientSide(query, fishArray) {
  const lowerQuery = query.toLowerCase();
  return fishArray.filter((fish) => {
    const commonName = (fish.CommonName || "").toLowerCase();
    const scientificName = (fish.ScientificName || "").toLowerCase();
    return (
      commonName.includes(lowerQuery) || scientificName.includes(lowerQuery)
    );
  });
}

function displaySuggestions(results) {
  const $suggestionsList = $("#suggestions-list");
  $suggestionsList.empty();

  if (!results || results.length === 0) {
    $suggestionsList.html(
      '<div class="suggestion-item no-results">No fish found</div>'
    );
    $("#fish-search-suggestions").show();
    return;
  }

  // Show at least 3 results, or all if less than 3
  const maxResults = Math.max(3, results.length);
  const displayResults = results.slice(0, maxResults);

  displayResults.forEach(function (fish) {
    const $suggestionItem = createSuggestionItem(fish);
    $suggestionsList.append($suggestionItem);
  });

  $("#fish-search-suggestions").show();
}

function showSuggestionsError() {
  const $suggestionsList = $("#suggestions-list");
  $suggestionsList.html(
    '<div class="suggestion-item error">Error loading fish. Please try again.</div>'
  );
  $("#fish-search-suggestions").show();
}

function createSuggestionItem(fish) {
  const $item = $("<div>").addClass("suggestion-item").data("fish-data", fish);

  // priority order
  const commonName = fish.CommonName || fish.name || "Unknown Fish";
  const scientificName = fish.ScientificName || fish.species || "";
  const careLevel = fish.CareLevel || fish.careLevel || "";
  const minTankSize = fish.MinTankSizeGal || fish.minTankSize || "";

  $item.html(`
        <div class="suggestion-content">
            <div class="suggestion-name">${commonName}</div>
            <div class="suggestion-details">
                ${
                  scientificName
                    ? `<span class="scientific-name">${scientificName}</span>`
                    : ""
                }
                ${
                  careLevel
                    ? `<span class="care-level">${careLevel}</span>`
                    : ""
                }
                ${
                  minTankSize
                    ? `<span class="tank-size">Min: ${minTankSize} gal</span>`
                    : ""
                }
            </div>
        </div>
        <div class="suggestion-add-icon">+</div>
    `);

  return $item;
}

function displaySelectedFish() {
  const $container = $("#selected-fish-container");
  $container.empty();

  if (!window.selectedFish || window.selectedFish.length === 0) {
    $container.html('<p class="empty-message">No fish added yet</p>');
    return;
  }

  window.selectedFish.forEach(function (fish) {
    const $fishItem = createFishListItem(fish);
    $container.append($fishItem);
  });
}

function addFishToTank(fish) {
  if (!window.selectedFish) {
    window.selectedFish = [];
  }

  // Check if fish is already added
  const fishId = fish.FishID || fish.id;
  const existingIndex = window.selectedFish.findIndex(
    (f) => (f.fishId || f.id) == fishId
  );

  if (existingIndex >= 0) {
    // if fish already exists, it increments quantity
    window.selectedFish[existingIndex].quantity =
      (window.selectedFish[existingIndex].quantity || 1) + 1;
  } else {
    // Add new fish with quantity 1
    window.selectedFish.push({
      fishId: fishId,
      id: fishId,
      name: fish.CommonName || fish.name,
      quantity: 1,
      ...fish,
    });
  }

  displaySelectedFish();
}

function createFishListItem(fish) {
  const $item = $("<div>")
    .addClass("selected-fish-item")
    .attr("data-fish-id", fish.fishId || fish.id);

  const fishName = fish.name || fish.CommonName || "Unknown Fish";
  const quantity = fish.quantity || 1;

  $item.html(`
        <div class="fish-item-info">
            <span class="fish-name">${fishName}</span>
            <span class="fish-quantity">Qty: ${quantity}</span>
        </div>
        <button class="remove-fish-btn btn-danger" aria-label="Remove fish">
            <span class="trash-icon">🗑️</span>
        </button>
    `);

  return $item;
}

function removeFish(fishId) {
  if (!window.selectedFish) {
    return;
  }

  window.selectedFish = window.selectedFish.filter(function (fish) {
    return (fish.fishId || fish.id) != fishId;
  });

  displaySelectedFish();
}
