$(document).ready(function () {
  loadProfileData();

  $(document).on("click", ".tank-card", function (e) {
    // Don't trigger if clicking delete button
    if ($(e.target).closest(".delete-tank-btn").length > 0) {
      return;
    }

    const tankId = $(this).data("tank-id");
    navigateToEditTank(tankId);
  });

  $(document).on("click", ".delete-tank-btn", function (e) {
    e.stopPropagation(); // Prevent tank card click
    const tankId = $(this).closest(".tank-card").data("tank-id");
    deleteTank(tankId);
  });

  // Add Tank button click
  $(document).on("click", "#add-tank-btn", function () {
    navigateToCreateTank();
  });
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

function createTankCard(tank) {
  // Calculate total fish count (will work with when I add the fish)
  const fishCount = tank.fish
    ? tank.fish.reduce(function (sum, fish) {
        return sum + (fish.quantity || 0);
      }, 0)
    : 0;

  // Format tank size
  const sizeText = tank.size ? tank.size + " gal" : "N/A";

  // Format pH
  const phText =
    tank.ph !== undefined && tank.ph !== null ? tank.ph.toString() : "N/A";

  // Format temperature
  const tempText = tank.temperature ? tank.temperature + "°F" : "N/A";

  // Format GH
  const ghText = tank.gh ? tank.gh + "ppm (gh)" : "N/A";

  // Create tank card HTML
  const $card = $("<div>")
    .addClass("tank-card glass-card")
    .attr("data-tank-id", tank.id);

  // Tank image
  const $imageContainer = $("<div>").addClass("tank-image-container");
  if (tank.image) {
    $("<img>")
      .addClass("tank-image")
      .attr("src", tank.image)
      .attr("alt", tank.name)
      .appendTo($imageContainer);
  } else {
    $("<div>")
      .addClass("tank-image-placeholder")
      .text("tank image")
      .appendTo($imageContainer);
  }

  // Tank name
  const $name = $("<h3>")
    .addClass("tank-name")
    .text(tank.name || "Unnamed Tank");

  // Tank details
  const $details = $("<div>").addClass("tank-details");

  $("<div>")
    .addClass("tank-detail-item")
    .html(
      '<span class="detail-label">size:</span> <span class="detail-value">' +
        sizeText +
        "</span>"
    )
    .appendTo($details);

  $("<div>")
    .addClass("tank-detail-item")
    .html(
      '<span class="detail-label">fish:</span> <span class="detail-value">' +
        fishCount +
        "</span>"
    )
    .appendTo($details);

  $("<div>")
    .addClass("tank-detail-item")
    .html(
      '<span class="detail-label">ph:</span> <span class="detail-value">' +
        phText +
        "</span>"
    )
    .appendTo($details);

  $("<div>")
    .addClass("tank-detail-item")
    .html(
      '<span class="detail-label">temperature:</span> <span class="detail-value">' +
        tempText +
        "</span>"
    )
    .appendTo($details);

  $("<div>")
    .addClass("tank-detail-item")
    .html(
      '<span class="detail-label">gh:</span> <span class="detail-value">' +
        ghText +
        "</span>"
    )
    .appendTo($details);

  // Delete button
  const $deleteBtn = $("<button>")
    .addClass("delete-tank-btn btn-danger")
    .attr("aria-label", "Delete tank")
    .html('<span class="trash-icon">🗑️</span>');

  // Assemble card
  $card.append($imageContainer);
  $card.append($name);
  $card.append($details);
  $card.append($deleteBtn);

  return $card;
}

function deleteTank(tankId) {
  // Confirm deletion
  if (
    !confirm(
      "Are you sure you want to delete this tank? This action cannot be undone."
    )
  ) {
    return;
  }

  try {
    // Load current profile
    const profileJson = localStorage.getItem("selectedProfile");
    if (!profileJson) {
      console.error("No profile found");
      return;
    }

    const profile = JSON.parse(profileJson);

    // Remove tank from tanks array
    if (profile.tanks && Array.isArray(profile.tanks)) {
      profile.tanks = profile.tanks.filter(function (tank) {
        return tank.id !== tankId;
      });

      // Save updated profile to localStorage
      localStorage.setItem("selectedProfile", JSON.stringify(profile));

      // Refresh display
      displayTanks(profile.tanks);

      console.log("Tank deleted:", tankId);
    }
  } catch (error) {
    console.error("Error deleting tank:", error);
    alert("Error deleting tank. Please try again.");
  }
}
