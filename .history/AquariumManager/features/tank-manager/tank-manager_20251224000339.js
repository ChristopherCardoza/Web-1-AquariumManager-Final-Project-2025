$(document).ready(function () {});

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
