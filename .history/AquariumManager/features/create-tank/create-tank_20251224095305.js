import { searchFish, getAllFish } from "../../services/fish-api.js";

$(document).ready(function () {});

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
