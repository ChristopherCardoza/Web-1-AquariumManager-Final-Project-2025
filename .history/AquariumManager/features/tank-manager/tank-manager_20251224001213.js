$(document).ready(function () {
  loadProfileData();
});

function displayProfileHeader(profile) {
  // Set profile image
  if (profile.profilePic) {
    $("#header-profile-img").attr("src", profile.profilePic).show();
    $(".profile-img-placeholder").hide();
  } else {
    $("#header-profile-img").hide();
    $(".profile-img-placeholder").show();
  }
}

function displayTanks(tanks) {
  const $container = $("#tanks-container");
  $container.empty(); // Clear existing tanks

  if (!tanks || tanks.length === 0) {
    // Show empty state message
    $container.html(
      '<p class="empty-state">No tanks yet. Click the + button to add your first tank!</p>'
    );
    return;
  }

  // Create tank cards for each tank
  tanks.forEach(function (tank) {
    const $tankCard = createTankCard(tank);
    $container.append($tankCard);
  });
}

function loadProfileData() {
  try {
    const profileJson = localStorage.getItem("selectedProfile");

    if (!profileJson) {
      // No profile selected, redirect to profile selection
      window.location.href = "../profile-selection/profile-selection.html";
      return;
    }

    const profile = JSON.parse(profileJson);

    // Display profile in header
    displayProfileHeader(profile);

    // Display tanks
    displayTanks(profile.tanks || []);
  } catch (error) {
    console.error("Error loading profile data:", error);
    alert("Error loading profile. Redirecting to profile selection.");
    window.location.href = "../profile-selection/profile-selection.html";
  }
}

function navigateToEditTank(tankId) {
  // Store tank ID in sessionStorage for the edit page to retrieve
  sessionStorage.setItem("editingTankId", tankId);
  window.location.href = "../edit-tank/edit-tank.html";
}

function navigateToCreateTank() {
  // Clear any editing state
  sessionStorage.removeItem("editingTankId");
  window.location.href = "../create-tank/create-tank.html";
}