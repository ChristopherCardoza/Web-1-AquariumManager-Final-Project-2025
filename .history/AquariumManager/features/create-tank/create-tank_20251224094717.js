import { searchFish, getAllFish } from "../../services/fish-api.js";

$(document).ready(function () {});

function initializePage() {
  const profile = getSelectedProfile();
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
