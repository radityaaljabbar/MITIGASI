// FeedbackBaru.js
document.addEventListener('DOMContentLoaded', function() {
    const cancelButton = document.getElementById('cancelButton');

    cancelButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission
        window.location.href = '../myfeedback/myfeedback.html'; // Redirect to MyFeedback.html
    });
});