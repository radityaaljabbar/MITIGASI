//-------------------
// Sidebar Scripts
//-------------------
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sidebar toggle functionality
    initSidebar();
    
    // Load and display data 
    populateHistoryTable();
    
    // Setup back button functionality
    setupBackButton();
  });
  
  // Sidebar functionality
  function initSidebar() {
    const toggleButton = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar');
    
    // Toggle sidebar on button click
    if (toggleButton) {
      toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('close');
        toggleButton.classList.toggle('rotate');
        closeAllSubMenus();
      });
    }
    
    // Add event listeners to dropdown buttons if they exist
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');
    dropdownButtons.forEach(button => {
      button.addEventListener('click', function() {
        toggleSubMenu(this);
      });
    });
  }
  
  function toggleSubMenu(button) {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-btn');
    
    if(!button.nextElementSibling.classList.contains('show')) {
      closeAllSubMenus();
    }
    
    button.nextElementSibling.classList.toggle('show');
    button.classList.toggle('rotate');
    
    if(sidebar.classList.contains('close')) {
      sidebar.classList.toggle('close');
      if (toggleButton) {
        toggleButton.classList.toggle('rotate');
      }
    }
  }
  
  function closeAllSubMenus() {
    const sidebar = document.getElementById('sidebar');
    Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
      ul.classList.remove('show');
      ul.previousElementSibling.classList.remove('rotate');
    });
  }
  
  //-------------------
  // History Page Scripts
  //-------------------
  
  // Handle back button
  function setupBackButton() {
    const backButton = document.querySelector('.back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        // Navigate back or to specific page
        window.location.href = '../../pages/MyFinance/MyFinance_Main.html'; // Change this to your desired page
      });
    }
  }
  
  // Function for later use when real data is available
  async function fetchHistoryData() {
    try {
      // This will be replaced with actual API call when backend is ready
      // const response = await fetch('/api/history');
      // const data = await response.json();
      // return data;
      
      // For now, return mock data
      return historyMockData;
    } catch (error) {
      console.error('Error fetching history data:', error);
      return { totalEntries: 0, histories: [] };
    }
  }