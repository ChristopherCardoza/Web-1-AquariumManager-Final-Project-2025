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
