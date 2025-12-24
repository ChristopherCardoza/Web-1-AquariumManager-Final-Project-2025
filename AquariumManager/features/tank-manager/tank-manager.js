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
