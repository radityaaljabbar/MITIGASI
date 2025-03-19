// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Check if formQuestions is defined (should be loaded from questions.js)
    if (typeof formQuestions === 'undefined') {
        console.error('Error: formQuestions not found. Make sure questions.js is loaded before this script.');
        alert('Error loading form questions. Please contact support.');
        return; // Exit initialization if questions aren't available
    }

    // Initialize the sidebar toggle functionality
    initSidebar();
    
    // Initialize the form with dynamic questions
    initForm();
    
    // Handle resize events for responsive elements if needed
    window.addEventListener('resize', handleResize);
});

// Sidebar functionality
function initSidebar() {
    const toggleButton = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar');
    
    if (!toggleButton || !sidebar) {
        console.warn('Sidebar elements not found');
        return;
    }
    
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

// Placeholder for resize handler (you can implement based on your needs)
function handleResize() {
    // Handle resize events if needed
    // For example, redraw charts or adjust layouts
}

// Initialize the form with dynamic questions
function initForm() {
    // Get the form element
    const form = document.querySelector('.finance-form');
    
    if (!form) {
        console.error('Form element not found');
        return;
    }
    
    // Load questions dynamically
    loadFormQuestions(form);
    
    // Set up event listeners
    setupFormEventListeners(form);
}

// Function to dynamically load questions
function loadFormQuestions(form) {
    // Clear existing form content
    form.innerHTML = '';
    
    // Loop through each question and create form elements
    formQuestions.forEach(question => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        // Create label
        const label = document.createElement('label');
        label.setAttribute('for', question.id);
        label.textContent = `${question.number}. ${question.text}`;
        formGroup.appendChild(label);
        
        // Create input based on type
        let input;
        
        switch(question.type) {
            case 'text':
                input = document.createElement('input');
                input.type = 'text';
                input.id = question.id;
                input.placeholder = question.placeholder || '';
                break;
                
            case 'select':
                input = document.createElement('select');
                input.id = question.id;
                
                // Add options
                question.options.forEach(option => {
                    const optElement = document.createElement('option');
                    optElement.value = option.value;
                    optElement.textContent = option.text;
                    input.appendChild(optElement);
                });
                break;
                
            case 'file':
                input = document.createElement('input');
                input.type = 'file';
                input.id = question.id;
                input.name = question.id;
                input.accept = question.accept || '';
                break;
                
            default:
                input = document.createElement('input');
                input.type = 'text';
                input.id = question.id;
                break;
        }
        
        // Set required attribute if needed
        if (question.required) {
            input.required = true;
        }
        
        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'submit-button';
    submitButton.id = 'submit-button';
    
    const submitSpan = document.createElement('span');
    submitSpan.textContent = 'Submit';
    submitButton.appendChild(submitSpan);
    
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'cancel-button';
    cancelButton.id = 'cancel-button';
    
    const cancelSpan = document.createElement('span');
    cancelSpan.textContent = 'Batal';
    cancelButton.appendChild(cancelSpan);
    
    buttonContainer.appendChild(submitButton);
    buttonContainer.appendChild(cancelButton);
    
    form.appendChild(buttonContainer);
}

// Set up form event listeners
function setupFormEventListeners(form) {
    // Submit form handling
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        const formValues = {};
        
        formQuestions.forEach(question => {
            if (question.type === 'file') {
                formValues[question.id] = formData.get(question.id);
            } else {
                const element = document.getElementById(question.id);
                if (element) {
                    formValues[question.id] = element.value;
                }
            }
        });
        
        // Here you can handle form submission
        console.log('Form submitted with values:', formValues);
        
        // You can send this data to your server
        // submitFormToServer(formData);
        
        alert('Form submitted successfully!');
    });
    
    // Cancel button
    const cancelButton = document.getElementById('cancel-button');
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            location.href = "../../pages/MyFinance/MyFinance_Main.html";
        });
    }
}