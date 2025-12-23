import { user1, user2, ProfileById } from "../../constants/profiles.js";

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


function saveProfileToLocalStorage(profile) {
    try {
        localStorage.setItem('selectedProfile', JSON.stringify(profile));
        console.log('Profile saved to localStorage:', profile.id);
    } catch (error) {
        console.error('Error saving profile to localStorage:', error);
        alert('Error saving profile. Please try again.');
    }
}

function navigateToTankManager() {
    window.location.href = '../tank-manager/tank-manager.html';
}

$(document).ready(function(){

    InitializeProfiles();
    $(document).on('click', '.profile-card[data-profile-id]', function() {
        const profileId = $(this).data('profile-id');
        
    });

   
});

 function handleProfilePictureUpload(file) {
    if (!file) {
        return;
    }
    
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB.');
        return;
    }
    
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        $('#custom-profile-preview').attr('src', imageUrl).show();
        $('.profile-upload-placeholder').hide();
    };
    
    reader.onerror = function() {
        alert('Error reading image file.');
    };
    
    reader.readAsDataURL(file);
}


function selectPreSetupProfile(profileId) {
    const profile = ProfileById(profileId);
    
    if (!profile) {
        console.error('Profile not found:', profileId);
        return;
    }
    
    saveProfileToLocalStorage(profile);
    navigateToTankManager();
}


