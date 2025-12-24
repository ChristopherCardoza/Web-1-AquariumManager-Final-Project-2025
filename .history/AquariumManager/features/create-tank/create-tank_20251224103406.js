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
    $('#fish-search-suggestions').hide();
}

function showSuggestionsLoading() {
    const $suggestionsList = $('#suggestions-list');
    $suggestionsList.html('<div class="suggestion-item loading">Searching...</div>');
    $('#fish-search-suggestions').show();
}

function performFishSearch(query){

    if (query.length < 1) {
        hideSuggestions();
        return;
    }
    
    // Show loading state
    showSuggestionsLoading()

    if (window.allFishCache && window.allFishCache.length > 0) {
        const results = filterFishClientSide(query, window.allFishCache);
        displaySuggestions(results);
        return;
    }


    // if no cache it will use API search
    searchFish(query)
        .then(results => {
            displaySuggestions(results);
        })
        .catch(error => {
            console.error('Error searching fish:', error);
            showSuggestionsError();
        });


}

function filterFishClientSide(query, fishArray) {
    const lowerQuery = query.toLowerCase();
    return fishArray.filter(fish => {
        const commonName = (fish.CommonName || '').toLowerCase();
        const scientificName = (fish.ScientificName || '').toLowerCase();
        return commonName.includes(lowerQuery) || scientificName.includes(lowerQuery);
    });
}

function displaySuggestions(results) {
    const $suggestionsList = $('#suggestions-list');
    $suggestionsList.empty();
    
    if (!results || results.length === 0) {
        $suggestionsList.html('<div class="suggestion-item no-results">No fish found</div>');
        $('#fish-search-suggestions').show();
        return;
    }
    
    // Show at least 3 results, or all if less than 3
    const maxResults = Math.max(3, results.length);
    const displayResults = results.slice(0, maxResults);
    
    displayResults.forEach(function(fish) {
        const $suggestionItem = createSuggestionItem(fish);
        $suggestionsList.append($suggestionItem);
    });
    
    $('#fish-search-suggestions').show();
}

function showSuggestionsError() {
    const $suggestionsList = $('#suggestions-list');
    $suggestionsList.html('<div class="suggestion-item error">Error loading fish. Please try again.</div>');
    $('#fish-search-suggestions').show();
}

