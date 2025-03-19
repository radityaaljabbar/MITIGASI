document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sidebar toggle functionality
    initSidebar();
    
    // Load and display data
    loadStudentData();
    
    // Handle resize events for responsive charts
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

// Data loading and chart rendering
function loadStudentData() {
    // Mockup data - in a real application, this would come from an API
    const semesterData = [
        { semester: "1st", gpa: 3.75 },
        { semester: "2nd", gpa: 3.82 },
        { semester: "3rd", gpa: 3.90 },
        { semester: "4th", gpa: 3.68 },
        { semester: "5th", gpa: 3.78 },
        { semester: "6th", gpa: 3.85 },
        { semester: "7th", gpa: 3.92 },
        { semester: "8th", gpa: 3.95 },
    ];
  
    const ipkValue = 3.83;
    const sksValue = 144;
    const takValue = 180;
  
    // Attendance data (mockup)
    const attendanceData = [
        { month: "Jan", attendance: 95 },
        { month: "Feb", attendance: 98 },
        { month: "Mar", attendance: 92 },
        { month: "Apr", attendance: 100 },
        { month: "May", attendance: 96 },
        { month: "Jun", attendance: 94 },
        { month: "Jul", attendance: 99 },
        { month: "Aug", attendance: 97 },
        { month: "Sep", attendance: 93 },
        { month: "Oct", attendance: 95 },
        { month: "Nov", attendance: 90 },
        { month: "Dec", attendance: 98 },
    ];
    
    // Display semester GPA data
    displaySemesterData(semesterData);
    
    // Display summary data
    displaySummaryData(ipkValue, sksValue, takValue);
    
    // Create charts
    createSemesterChart(semesterData);
    createAttendanceChart(attendanceData);
    
    // Set academic status based on GPA
    setAcademicStatus(ipkValue);
}

function displaySemesterData(semesterData) {
    const listIPSemester = document.getElementById("listIPSemester");
    
    // Clear any existing content
    listIPSemester.innerHTML = '';
    
    // Add each semester to the list
    semesterData.forEach(item => {
        const listItem = document.createElement("li");
        
        // Create spans for each part of the data
        const semesterSpan = document.createElement("span");
        semesterSpan.textContent = `${item.semester} Semester`;
        
        const separatorSpan = document.createElement("span");
        separatorSpan.textContent = ":";
        
        const gpaSpan = document.createElement("span");
        gpaSpan.textContent = item.gpa.toFixed(2);
        
        // Add spans to list item
        listItem.appendChild(semesterSpan);
        listItem.appendChild(separatorSpan);
        listItem.appendChild(gpaSpan);
        
        // Add the list item to the list
        listIPSemester.appendChild(listItem);
    });
}

function displaySummaryData(ipk, sks, tak) {
    document.getElementById("ipkValue").textContent = ipk.toFixed(2);
    document.getElementById("sksValue").textContent = sks;
    document.getElementById("takValue").textContent = tak;
}

function setAcademicStatus(ipk) {
    const statusElement = document.getElementById("academicStatus");
    let status = "Normal";
    let color = "blue";
    
    // Define status based on IPK
    if (ipk >= 3.75) {
        status = "Excellent";
        color = "green";
    } else if (ipk >= 3.5) {
        status = "Very Good";
        color = "#007700";
    } else if (ipk >= 3.0) {
        status = "Good";
        color = "#009900";
    } else if (ipk >= 2.5) {
        status = "Satisfactory";
        color = "orange";
    } else if (ipk >= 2.0) {
        status = "Needs Improvement";
        color = "#ff8800";
    } else {
        status = "Critical";
        color = "red";
    }
    
    statusElement.textContent = status;
    statusElement.style.color = color;
}

// Chart creation functions with responsive options
function createSemesterChart(semesterData) {
    const semesterLabels = semesterData.map(item => item.semester + " Semester");
    const semesterGPAs = semesterData.map(item => item.gpa);
    
    const ctxIPS = document.getElementById('IPSemesterChart').getContext('2d');
    
    window.semesterChart = new Chart(ctxIPS, {
        type: 'bar',
        data: {
            labels: semesterLabels,
            datasets: [{
                label: 'Semester GPA',
                data: semesterGPAs,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4.0,
                    ticks: {
                        stepSize: 0.5
                    }
                }
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Semester GPA Chart',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

function createAttendanceChart(attendanceData) {
    const attendanceMonths = attendanceData.map(item => item.month);
    const attendancePercentages = attendanceData.map(item => item.attendance);
    
    const ctxAttendance = document.getElementById('attendanceChart').getContext('2d');
    
    window.attendanceChart = new Chart(ctxAttendance, {
        type: 'line',
        data: {
            labels: attendanceMonths,
            datasets: [{
                label: 'Attendance (%)',
                data: attendancePercentages,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 10
                    }
                }
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Monthly Attendance Chart',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Handle window resize for responsive charts
function handleResize() {
    // Update charts if they exist
    if (window.semesterChart) {
        window.semesterChart.resize();
    }
    
    if (window.attendanceChart) {
        window.attendanceChart.resize();
    }
    
    // Check if on mobile and adjust sidebar
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 800 && !sidebar.classList.contains('close')) {
        sidebar.classList.add('close');
    }
}