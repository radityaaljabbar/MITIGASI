
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sidebar toggle functionality
    initSidebar();
    
    // Load and display data - Change loadStudentData to loadMockupData
    loadMockupData();
    
    // Set up evaluation buttons
    setupEvaluationButtons();
    
    // Remove or define handleResize function
    // window.addEventListener('resize', handleResize);
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

/**
 * Fungsi untuk memuat data mockup ke dalam elemen HTML.
 */
function loadMockupData() {
    const mockupData = {
        ringkasan: "Anda menunjukkan tingkat stres berat.",
        saran: "Pertimbangkan untuk melakukan konsultasi.",
        tanggalTes: "05-04-2024"
    };

    console.log("Loading mockup data:", mockupData);

    const ringkasanEl = document.querySelector(".ringkasanEvaluasiPsikologis");
    const saranEl = document.querySelector(".saranEvaluasiPsikologis");
    const tanggalTesEl = document.querySelector(".tanggalTes");

    if (!ringkasanEl || !saranEl || !tanggalTesEl) {
        console.error("Elemen hasil evaluasi tidak ditemukan!");
        return;
    }

    ringkasanEl.innerHTML = `<b>Ringkasan:</b> ${mockupData.ringkasan}`;
    saranEl.innerHTML = `<b>Saran:</b> ${mockupData.saran}`;
    tanggalTesEl.innerHTML = `<b>Tanggal Tes:</b> ${mockupData.tanggalTes}`;

    console.log("Mockup data loaded successfully.");
}

/**
 * Fungsi untuk mengatur event listener pada tombol Mulai Evaluasi Baru & Cetak.
 */
function setupEvaluationButtons() {
    const evalButton = document.querySelector(".startEvaluation");
    const printButton = document.querySelector(".printButton");

    if (evalButton) {
        evalButton.addEventListener("click", function () {
            console.log("Navigating to Evaluation Page...");
            window.location.href = "../../pages/MyWellness/MyWellness_AnalisisPsikologi.html";
        });
    } else {
        console.error("Tombol 'Mulai Evaluasi Baru' tidak ditemukan!");
    }

    if (printButton) {
        printButton.addEventListener("click", function () {
            console.log("Printing evaluation result...");
            window.print();
        });
    } else {
        console.error("Tombol 'Cetak' tidak ditemukan!");
    }

    console.log("Evaluation buttons initialized.");
}