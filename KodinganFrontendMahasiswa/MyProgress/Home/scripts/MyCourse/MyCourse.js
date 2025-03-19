document.addEventListener("DOMContentLoaded", function() {
    const recommendedTableBody = document.querySelector("#recommendedTable tbody");
    const historyTableBody = document.querySelector("#historyTable tbody");

    // Populate Recommended Courses Table
    recommendedCourses.forEach(course => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.code}</td>
            <td>${course.type}</td>
            <td>${course.sks}</td>
        `;
        row.classList.add("green-row"); // Apply green background
        recommendedTableBody.appendChild(row);
    });

    // Populate Course History Table
    courseHistory.forEach(course => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.code}</td>
            <td>${course.type}</td>
            <td>${course.sks}</td>
            <td>${course.indeks}</td>
            <td>${course.tingkat}</td>
        `;

        // Apply color based on grade
        if (course.indeks === "E") {
            row.classList.add("red-row");
        } else {
            row.classList.add("green-row");
        }

        historyTableBody.appendChild(row);
    });

    //Punya Sidebar:
    const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
    console.log("toggleSidebar function called");
    console.log("Sidebar classList before:", sidebar.classList);
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
    console.log("Sidebar classList after:", sidebar.classList);


    closeAllSubMenus()
}

function toggleSubMenu(button) {

    if(!button.nextElementSibling.classList.contains('show')){
        closeAllSubMenus()
    }

    button.nextElementSibling.classList.toggle('show');
    button.classList.toggle('rotate');

    if(sidebar.classList.contains('close')){
        sidebar.classList.toggle('close')
        toggleButton.classList.toggle('rotate')
    }

}

function closeAllSubMenus(){
    Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
        ul.classList.remove('show')
        ul.previousElementSibling.classList.remove('rotate')
    })
}

// Attach the event listener *after* the DOM is ready.
toggleButton.addEventListener('click', toggleSidebar);

});