document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sidebar toggle functionality
    initSidebar();
    
    // Load feedback data to the page
    loadFeedbackData();
    
    // Add event listener for create button
    document.getElementById("createFeedbackButton").addEventListener("click", function(){
        location.href = "../../pages/MyFeedback/MyFeedback_NewFeedback.html";
    });
});

// -------------------- Script Sidebar
function initSidebar() {
    const toggleButton = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar');
    
    // Toggle sidebar on button click if toggle button exists
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
        toggleButton.classList.toggle('rotate');
    }
}

function closeAllSubMenus() {
    const sidebar = document.getElementById('sidebar');
    Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
        ul.classList.remove('show');
        ul.previousElementSibling.classList.remove('rotate');
    });
}
// -------------------- Batas Script Sidebar

// -------------------- Script untuk load data feedback
function loadFeedbackData() {
    const feedbackList = document.getElementById("feedbackList");
    
    // Clear current list
    feedbackList.innerHTML = "";
    
    // Check if we have data
    if (!feedbackData || feedbackData.length === 0) {
        feedbackList.innerHTML = `
            <div class="empty-feedback">
                <i class="far fa-comment-dots"></i>
                <p>Tidak ada data feedback saat ini</p>
            </div>
        `;
        return;
    }
    
    // Loop through the data and create list items
    feedbackData.forEach(feedback => {
        // Determine status icon and color
        let statusIcon, statusColor;
        
        switch(feedback.status) {
            case "processing":
                statusIcon = "fa-circle";
                statusColor = "orange";
                break;
            case "completed":
                statusIcon = "fa-check-circle";
                statusColor = "green";
                break;
            case "rejected":
                statusIcon = "fa-times-circle";
                statusColor = "red";
                break;
            default:
                statusIcon = "fa-circle";
                statusColor = "gray";
        }
        
        // Format date
        const formattedDate = formatDate(feedback.date);
        
        // Create list item
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span class="feedback-title">${feedback.title}</span>
            <span class="feedback-date">${formattedDate}</span>
            <span class="status">
                <i class="fas ${statusIcon}" style="color: ${statusColor}"></i>
                ${feedback.statusText}
            </span>
            <button class="viewDetailButton" data-feedback-id="${feedback.id}">Lihat Detail</button>
        `;
        
        feedbackList.appendChild(listItem);
    });
    
    // Add event listeners to detail buttons
    addDetailButtonListeners();
}

// Format date to more readable format (DD MMMM YYYY)
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', options);
}

// Add event listeners to detail buttons
function addDetailButtonListeners() {
    document.querySelectorAll(".viewDetailButton").forEach(button => {
        button.addEventListener("click", function() {
            const feedbackId = this.getAttribute("data-feedback-id");
            // Navigate to detail page with id parameter
            location.href = `../../pages/MyFeedback/MyFeedback_Details.html?id=${feedbackId}`;
        });
    });
}

// Function to filter feedback data (can be used later)
function filterFeedback(status) {
    const filteredData = status ? 
        feedbackData.filter(item => item.status === status) : 
        feedbackData;
    
    return filteredData;
}

// This function can be called when filter buttons are added to the UI
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            const filteredData = filterFeedback(status);
            
            // Display filtered data
            displayFilteredData(filteredData);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Function to display filtered data
function displayFilteredData(data) {
    // This function can be implemented when adding filtering functionality
    // For now, it's a placeholder
}