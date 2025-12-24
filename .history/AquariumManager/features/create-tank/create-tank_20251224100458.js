import { searchFish, getAllFish } from "../../services/fish-api.js";

$(document).ready(function () {
  initializePage();
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

function setupEventHandlers() {}

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
