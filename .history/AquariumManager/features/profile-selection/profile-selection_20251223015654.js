import { user1, user2, getProfileById } from "../../constants/profiles.js";

function InitializeProfiles() {
  $("#user1-username").text(user1.username);
  if (user1.profilePic) {
    $("#user1-profile-img").attr("src", user1.profilePic).show();
    $('.profile-card[data-profile-id="user-1"] .profile-img').hide();
  }

  $("#user2-username").text(user2.username);
  if (user2.profilePic) {
    $("#user2-profile-img").attr("src", user2.profilePic).show();
    $('.profile-card[data-profile-id="user-2"] .profile-img').hide();
  }
}

// Dont know how to do this with jQuery
function saveProfileToLocalStorage(profile) {
    try {
        localStorage.setItem('selectedProfile', JSON.stringify(profile));
        console.log('Profile saved to localStorage:', profile.id);
    } catch (error) {
        console.error('Error saving profile to localStorage:', error);
        alert('Error saving profile. Please try again.');
    }
}