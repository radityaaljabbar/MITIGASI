// -------------------- Sidebar Content Scripts
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


// -------------------- Main Content Scripts
// Enhanced questionnaire functionality
document.addEventListener("DOMContentLoaded", function() {
    const questionsContainer = document.getElementById("questions-container");
    
    // Generate questions dynamically with enhanced UI
    questions.forEach((item, index) => {
        const questionBox = document.createElement("div");
        questionBox.classList.add("question-box");
        questionBox.dataset.questionId = index;
        
        // Question number and text
        const questionTitle = document.createElement("h2");
        questionTitle.innerText = `Pertanyaan ${index + 1}: ${item.question}`;
        questionBox.appendChild(questionTitle);
        
        // Answer choices
        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("options");
        
        item.choices.forEach((choice, choiceIndex) => {
            const label = document.createElement("label");
            const input = document.createElement("input");
            
            input.type = "radio";
            input.name = `question${index}`;
            input.value = choice;
            input.id = `question${index}_choice${choiceIndex}`;
            
            // Add change event to highlight selected answer
            input.addEventListener('change', function() {
                // Remove highlight from all options in this question
                const labels = optionsContainer.querySelectorAll('label');
                labels.forEach(l => l.classList.remove('selected'));
                
                // Add highlight to selected option
                if (this.checked) {
                    this.parentElement.classList.add('selected');
                    
                    // Mark question as answered
                    questionBox.classList.add('answered');
                }
            });
            
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${choice}`));
            optionsContainer.appendChild(label);
        });
        
        questionBox.appendChild(optionsContainer);
        questionsContainer.appendChild(questionBox);
    });
    
    // Form validation and submission
    document.getElementById("quiz-form").addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Check if all questions are answered
        const unansweredQuestions = [];
        
        questions.forEach((item, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            if (!selectedOption) {
                unansweredQuestions.push(index + 1);
            }
        });
        
        if (unansweredQuestions.length > 0) {
            // Alert for unanswered questions
            alert(`Mohon jawab pertanyaan nomor: ${unansweredQuestions.join(', ')}`);
            
            // Highlight unanswered questions
            unansweredQuestions.forEach(qNum => {
                const questionBox = document.querySelector(`[data-question-id="${qNum - 1}"]`);
                questionBox.classList.add('unanswered');
                
                // Scroll to first unanswered question
                if (qNum === unansweredQuestions[0]) {
                    questionBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Remove warning highlight after 3 seconds
                setTimeout(() => {
                    questionBox.classList.remove('unanswered');
                }, 3000);
            });
            
            return;
        }
        
        // Collect and process answers
        const answers = {};
        questions.forEach((item, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            answers[`Pertanyaan ${index + 1}`] = selectedOption.value;
        });
        
        console.log("Jawaban yang dipilih:", answers);
        
        // Show loading state on button
        const submitButton = document.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span>Mengirim...</span>';
        submitButton.disabled = true;
        
        // Simulate submission process (replace with actual submission)
        setTimeout(() => {
            alert("Jawaban telah dikirim!");
            location.href = "../../pages/MyWellness/MyWellness_SudahTes.html";
        }, 1000);
    });
});

// Add these styles dynamically
const style = document.createElement('style');
style.textContent = `
    .question-box.answered {
        border-left: 4px solid #4CAF50;
    }
    
    .question-box.unanswered {
        border: 2px solid #ff5252;
        animation: pulse 1.5s infinite;
    }
    
    .options label.selected {
        background-color: #e8f4ff;
        border-left: 3px solid #188EDC;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255,82,82, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(255,82,82, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255,82,82, 0); }
    }
`;
document.head.appendChild(style);
