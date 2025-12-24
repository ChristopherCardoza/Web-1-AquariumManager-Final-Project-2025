import { user1, user2, ProfileById } from "../../constants/profiles.js";

$(document).ready(function () {
  initializePreSetupProfiles();

  $(document).on("click", ".profile-card[data-profile-id]", function () {
    const profileId = $(this).data("profile-id");
    selectPreSetupProfile(profileId);
  });

  $("#custom-profile-pic").on("change", function (e) {
    handleProfilePictureUpload(e.target.files[0]);
  });

  $("#custom-username").on("input", function () {
    validateCustomProfile();
  });

  $(document).on("click", "#create-custom-profile-btn", function () {
    createCustomProfile();
  });
});

function initializePreSetupProfiles() {
  // Set User 1 data
  $("#user1-username").text(user1.username);
  if (user1.profilePic) {
    $("#user1-profile-img").attr("src", user1.profilePic).show();
    $(
      '.profile-card[data-profile-id="user-1"] .profile-img-placeholder'
    ).hide();
  }

  // Set User 2 data
  $("#user2-username").text(user2.username);
  if (user2.profilePic) {
    $("#user2-profile-img").attr("src", user2.profilePic).show();
    $(
      '.profile-card[data-profile-id="user-2"] .profile-img-placeholder'
    ).hide();
  }
}

function selectPreSetupProfile(profileId) {
  const profile = ProfileById(profileId);

  if (!profile) {
    console.error("Profile not found:", profileId);
    return;
  }

  // Store selected profile in localStorage
  saveProfileToLocalStorage(profile);

  // Navigate to tank manager
  navigateToTankManager();
}

function handleProfilePictureUpload(file) {
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

  const reader = new FileReader();

  reader.onload = function (e) {
    const imageUrl = e.target.result;
    $("#custom-profile-preview").attr("src", imageUrl).show();
    $(".profile-upload").hide();
  };

  reader.onerror = function () {
    alert("Error reading image file.");
  };

  reader.readAsDataURL(file);
}

function validateCustomProfile() {
  const username = $("#custom-username").val().trim();
  const hasImage = $("#custom-profile-pic")[0].files.length > 0;

  // Enable/disable create button based on validation
  if (username.length > 0) {
    $("#create-custom-profile-btn").prop("disabled", false);
  } else {
    $("#create-custom-profile-btn").prop("disabled", true);
  }
}

function createCustomProfile() {
  const username = $("#custom-username").val().trim();
  const profilePicFile = $("#custom-profile-pic")[0].files[0];

  // Validate username
  if (!username || username.length === 0) {
    alert("Please enter a username.");
    return;
  }

  if (username.length > 50) {
    alert("Username must be 50 characters or less.");
    return;
  }

  // Get profile picture (either uploaded or use placeholder)
  let profilePicUrl = "";

  if (profilePicFile) {
    // Use FileReader to convert to data URL
    const reader = new FileReader();
    reader.onload = function (e) {
      profilePicUrl = e.target.result;
      createCustomProfileObject(username, profilePicUrl);
    };
    reader.readAsDataURL(profilePicFile);
  } else {
    // if no picture uploaded I should have something here
  }
}

function createCustomProfileObject(username, profilePicUrl) {
  // Generate unique ID for custom profile
  const customProfileId = "custom-" + Date.now();

  // Create custom profile object
  const customProfile = {
    id: customProfileId,
    username: username.toLowerCase(),
    profilePic: profilePicUrl,
    tanks: [], // Start with no tanks
  };

  // Store selected profile in localStorage
  saveProfileToLocalStorage(customProfile);

  // Navigate to tank manager
  navigateToTankManager();
}

function saveProfileToLocalStorage(profile) {
  try {
    // Store the entire profile object
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
    console.log("Profile saved to localStorage:", profile.id);
  } catch (error) {
    console.error("Error saving profile to localStorage:", error);
    alert("Error saving profile. Please try again.");
  }
}

function navigateToTankManager() {
  window.location.href = "../tank-manager/tank-manager.html";
}
