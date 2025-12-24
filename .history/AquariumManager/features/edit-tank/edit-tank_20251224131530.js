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

  // Get tank ID from sessionStorage
  const tankId = sessionStorage.getItem("editingTankId");
  if (!tankId) {
    // No tank ID, redirect to tank manager
    alert("No tank selected for editing.");
    window.location.href = "../tank-manager/tank-manager.html";
    return;
  }

  // Load tank data
  loadTankData(profile, tankId);

  // Preload all fish for faster client-side filtering
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

function loadTankData(profile, tankId) {
  // Find the tank in profile's tanks array
  const tank = profile.tanks
    ? profile.tanks.find((t) => t.id === tankId)
    : null;

  if (!tank) {
    alert("Tank not found.");
    window.location.href = "../tank-manager/tank-manager.html";
    return;
  }

  // Store tank ID and profile for later use
  window.editingTankId = tankId;
  window.currentProfile = profile;

  // Populate form fields
  if (tank.name) $("#tank-name").val(tank.name);
  if (tank.size) $("#tank-size").val(tank.size);
  if (tank.temperature) $("#tank-temperature").val(tank.temperature);
  if (tank.ph !== undefined && tank.ph !== null) $("#tank-ph").val(tank.ph);
  if (tank.gh !== undefined && tank.gh !== null) $("#tank-gh").val(tank.gh);

  // Load tank image
  if (tank.image) {
    $("#tank-image-preview").attr("src", tank.image).show();
    $(".tank-image-placeholder").hide();
  }

  // Load fish
  window.selectedFish = tank.fish ? [...tank.fish] : [];
  displayCurrentFish();
}

function setupEventHandlers() {
  // Tank image upload
  $("#tank-image-upload").on("change", function (e) {
    handleTankImageUpload(e.target.files[0]);
  });

  // fish search with debounce timer to limit the input event
  $("#fish-search").on("input", function () {
    const query = $(this).val().trim();

    if (window.searchDebounceTimer) {
      clearTimeout(window.searchDebounceTimer);
    }

    if (query.length === 0) {
      hideSuggestions();
      return;
    }

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

  $(document).on("click", ".quantity-decrease", function () {
    const fishId = $(this).closest(".current-fish-item").data("fish-id");
    decreaseFishQuantity(fishId);
  });

  $(document).on("click", ".quantity-increase", function () {
    const fishId = $(this).closest(".current-fish-item").data("fish-id");
    increaseFishQuantity(fishId);
  });

  $(document).on("click", ".delete-fish-btn", function () {
    const fishId = $(this).closest(".current-fish-item").data("fish-id");
    removeFish(fishId);
  });

  $(document).on("click", "#save-btn", function () {
    saveTank();
  });

  $(document).on("click", "#exit-btn", function () {
    exitWithoutSaving();
  });
}

function handleTankImageUpload(file) {
  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image size must be less than 5MB.");
    return;
  }

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

  showSuggestionsLoading();

  if (window.allFishCache && window.allFishCache.length > 0) {
    const results = filterFishClientSide(query, window.allFishCache);
    displaySuggestions(results);
    return;
  }

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

function displayCurrentFish() {
  const $container = $("#current-fish-container");
  $container.empty();

  if (!window.selectedFish || window.selectedFish.length === 0) {
    $container.html('<p class="empty-message">No fish in tank</p>');
    return;
  }

  window.selectedFish.forEach(function (fish) {
    const $fishItem = createCurrentFishItem(fish);
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
    // Fish already exists, increment quantity
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

  displayCurrentFish();
}

function createCurrentFishItem(fish) {
  const $item = $("<div>")
    .addClass("current-fish-item")
    .attr("data-fish-id", fish.fishId || fish.id);

  const fishName = fish.name || fish.CommonName || "Unknown Fish";
  const quantity = fish.quantity || 1;

  $item.html(`
        <div class="fish-item-info">
            <span class="fish-name">${fishName}</span>
        </div>
        <div class="fish-quantity-controls">
            <button class="quantity-decrease btn" aria-label="Decrease quantity">-</button>
            <span class="quantity-display">${quantity}</span>
            <button class="quantity-increase btn" aria-label="Increase quantity">+</button>
        </div>
        <button class="delete-fish-btn btn-danger" aria-label="Delete fish">
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

  displayCurrentFish();
}

function validateTankForm() {
  const tankName = $("#tank-name").val().trim();
  const tankSize = $("#tank-size").val();

  if (!tankName || tankName.length === 0) {
    alert("Please enter a tank name.");
    return false;
  }

  if (!tankSize || parseFloat(tankSize) <= 0) {
    alert("Please enter a valid tank size.");
    return false;
  }

  return true;
}

function saveTank() {
  if (!validateTankForm()) {
    return;
  }

  try {
    const profile = getSelectedProfile();
    if (!profile) {
      alert("No profile selected. Redirecting to profile selection.");
      window.location.href = "../profile-selection/profile-selection.html";
      return;
    }

    // Find tank in profile
    const tankIndex = profile.tanks
      ? profile.tanks.findIndex((t) => t.id === window.editingTankId)
      : -1;

    if (tankIndex === -1) {
      alert("Tank not found.");
      window.location.href = "../tank-manager/tank-manager.html";
      return;
    }

    // Get form values
    const tankName = $("#tank-name").val().trim();
    const tankSize = parseFloat($("#tank-size").val()) || null;
    const temperature = $("#tank-temperature").val()
      ? parseFloat($("#tank-temperature").val())
      : null;
    const ph = $("#tank-ph").val() ? parseFloat($("#tank-ph").val()) : null;
    const gh = $("#tank-gh").val() ? parseInt($("#tank-gh").val()) : null;
    const tankImage = $("#tank-image-preview").attr("src") || null;

    // Update tank object
    profile.tanks[tankIndex] = {
      ...profile.tanks[tankIndex], // Keep existing properties
      name: tankName,
      size: tankSize,
      temperature: temperature,
      ph: ph,
      gh: gh,
      image: tankImage,
      fish: window.selectedFish || [],
    };

    // Save updated profile
    localStorage.setItem("selectedProfile", JSON.stringify(profile));

    // Clear sessionStorage
    sessionStorage.removeItem("editingTankId");
    window.selectedFish = [];

    // Navigate back
    window.location.href = "../tank-manager/tank-manager.html";
  } catch (error) {
    console.error("Error saving tank:", error);
    alert("Error saving tank. Please try again.");
  }
}

function exitWithoutSaving() {
  sessionStorage.removeItem("editingTankId");
  window.selectedFish = [];
  window.location.href = "../tank-manager/tank-manager.html";
}

function decreaseFishQuantity(fishId) {
  if (!window.selectedFish) {
    return;
  }

  const fishIndex = window.selectedFish.findIndex(
    (f) => (f.fishId || f.id) == fishId
  );

  if (fishIndex >= 0) {
    const currentQuantity = window.selectedFish[fishIndex].quantity || 1;
    if (currentQuantity > 1) {
      window.selectedFish[fishIndex].quantity = currentQuantity - 1;
      displayCurrentFish();
    } else {
      // If quantity is 0 it removes the fish
      removeFish(fishId);
    }
  }
}

function increaseFishQuantity(fishId) {
  if (!window.selectedFish) {
    return;
  }

  const fishIndex = window.selectedFish.findIndex(
    (f) => (f.fishId || f.id) == fishId
  );

  if (fishIndex >= 0) {
    window.selectedFish[fishIndex].quantity =
      (window.selectedFish[fishIndex].quantity || 1) + 1;
    displayCurrentFish();
  }
}
