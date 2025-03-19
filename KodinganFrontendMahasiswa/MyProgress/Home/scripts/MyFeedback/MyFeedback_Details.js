// -------------------- Script Sidebar
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sidebar toggle functionality
    initSidebar();
    
    // Load and display feedback details
    loadFeedbackDetails();
    
    // Add event listener to back button
    document.getElementById("backButton").addEventListener("click", function(){
        location.href = "../../pages/MyFeedback/MyFeedback_List.html";
    });
    
    // Handle resize events for responsive display
    window.addEventListener('resize', handleResize);
});

// Sidebar functionality
function initSidebar() {
    const toggleButton = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar');
    
    // Toggle sidebar on button click
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('close');
        toggleButton.classList.toggle('rotate');
        closeAllSubMenus();
    });
    
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

// Function to handle resize events
function handleResize() {
    // You can add responsive adjustments here if needed
}

// Function to load feedback details
function loadFeedbackDetails() {
    // Get the feedback ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const feedbackId = parseInt(urlParams.get('id')) || 1; // Default to 1 if no ID provided
    
    // Mock data for feedback and response
    const feedbackData = {
        id: feedbackId,
        title: "Masalah Pengajuan Cuti",
        date: "2024-07-20",
        feedbackDetail: "Saya ingin mengajukan cuti semester depan karena ada masalah kesehatan. Bagaimana prosedur pengajuannya dan dokumen apa saja yang diperlukan? Apakah ada batas waktu pengajuan cuti?",
        status: "completed",
        statusText: "Selesai"
    };
    
    const responseData = {
        date: "2024-07-22",
        response: "Untuk pengajuan cuti semester depan, Anda perlu mengisi formulir cuti yang tersedia di portal akademik. Dokumen yang diperlukan adalah surat keterangan dari dokter (untuk alasan kesehatan), surat permohonan cuti, dan transkrip nilai terbaru. Batas waktu pengajuan adalah 2 minggu sebelum masa registrasi semester baru. Silakan hubungi bagian akademik untuk informasi lebih lanjut."
    };
    
    // Display feedback details
    document.getElementById('feedbackDate').textContent = `Tanggal: ${feedbackData.date}`;
    document.querySelector('.detail-feedback h2').textContent = feedbackData.title;
    document.getElementById('feedbackDetails').textContent = feedbackData.feedbackDetail;
    
    // Display advisor's response
    document.getElementById('responseDate').textContent = `Tanggal: ${responseData.date}`;
    document.getElementById('advisorsResponse').textContent = responseData.response;
}