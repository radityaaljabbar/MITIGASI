document.addEventListener('DOMContentLoaded', function() {
    const landingContainer = document.querySelector('.landing-container');
    const loginContainer = document.querySelector('.login-container');
    const getStartedBtn = document.getElementById('get-started');
    const backToLandingBtn = document.getElementById('back-to-landing');
    const mahasiswaBtn = document.getElementById('sign-in-btn');
    const dosenBtn = document.getElementById('sign-up-btn');
  
    // Function to show the login page
    function showLoginPage() {
      // First make the login container visible
      loginContainer.classList.remove('hidden');
      
      // Wait a bit before starting the animation
      setTimeout(() => {
        landingContainer.classList.add('slide-up');
      }, 50);
    }
  
    // Function to show the landing page
    function showLandingPage() {
      landingContainer.classList.remove('slide-up');
      
      // Wait for the animation to complete before hiding the login container
      setTimeout(() => {
        loginContainer.classList.add('hidden');
      }, 1500);
    }
  
    // Toggle between Mahasiswa and Dosen Wali forms
    dosenBtn.addEventListener('click', () => {
      loginContainer.classList.add('sign-up-mode');
    });
  
    mahasiswaBtn.addEventListener('click', () => {
      loginContainer.classList.remove('sign-up-mode');
    });
  
    // Get Started button click event
    getStartedBtn.addEventListener('click', showLoginPage);
  
    // Back button click event
    backToLandingBtn.addEventListener('click', showLandingPage);
  });